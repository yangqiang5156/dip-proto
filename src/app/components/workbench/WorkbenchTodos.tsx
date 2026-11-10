import { Link } from 'react-router';
import { ArrowRight, CheckCheck, ClipboardCheck, FileText, ListChecks } from 'lucide-react';
import { approvalRecords, getPendingApprovals, type ApprovalRecord } from '../../data/approvalRecords';
import { RequestTypeBadge } from '../approval-center/RequestTypeBadge';

export function WorkbenchTodos({ records = approvalRecords }: { records?: ApprovalRecord[] }) {
  const pending = getPendingApprovals(records);
  return (
    <section className="wb-todos-panel" aria-labelledby="wb-todos-heading">
      <header className="wb-section-head wb-todos-header">
        <div><h2 id="wb-todos-heading">我的待办<span className="wb-todos-count" aria-label={`${pending.length} 条待办`}>{pending.length}</span></h2><p>来自审批中心 · 待我处理的申请</p></div>
        <Link to="/approval-center/my-approvals" className="wb-text-action">全部审批<ArrowRight size={15} aria-hidden="true" /></Link>
      </header>
      {pending.length > 0 ? <>
        <div className="wb-todos-grid">{pending.map((item) => <article className="wb-todo-card" key={item.id}>
          <div className="wb-todo-top"><RequestTypeBadge type={item.requestType} /><span className="wb-todo-status"><i aria-hidden="true" />待审批</span></div>
          <h3 title={item.entryName}>{item.entryName}</h3>
          <p className="wb-todo-id">{item.requestId}</p>
          <dl><div><dt>申请人</dt><dd>{item.applicant}<span> · {item.department}</span></dd></div><div><dt>当前节点</dt><dd>{item.currentNode}</dd></div><div><dt>更新时间</dt><dd><time dateTime={item.updatedAt.replace(' ', 'T') + '+08:00'}>{item.updatedAt.slice(0, 16)}</time></dd></div></dl>
          <div className="wb-todo-footer"><span>{item.module}{item.classificationLevel && ` · ${item.classificationLevel}`}</span><Link to={`/approval-center/approval/${item.id}`} aria-label={`去处理 ${item.entryName}`}>去处理<ArrowRight size={14} aria-hidden="true" /></Link></div>
        </article>)}</div>
      </> : <div className="wb-todos-empty">
        <div className="wb-todos-empty-hero"><span className="wb-todos-done-icon"><CheckCheck size={32} aria-hidden="true" /></span><h3>当前没有待处理的审批</h3><p>待我处理的申请会在这里集中展示。现在可以回顾审批记录，或继续处理自己的申请。</p><Link to="/approval-center/my-approvals" className="wb-todos-primary">查看我的审批<ArrowRight size={15} aria-hidden="true" /></Link></div>
        <div className="wb-todos-shortcuts"><Link to="/approval-center/my-applications"><FileText size={22} aria-hidden="true" /><span><strong>我的申请</strong><small>查看已发起申请的进展</small></span><ArrowRight size={16} aria-hidden="true" /></Link><Link to="/approval-center/all-records"><ListChecks size={22} aria-hidden="true" /><span><strong>全部记录</strong><small>回顾审批结果与历史记录</small></span><ArrowRight size={16} aria-hidden="true" /></Link></div>
        <p className="wb-todos-empty-note"><ClipboardCheck size={16} aria-hidden="true" />审批时请核对申请用途、数据范围和授权要求。</p>
      </div>}
    </section>
  );
}
