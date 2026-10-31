import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const tagPattern = /^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

export function latestBySeries(releases) {
  const selected = new Map();
  for (const release of releases) {
    const match = tagPattern.exec(release.tag_name);
    if (!match || release.draft || release.prerelease) continue;
    const series = `v${match[1]}.${match[2]}`;
    const previous = selected.get(series);
    if (!previous || BigInt(match[3]) > BigInt(previous.tag_name.split('.')[2])) {
      selected.set(series, release);
    }
  }
  return selected;
}

export async function reconcile({ releases, active, readOnline, resolveCommit, dispatch, forceTag = '' }) {
  if (active) return ['已有部署任务运行，本次跳过'];
  const messages = [];
  for (const [series, release] of latestBySeries(releases)) {
    const tag = release.tag_name;
    if (forceTag && forceTag !== tag) continue;
    const commit = await resolveCommit(tag);
    const online = await readOnline(series);
    if (!forceTag && online?.version === tag && online?.commit === commit) {
      messages.push(`${series} 已是 ${tag}`);
      continue;
    }
    await dispatch(tag);
    messages.push(`已调度 ${tag}`);
  }
  if (forceTag && !messages.length) throw new Error('指定版本不是该系列最新正式 Release');
  return messages;
}

async function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo !== 'yangqiang5156/dip-proto') throw new Error('只允许操作本项目仓库');
  const request = async (path, options = {}) => {
    const response = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
      ...options,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GH_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub 请求失败：${response.status} ${path}`);
    return response.status === 204 ? null : response.json();
  };
  const releases = [];
  for (let page = 1; ; page++) {
    const items = await request(`releases?per_page=100&page=${page}`);
    releases.push(...items);
    if (items.length < 100) break;
    if (page >= 20) throw new Error('Release 数量超过自动检查上限');
  }
  const runs = await request('actions/workflows/release.yml/runs?per_page=100');
  const active = runs.workflow_runs.some(run => ['queued', 'in_progress', 'waiting', 'pending', 'requested'].includes(run.status));
  const messages = await reconcile({
    releases, active, forceTag: process.env.FORCE_TAG || '',
    readOnline: async series => {
      const response = await fetch(`https://ai.liqi123.com/work/dip-proto/${series}/release.json`, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`公网版本查询失败：${response.status}`);
      return response.json();
    },
    resolveCommit: tag => execFileSync('git', ['rev-parse', `${tag}^{commit}`], { encoding: 'utf8' }).trim(),
    dispatch: tag => request('actions/workflows/release.yml/dispatches', { method: 'POST', body: JSON.stringify({ ref: 'main', inputs: { tag } }) }),
  });
  console.log(messages.join('\n') || '暂无正式 Release');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
