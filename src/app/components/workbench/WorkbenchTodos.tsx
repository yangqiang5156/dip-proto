import { Link } from 'react-router';
import { Activity, ArrowRight, BarChart3, CheckCheck, Code2, UserRoundSearch } from 'lucide-react';
import { approvalRecords, getPendingApprovals, type ApprovalRecord } from '../../data/approvalRecords';
import { RequestTypeBadge } from '../approval-center/RequestTypeBadge';

const platformFeatures = [
  { title: '数据运营报表', description: '通过经营目标和 APP 运营报表，查看目标达成进度、用户活跃和交易指标，识别需要重点跟进的业务变化。', icon: BarChart3 },
  { title: '全链路诊断', description: '从设备或用户出发，结合绑定关系、链路日志和故障统计，追溯异常发生的环节。', icon: Activity },
  { title: '智能数据开发和治理', description: '在一个工作空间内开发数据任务、治理数据资产和管理数据服务，让加工后的数据可以在其他业务场景中复用。', icon: Code2 },
  { title: '智能用户运营', description: '结合用户画像和行为特征筛选目标人群，为新用户激活、活跃用户留存和沉默用户召回制定运营策略。', icon: UserRoundSearch },
];

export function WorkbenchTodos({ records = approvalRecords }: { records?: ApprovalRecord[] }) {
  const pending = getPendingApprovals(records);
  return (
    <section className={`wb-todos-panel${pending.length === 0 ? ' wb-todos-panel-empty' : ''}`} aria-labelledby="wb-todos-heading">
      <header className="wb-section-head wb-todos-header">
        <div><h2 id="wb-todos-heading">我的待办<span className="wb-todos-count" aria-label={`${pending.length} 条待办`}>{pending.length}</span></h2><p>来自审批中心 · 待我处理的申请</p></div>
        <Link to="/approval-center/my-approvals" className="wb-text-action">全部审批<ArrowRight size={15} aria-hidden="true" /></Link>
      </header>
      {pending.length > 0 ? <>
        <div className="wb-todos-grid">{pending.map((item) => <article className="wb-todo-card" key={item.id}>
          <div className="wb-todo-main">
            <div className="wb-todo-heading"><span className="wb-todo-type"><RequestTypeBadge type={item.requestType} /></span><h3 title={item.entryName}>{item.entryName}</h3></div>
            <div className="wb-todo-reference"><span className="wb-todo-id">{item.requestId}</span><span>{item.module}</span></div>
            <dl><div><dt>申请人</dt><dd>{item.applicant}</dd></div><div><dt>当前节点</dt><dd>{item.currentNode}</dd></div><div><dt>更新时间</dt><dd><time dateTime={item.updatedAt.replace(' ', 'T') + '+08:00'}>{item.updatedAt.slice(0, 16)}</time></dd></div></dl>
          </div>
          <div className="wb-todo-actions"><span className="wb-todo-status"><i aria-hidden="true" />待审批</span><Link to={`/approval-center/approval/${item.id}`} aria-label={`去处理 ${item.entryName}`}>去处理<ArrowRight size={14} aria-hidden="true" /></Link></div>
        </article>)}</div>
      </> : <div className="wb-todos-empty">
        <p className="wb-todos-empty-status"><span><CheckCheck size={18} aria-hidden="true" /></span>暂无待处理事项</p>
        <h3>平台功能介绍</h3>
        <div className="wb-platform-features">
          {platformFeatures.map(({ title, description, icon: Icon }) => (
            <article className="wb-platform-feature" key={title}>
              <span className="wb-platform-feature-icon"><Icon size={24} aria-hidden="true" /></span>
              <div><h4>{title}</h4><p>{description}</p></div>
            </article>
          ))}
        </div>
      </div>}
    </section>
  );
}
