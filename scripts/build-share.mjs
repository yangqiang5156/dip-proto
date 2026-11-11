import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(rootDir, '.share-build');
const outputFile = path.join(rootDir, 'dip-proto-share.html');
const viteCommand = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

function resolveBuiltAsset(assetUrl) {
  return path.join(buildDir, assetUrl.replace(/^\.?\//, ''));
}

rmSync(buildDir, { recursive: true, force: true });

try {
  execFileSync(
    process.execPath,
    [viteCommand, 'build', '--outDir', buildDir, '--emptyOutDir'],
    {
      cwd: rootDir,
      env: { ...process.env, VITE_STANDALONE: 'true' },
      stdio: 'inherit',
    },
  );

  let html = readFileSync(path.join(buildDir, 'index.html'), 'utf8');

  html = html.replace(
    /<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi,
    (tag) => {
      const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
      if (!href) return tag;
      const css = readFileSync(resolveBuiltAsset(href), 'utf8').replace(/<\/style/gi, '<\\/style');
      return `<style data-inline-source="${href}">\n${css}\n</style>`;
    },
  );

  html = html.replace(
    /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi,
    (_tag, src) => {
      const javascript = readFileSync(resolveBuiltAsset(src), 'utf8').replace(/<\/script/gi, '<\\/script');
      return `<script type="module" data-inline-source="${src}">\n${javascript}\n</script>`;
    },
  );

  const externalAsset = html.match(/(?:src|href)=["'](?!data:|#|https?:|mailto:)([^"']+)["']/i);
  if (externalAsset) {
    throw new Error(`Standalone HTML still references an external asset: ${externalAsset[1]}`);
  }

  html = html.replace(
    '<head>',
    '<head>\n  <script>if (!window.location.hash) window.location.hash = "/";</script>',
  );

  html = html.replace(
    '</head>',
    '  <meta name="generator" content="dip-proto standalone share build" />\n  <!-- 单文件离线演示：脚本、样式和图片均已内嵌。 -->\n</head>',
  );

  html = html.replace(/[ \t]+$/gm, '');

  writeFileSync(outputFile, html, 'utf8');
  console.log(`\nStandalone HTML created: ${outputFile}`);
} finally {
  rmSync(buildDir, { recursive: true, force: true });
}
