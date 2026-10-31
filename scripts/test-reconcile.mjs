import { test } from 'node:test';
import assert from 'node:assert/strict';
import { latestBySeries, reconcile } from './reconcile-releases.mjs';
const release = (tag, extra = {}) => ({ tag_name: tag, draft: false, prerelease: false, ...extra });
test('各系列选最高补丁，忽略草稿、预发布与非法标签', () => {
  const selected = latestBySeries([release('v2.0.2'), release('v2.0.10'), release('v2.1.0'), release('v2.0.99', {draft:true}), release('v2.1.99', {prerelease:true}), release('../evil')]);
  assert.deepEqual([...selected].map(([series,r])=>[series,r.tag_name]), [['v2.0','v2.0.10'],['v2.1','v2.1.0']]);
});
test('只补齐未上线系列，保持已上线版本不动', async () => {
  const dispatched=[];
  await reconcile({releases:[release('v2.0.1'),release('v2.1.0')],active:false,resolveCommit:()=> 'abc',readOnline:series=>series==='v2.0'?{version:'v2.0.1',commit:'abc'}:null,dispatch:tag=>dispatched.push(tag)});
  assert.deepEqual(dispatched,['v2.1.0']);
});
test('已有部署时不重复调度',async()=>{
  await reconcile({active:true,releases:[release('v2.0.1')],dispatch:()=>assert.fail('不应调度')});
});
test('公网同标签但提交不符时会补齐',async()=>{
  const dispatched=[];
  await reconcile({releases:[release('v2.0.0')],active:false,resolveCommit:()=> 'correct',readOnline:()=>({version:'v2.0.0',commit:'wrong'}),dispatch:tag=>dispatched.push(tag)});
  assert.deepEqual(dispatched,['v2.0.0']);
});
test('手动演练复用已发布正式版本',async()=>{
  const dispatched=[];
  await reconcile({releases:[release('v2.0.0')],active:false,forceTag:'v2.0.0',resolveCommit:()=> 'abc',readOnline:()=>({version:'v2.0.0',commit:'abc'}),dispatch:tag=>dispatched.push(tag)});
  assert.deepEqual(dispatched,['v2.0.0']);
});
