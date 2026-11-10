import type { RequestType } from '../components/approval-center/RequestTypeBadge';

export type ApprovalStatus = '待审批' | '审批通过' | '已驳回';

export interface ApprovalRecord {
  id: string;
  requestId: string;
  requestType: RequestType;
  classificationLevel?: string;
  applicant: string;
  department: string;
  module: string;
  entryName: string;
  status: ApprovalStatus;
  currentNode: string;
  updatedAt: string;
}

export const approvalRecords: ApprovalRecord[] = [
  {
    id: '1', requestId: 'DL202604290015', requestType: '数据下载', classificationLevel: 'S3', applicant: '李明', department: '产品部',
    module: '数据分析', entryName: '用户行为分析', status: '待审批',
    currentNode: 'L3数据管家', updatedAt: '2026-04-29 09:15:30',
  },
  {
    id: '2', requestId: 'DL202604290012', requestType: '数据下载', classificationLevel: 'S4', applicant: '王芳', department: '财务部',
    module: '财务管理', entryName: '销售数据导出', status: '待审批',
    currentNode: '直线', updatedAt: '2026-04-29 08:30:15',
  },
  {
    id: 'table-approval-1', requestId: 'TB20260710001', requestType: '数据表权限', applicant: '杨强', department: '智慧家庭平台',
    module: '权限管理', entryName: '物理表：PROD-t05_ai_nlp_wakeup_log（语音唤醒日志）权限审批申请', status: '待审批',
    currentNode: '数据Owner', updatedAt: '2026-07-10 14:22:17',
  },
  {
    id: 'classification-downgrade-1', requestId: 'CL20260727001', requestType: '数据分级降级', applicant: '杨强', department: '智慧家庭平台',
    module: '数据治理', entryName: 'dwd_user_profile 字段分级 S4 → S2', status: '待审批',
    currentNode: '技术负责人', updatedAt: '2026-07-27 10:18:32',
  },
  {
    id: '3', requestId: 'DL202604280097', requestType: '数据下载', classificationLevel: 'S3', applicant: '张敏', department: '市场部',
    module: '客户管理', entryName: '客户信息表', status: '待审批',
    currentNode: 'L3数据管家', updatedAt: '2026-04-28 16:45:10',
  },
  {
    id: '4', requestId: 'DL202604280075', requestType: '数据下载', classificationLevel: 'S2', applicant: '刘强', department: '运营部',
    module: '订单管理', entryName: '订单明细', status: '待审批',
    currentNode: 'L3数据管家', updatedAt: '2026-04-28 14:20:30',
  },
  {
    id: '5', requestId: 'DL202604280056', requestType: '数据下载', classificationLevel: 'S4', applicant: '陈华', department: '人力资源部',
    module: '人力资源', entryName: '员工绩效数据', status: '审批通过',
    currentNode: '流程结束', updatedAt: '2026-04-28 11:40:22',
  },
  {
    id: 'table-approval-2', requestId: 'TB202604270143', requestType: '数据表权限', applicant: '周杰', department: '技术部',
    module: '数据仓库', entryName: 'ads_order_summary 订单汇总表', status: '审批通过',
    currentNode: '流程结束', updatedAt: '2026-04-27 16:15:30',
  },
  {
    id: 'table-approval-3', requestId: 'TB202604270089', requestType: '数据表权限', applicant: '吴明', department: '市场部',
    module: '营销数据集市', entryName: 'dwd_customer_contact 客户触达明细', status: '已驳回',
    currentNode: '数据Owner', updatedAt: '2026-04-27 10:25:15',
  },
  {
    id: '8', requestId: 'DL202604260123', requestType: '数据下载', classificationLevel: 'S2', applicant: '郑丽', department: '财务部',
    module: '财务管理', entryName: '费用报销明细', status: '审批通过',
    currentNode: '流程结束', updatedAt: '2026-04-26 14:50:40',
  },
];

export function getPendingApprovals(records: ApprovalRecord[]) {
  return records.filter((record) => record.status === '待审批')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
