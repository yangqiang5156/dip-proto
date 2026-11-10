import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, CheckCircle2, LockKeyhole } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { getMenuSource } from '../workbenchData';
import { requestableMenus } from '../data/menuAccess';

export default function MenuPermissionApplication() {
  const [params, setParams] = useSearchParams();
  const item = requestableMenus.find((menu) => menu.path === params.get('menu'));
  const [reason, setReason] = useState('');
  const [validity, setValidity] = useState('30');
  const [submittedId, setSubmittedId] = useState('');
  const [error, setError] = useState('');
  const [workspace] = useState(() => { try { return window.localStorage.getItem('dip-proto.workspace') || '数据平台'; } catch { return '数据平台'; } });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!item || !reason.trim()) { setError('请选择功能并填写申请理由。'); return; }
    const id = `MP${Date.now()}`;
    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem('dip-proto.menu-permission-applications') || '[]');
      const applications = Array.isArray(stored) ? stored : [];
      window.localStorage.setItem('dip-proto.menu-permission-applications', JSON.stringify([{ id, menuPath: item.path, menuLabel: item.label, workspace, reason: reason.trim(), validity, createdAt: new Date().toISOString() }, ...applications]));
      setSubmittedId(id);
    } catch { setError('申请保存失败，请稍后重试。'); }
  };
  return <div className="w-full min-w-0 p-4 xl:p-6">
    <Link to="/workbench" className="mb-5 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary"><ArrowLeft size={16} />返回工作台</Link>
    <h1 className="text-xl font-semibold text-text-primary">功能访问权限申请</h1>
    <p className="mb-6 mt-2 text-sm text-text-secondary">申请所需的功能访问权限，审批通过后即可使用。</p>
    {submittedId ? <div className="rounded-lg border bg-white p-8 text-center">
      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-success" /><h2 className="text-lg font-semibold">申请已提交</h2><p className="mt-3 text-sm text-text-secondary">申请功能：{item?.label} · {workspace}</p><p className="mt-2 text-sm text-text-secondary">申请单号：{submittedId}</p><p className="mt-2 text-sm text-text-secondary">提交申请不会立即开通权限，请等待审批结果。</p><Button asChild className="mt-6"><Link to="/workbench">返回工作台</Link></Button>
    </div> : <form onSubmit={submit} className="rounded-lg border bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><LockKeyhole size={19} className="shrink-0" /><p>你尚未获得{item ? `“${item.label}”` : '所选功能'}的访问权限，请说明业务用途后提交申请。</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">申请功能<span className="ml-1 text-destructive">*</span><select required value={item?.path || ''} onChange={(event) => { setParams({ menu: event.target.value }, { replace: true }); setError(''); }} className="mt-2 h-10 w-full rounded-md border bg-white px-3 text-sm"><option value="" disabled>请选择需要申请的功能</option>{requestableMenus.map((menu) => <option key={menu.path} value={menu.path}>{menu.label}</option>)}</select></label>
        <label className="text-sm font-medium">申请权限<Input className="mt-2" value="页面访问" readOnly /></label>
        <label className="text-sm font-medium">工作空间<Input className="mt-2" value={workspace} readOnly /></label>
        <label className="text-sm font-medium">申请人<Input className="mt-2" value="杨强" readOnly /></label>
        <label className="text-sm font-medium md:col-span-2">菜单位置<Input className="mt-2" value={item ? getMenuSource(item) + ' / ' + item.label : ''} readOnly /></label>
        <label className="text-sm font-medium">有效期<select value={validity} onChange={(event) => setValidity(event.target.value)} className="mt-2 h-10 w-full rounded-md border bg-white px-3 text-sm"><option value="30">30 天</option><option value="90">90 天</option><option value="180">180 天</option></select></label>
        <label className="text-sm font-medium md:col-span-2">申请理由<span className="ml-1 text-destructive">*</span><Textarea className="mt-2 min-h-28" required maxLength={500} value={reason} onChange={(event) => { setReason(event.target.value); setError(''); }} placeholder="请描述业务用途、使用场景及申请原因" /><span className="mt-1 block text-right text-xs text-text-secondary">{reason.length}/500</span></label>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex gap-3 border-t pt-5"><Button type="submit">提交申请</Button><Button variant="outline" asChild><Link to="/workbench">取消</Link></Button></div>
    </form>}
  </div>;
}
