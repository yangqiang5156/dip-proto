"""发布路径、版本隔离、不可变性与归档安全检查。"""
import hashlib
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
import receive


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        receive.ROOT = Path(self.temp.name) / 'deploy'
        receive.PUBLIC = Path(self.temp.name) / 'public'
        for path in [receive.ROOT / 'releases', receive.ROOT / 'archives', receive.PUBLIC]:
            path.mkdir(parents=True, exist_ok=True)

    def package(self, tag, unsafe=False):
        parts = tag[1:].split('.')
        base = '/work/dip-proto/v' + '.'.join(parts[:2]) + '/'
        files = {'index.html': f'<script src="{base}assets/app.js"></script>', 'assets/app.js': 'console.log("ok")', 'release.json': json.dumps({'version': tag, 'commit': 'a' * 40, 'basePath': base})}
        data = io.BytesIO()
        with tarfile.open(fileobj=data, mode='w:gz') as tar:
            for name, body in files.items():
                entry = tarfile.TarInfo('../escape' if unsafe and name == 'index.html' else name)
                payload = body.encode()
                entry.size = len(payload)
                tar.addfile(entry, io.BytesIO(payload))
        return data.getvalue()

    def publish(self, tag, data=None):
        data = self.package(tag) if data is None else data
        receive.receive(f'{tag} {"a" * 40} {hashlib.sha256(data).hexdigest()}', io.BytesIO(data))

    def test_series_are_independent(self):
        self.publish('v2.0.0')
        self.publish('v2.1.0')
        self.publish('v2.0.1')
        self.assertEqual((receive.PUBLIC / 'v2.0').resolve().name, 'v2.0.1')
        self.assertEqual((receive.PUBLIC / 'v2.1').resolve().name, 'v2.1.0')
        self.assertTrue((receive.ROOT / 'releases/v2.0.0/index.html').exists())
        self.assertIn('v2.0.0', (receive.ROOT / 'archives/v2.0.previous').read_text())
        data = (receive.ROOT / 'archives/v2.0.1.tar.gz').read_bytes()
        self.publish('v2.0.1', data)
        self.assertIn('v2.0.0', (receive.ROOT / 'archives/v2.0.previous').read_text())

    def test_old_patch_cannot_replace_new_patch(self):
        self.publish('v2.0.2')
        with self.assertRaises(ValueError):
            self.publish('v2.0.1')
        self.assertEqual((receive.PUBLIC / 'v2.0').resolve().name, 'v2.0.2')

    def test_identical_retry_is_allowed(self):
        data = self.package('v2.0.0')
        self.publish('v2.0.0', data)
        self.publish('v2.0.0', data)

    def test_release_cannot_be_overwritten(self):
        self.publish('v2.0.0')
        data = self.package('v2.0.0') + b'different'
        with self.assertRaises(ValueError):
            self.publish('v2.0.0', data)

    def test_path_traversal_is_rejected(self):
        with self.assertRaises(ValueError):
            self.publish('v2.0.0', self.package('v2.0.0', unsafe=True))
        self.assertFalse((receive.ROOT / 'escape').exists())

    def test_digest_mismatch_is_rejected(self):
        with self.assertRaises(ValueError):
            receive.receive(f'v2.0.0 {"a" * 40} {"b" * 64}', io.BytesIO(b'wrong'))

    def test_command_injection_is_rejected(self):
        for command in ['v2.0.0; id', '../evil', f'v2.0.0-beta {"a" * 40} {"b" * 64}']:
            with self.assertRaises(ValueError):
                receive.receive(command, io.BytesIO())


if __name__ == '__main__':
    unittest.main()
