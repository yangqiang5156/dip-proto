import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Copy, Download, FileX, Loader2, RotateCw } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ApprovalNode } from '../components/download-center/ApprovalProgress';
import {
  DataClassificationApprovalFlow,
  DataClassificationLevel,
  getClassificationFlow,
  getRoleDisplayName,
} from '../components/download-center';
import { ApprovalStatus, StatusBadge } from '../components/download-center/StatusBadge';
import {
  ApprovalProcessTable,
  ClassificationDowngradeDetail,
  ClassificationDowngradeDetailData,
  RequestType,
  RequestTypeBadge,
  TablePermissionDetail,
} from '../components/approval-center';

type FileStatus = 'generating' | 'ready' | 'downloaded' | 'expired' | 'failed';

interface TablePermission {
  systemName: string;
  databaseName: string;
  tableNames: string[];
  permissions: string[];
  dataScope: string;
  validity: string;
  effectiveTime?: string;
}

interface ApplicationDetail {
  id: string;
  requestType: RequestType;
  requestName: string;
  module: string;
  page?: string;
  applicant: string;
  department: string;
  applyTime: string;
  purpose: string;
  remark?: string;
  externalUse?: boolean;
  classificationLevel?: DataClassificationLevel;
  hasPersonalInfoOrCrossBorder?: boolean;
  status: ApprovalStatus;
  errorMessage?: string;
  fileStatus?: FileStatus;
  fileUrl?: string;
  downloadTime?: string;
  fileSize?: string;
  exportConditions?: { dateRange: string; filters: string[] };
  tablePermission?: TablePermission;
  classificationDowngrade?: ClassificationDowngradeDetailData;
}

const downloadApplications: Record<string, ApplicationDetail> = {
  '1': {
    id: 'DL20260429001', requestType: '数据下载', requestName: '销售分析报表导出', module: '数据分析', page: '销售分析',
    applicant: '李明', department: '产品部', applyTime: '2026-04-29 10:30:15', externalUse: false,
    purpose: '用于本周经营分析，统计销售趋势和重点产品表现。',
    remark: '数据仅限内部经营分析使用', status: '审批中', classificationLevel: 'S3', hasPersonalInfoOrCrossBorder: true,
    exportConditions: { dateRange: '2026-04-01 至 2026-04-29', filters: ['订单状态：已完成', '销售区域：全国'] },
  },
  '2': {
    id: 'DL20260429002', requestType: '数据下载', requestName: '用户行为数据导出', module: '用户管理', page: '用户画像',
    applicant: '李明', department: '产品部', applyTime: '2026-04-29 09:15:22', externalUse: false,
    purpose: '用于产品使用行为分析和用户留存研究。', status: '审批通过', fileStatus: 'generating', classificationLevel: 'S3', hasPersonalInfoOrCrossBorder: true,
    exportConditions: { dateRange: '2026-04-01 至 2026-04-29', filters: ['活跃用户', '登录次数 > 5'] },
  },
  '3': {
    id: 'DL20260428003', requestType: '数据下载', requestName: '订单明细导出', module: '订单中心', page: '订单明细',
    applicant: '李明', department: '产品部', applyTime: '2026-04-28 16:45:30', externalUse: false,
    purpose: '用于订单履约情况和产品销售趋势分析。', status: '审批通过', fileStatus: 'ready', classificationLevel: 'S2', hasPersonalInfoOrCrossBorder: false,
    fileUrl: '/downloads/order_details_202604.xlsx', fileSize: '1.8 MB',
    exportConditions: { dateRange: '2026-04-01 至 2026-04-28', filters: ['订单状态：全部', '支付方式：在线支付'] },
  },
  '4': {
    id: 'DL202604260089', requestType: '数据下载', requestName: '订单明细', module: '订单管理', page: '订单中心',
    applicant: '刘强', department: '运营部', applyTime: '2026-04-26 09:20:45', externalUse: false,
    purpose: '运营月报数据分析，统计三月份订单情况和销售趋势。', status: '审批通过', fileStatus: 'downloaded', classificationLevel: 'S2', hasPersonalInfoOrCrossBorder: false,
    fileUrl: '/downloads/order_details_20260426.xlsx', downloadTime: '2026-04-26 18:30:12', fileSize: '5.7 MB',
    exportConditions: { dateRange: '2026-03-01 至 2026-03-31', filters: ['订单状态：全部', '支付方式：在线支付'] },
  },
  '6': {
    id: 'DL202604240123', requestType: '数据下载', requestName: '系统日志导出', module: '系统管理', page: '日志中心',
    applicant: '周杰', department: '技术部', applyTime: '2026-04-24 15:20:00', purpose: '用于线上故障定位。',
    status: '审批通过', fileStatus: 'failed', errorMessage: '数据源连接超时，文件生成失败。', classificationLevel: 'S2', hasPersonalInfoOrCrossBorder: false,
    exportConditions: { dateRange: '2026-04-24', filters: ['日志级别：ERROR'] },
  },
  '5': {
    id: 'DL20260427005', requestType: '数据下载', requestName: '客户信息导出', module: '客户管理', page: '客户列表',
    applicant: '李明', department: '产品部', applyTime: '2026-04-27 11:35:42', purpose: '用于客户结构分析和服务质量复盘。',
    status: '审批通过', fileStatus: 'downloaded', fileUrl: '/downloads/customer_data_east.xlsx',
    classificationLevel: 'S3', hasPersonalInfoOrCrossBorder: true,
    downloadTime: '2026-04-28 14:15:22', fileSize: '5.7 MB',
    exportConditions: { dateRange: '全部时间', filters: ['所属区域：华东', '敏感字段：脱敏'] },
  },
  '7': {
    id: 'DL20260425007', requestType: '数据下载', requestName: '物流数据导出', module: '物流管理', page: '物流报表',
    applicant: '李明', department: '产品部', applyTime: '2026-04-25 09:50:33', purpose: '用于物流时效和异常订单分析。',
    status: '审批通过', fileStatus: 'failed', errorMessage: '数据源连接超时，文件生成失败。', classificationLevel: 'S3', hasPersonalInfoOrCrossBorder: false,
    exportConditions: { dateRange: '2026-04-01 至 2026-04-25', filters: ['配送状态：全部'] },
  },
  '8': {
    id: 'DL202604220134', requestType: '数据下载', requestName: '费用报销明细', module: '财务管理', page: '报销管理',
    applicant: '郑丽', department: '财务部', applyTime: '2026-04-22 14:10:00', purpose: '月度费用分析与预算执行复盘。',
    status: '审批通过', fileStatus: 'generating', classificationLevel: 'S4', hasPersonalInfoOrCrossBorder: true,
    exportConditions: { dateRange: '2026-03-01 至 2026-03-31', filters: ['报销状态：已完成'] },
  },
};

const tableApplications: Record<string, ApplicationDetail> = {
  'table-request-1': {
    id: 'TB20260710001', requestType: '数据表权限', requestName: '物理表：PROD-t05_ai_nlp_wakeup_log（语音唤醒日志）权限审批申请',
    module: '权限管理', applicant: '杨强', department: '智慧家庭平台', applyTime: '2026-07-10 14:22:17',
    purpose: '测试审批流程', status: '审批中',
    tablePermission: { systemName: '权限管理', databaseName: 'hdw_dwb', tableNames: ['t05_ai_nlp_wakeup_log'], permissions: ['查询'], dataScope: '字段级权限（7 个字段）', validity: '长期' },
  },
  'table-request-2': {
    id: 'TB202604280156', requestType: '数据表权限', requestName: 'customer_profile 客户画像表',
    module: '客户数据平台', applicant: '张敏', department: '市场部', applyTime: '2026-04-28 16:45:10',
    purpose: '用于营销人群圈选和活动效果分析。', status: '审批通过',
    tablePermission: { systemName: '客户数据平台', databaseName: 'customer_ads', tableNames: ['customer_profile', 'customer_tag'], permissions: ['查询', '导出'], dataScope: '仅限本人负责业务区域', validity: '180 天', effectiveTime: '2026-04-28 18:05:00' },
  },
  'table-request-3': {
    id: 'TB202604270089', requestType: '数据表权限', requestName: 'dwd_customer_contact 客户触达明细',
    module: '营销数据集市', applicant: '吴明', department: '市场部', applyTime: '2026-04-27 09:40:18',
    purpose: '用于分析营销活动触达效果。', status: '已驳回', errorMessage: '申请的数据范围过大，请限定负责区域并缩短权限有效期。',
    tablePermission: { systemName: '营销数据集市', databaseName: 'marketing_dw', tableNames: ['dwd_customer_contact'], permissions: ['查询', '导出'], dataScope: '全国全部客户', validity: '长期' },
  },
  'table-approval-1': {
    id: 'TB202604290030', requestType: '数据表权限', requestName: 'ads_finance_summary 财务汇总表',
    module: '数据仓库', applicant: '王芳', department: '财务部', applyTime: '2026-04-29 13:20:16',
    purpose: '用于季度经营分析及财务数据核对。', status: '审批中',
    tablePermission: { systemName: '数据仓库', databaseName: 'finance_ads', tableNames: ['ads_finance_summary'], permissions: ['查询'], dataScope: '仅限财务部数据', validity: '90 天' },
  },
  'table-approval-2': {
    id: 'TB202604230078', requestType: '数据表权限', requestName: 'ads_campaign_result 活动效果表',
    module: '营销数据集市', applicant: '吴明', department: '市场部', applyTime: '2026-04-23 09:25:15',
    purpose: '用于活动投放效果复盘。', status: '审批通过',
    tablePermission: { systemName: '营销数据集市', databaseName: 'marketing_ads', tableNames: ['ads_campaign_result'], permissions: ['查询'], dataScope: '本人负责活动', validity: '30 天', effectiveTime: '2026-04-23 10:25:15' },
  },
  'table-approval-3': {
    id: 'TB202604250147', requestType: '数据表权限', requestName: 'dwd_employee_performance 员工绩效表',
    module: '人力数据集市', applicant: '陈华', department: '人力资源部', applyTime: '2026-04-25 10:05:15',
    purpose: '用于季度绩效汇总。', status: '已驳回', errorMessage: '涉及高敏感人力数据，当前用途和授权范围说明不足。',
    tablePermission: { systemName: '人力数据集市', databaseName: 'hr_dw', tableNames: ['dwd_employee_performance'], permissions: ['查询', '导出'], dataScope: '全部员工', validity: '180 天' },
  },
};

const classificationDowngradeApplications: Record<string, ApplicationDetail> = {
  'classification-downgrade-1': {
    id: 'CL20260727001', requestType: '数据分级降级', requestName: 'dwd_user_profile 字段分级 S4 → S2',
    module: '数据治理', applicant: '杨强', department: '智慧家庭平台', applyTime: '2026-07-27 10:18:32',
    purpose: '字段已完成脱敏处理，业务侧仅用于内部聚合分析，申请调整数据分级。', status: '审批中',
    classificationDowngrade: {
      databaseName: 'user_profile_dw',
      tableName: 'dwd_user_profile',
      fields: ['mobile_phone', 'home_address'],
      originalLevel: 'S4',
      targetLevel: 'S2',
      reason: '字段已完成脱敏处理，业务侧仅用于内部聚合分析，申请调整数据分级。',
      technicalOwner: '陈晨（数据开发平台自动解析）',
    },
  },
  'classification-downgrade-2': {
    id: 'CL20260726008', requestType: '数据分级降级', requestName: 'ads_device_active_summary 字段分级 S3 → S2',
    module: '数据治理', applicant: '李明', department: '产品部', applyTime: '2026-07-26 16:42:10',
    purpose: '区域编码已转换为统计维度，不再包含可识别个人或设备的信息。', status: '审批通过',
    classificationDowngrade: {
      databaseName: 'device_ads',
      tableName: 'ads_device_active_summary',
      fields: ['region_code'],
      originalLevel: 'S3',
      targetLevel: 'S2',
      reason: '区域编码已转换为统计维度，不再包含可识别个人或设备的信息。',
      technicalOwner: '赵海（数据开发平台自动解析）',
    },
  },
  'classification-downgrade-3': {
    id: 'CL20260725003', requestType: '数据分级降级', requestName: 'dwd_customer_contact 字段分级 S4 → S3',
    module: '数据治理', applicant: '张敏', department: '市场部', applyTime: '2026-07-25 09:36:45',
    purpose: '计划用于营销触达效果分析。', status: '已驳回',
    errorMessage: '字段仍包含可直接识别客户的信息，暂不符合降级条件。',
    classificationDowngrade: {
      databaseName: 'customer_dwd',
      tableName: 'dwd_customer_contact',
      fields: ['contact_phone', 'contact_address'],
      originalLevel: 'S4',
      targetLevel: 'S3',
      reason: '计划用于营销触达效果分析。',
      technicalOwner: '周磊（数据开发平台自动解析）',
    },
  },
};

const mockApplications = { ...downloadApplications, ...tableApplications, ...classificationDowngradeApplications };

function parseDowngradeItems(value: string | null): ClassificationDowngradeDetailData['items'] {
  if (!value) return undefined;
  try {
    const items = JSON.parse(value);
    if (!Array.isArray(items)) return undefined;
    return items.filter((item) => (
      item
      && typeof item.field === 'string'
      && typeof item.originalLevel === 'string'
      && typeof item.targetLevel === 'string'
      && typeof item.reason === 'string'
    ));
  } catch {
    return undefined;
  }
}

const defaultNodes: ApprovalNode[] = [
  { id: '1', name: '直属主管', status: 'approved', approver: '张敏', opinion: '业务用途明确，同意申请', time: '2026-04-29 11:30:10' },
  { id: '2', name: '资源负责人', status: 'current', approver: '李晨' },
  { id: '3', name: '安全审计', status: 'pending', approver: '待分配' },
];

function getApprovalNodes(application: ApplicationDetail): ApprovalNode[] {
  if (application.requestType === '数据分级降级') {
    const technicalOwner = application.classificationDowngrade?.technicalOwner || '数据开发平台自动解析';
    if (application.status === '审批通过') {
      return [
        { id: 'downgrade-owner', name: '技术负责人', status: 'approved', approver: technicalOwner, opinion: '字段使用范围和降级依据合理，同意。', time: '2026-07-27 10:35:18' },
        { id: 'downgrade-security', name: '信息安全', status: 'approved', approver: '王玮 / 李子超（或签）', opinion: '符合数据分级调整规范。', time: '2026-07-27 11:02:45' },
      ];
    }
    if (application.status === '已驳回') {
      return [
        { id: 'downgrade-owner', name: '技术负责人', status: 'rejected', approver: technicalOwner, opinion: application.errorMessage || '降级依据不足。', time: '2026-07-27 10:35:18' },
        { id: 'downgrade-security', name: '信息安全', status: 'pending', approver: '流程已终止' },
      ];
    }
    return [
      { id: 'downgrade-owner', name: '技术负责人', status: 'current', approver: technicalOwner },
      { id: 'downgrade-security', name: '信息安全', status: 'pending', approver: '王玮 / 李子超（或签）' },
    ];
  }

  if (application.requestType === '数据下载' && application.classificationLevel) {
    const steps = getClassificationFlow(
      application.classificationLevel,
      application.hasPersonalInfoOrCrossBorder,
    ).filter((step) => step.type !== 'initiator');
    const firstApprovalIndex = steps.findIndex((step) => step.type === 'approval');
    const rejectedIndex = Math.max(firstApprovalIndex, 0);

    return steps.map((step, index) => {
      const actionLabel = step.type === 'notification'
        ? `卡片通知 · ${step.name}`
        : step.type === 'automatic'
          ? `自动规则 · ${step.name}`
          : `审批节点 · ${step.name}`;
      const isSystemStep = step.type !== 'approval';
      let status: ApprovalNode['status'] = 'pending';

      if (
        application.status === '审批通过'
        || isSystemStep && (step.type === 'automatic' || index < firstApprovalIndex)
      ) {
        status = 'approved';
      } else if (application.status === '已驳回') {
        status = index < rejectedIndex ? 'approved' : index === rejectedIndex ? 'rejected' : 'pending';
      } else if (index === firstApprovalIndex) {
        status = 'current';
      }

      return {
        id: `classification-${index}`,
        name: step.name,
        actionLabel,
        status,
        approver: getRoleDisplayName(step.name),
        opinion: status === 'approved'
          ? (step.type === 'notification' ? '卡片通知发送成功' : step.type === 'automatic' ? 'S1外部公开数据无需审批' : '同意')
          : status === 'rejected' ? application.errorMessage : undefined,
        time: status === 'approved' ? `2026-04-${27 + Math.min(index, 2)} ${15 + index}:20:10` : undefined,
      };
    });
  }

  if (application.status === '审批通过') {
    return [
      { id: '1', name: '直属主管', status: 'approved', approver: '张敏', opinion: '同意', time: '2026-04-28 17:00:10' },
      { id: '2', name: application.requestType === '数据表权限' ? '数据 Owner' : '功能负责人', status: 'approved', approver: '李晨', opinion: '授权范围合理，审批通过', time: '2026-04-28 17:35:20' },
      { id: '3', name: '安全审计', status: 'approved', approver: '安全审批组', opinion: '符合数据安全要求', time: '2026-04-28 18:05:00' },
    ];
  }
  if (application.status === '已驳回') {
    return [
      { id: '1', name: '直属主管', status: 'approved', approver: '张敏', opinion: '业务需求属实', time: '2026-04-27 10:00:00' },
      { id: '2', name: application.requestType === '数据表权限' ? '数据 Owner' : '功能负责人', status: 'rejected', approver: '李晨', opinion: application.errorMessage, time: '2026-04-27 10:25:15' },
      { id: '3', name: '安全审计', status: 'pending', approver: '流程已终止' },
    ];
  }
  return defaultNodes.map((node) => ({ ...node, name: node.id === '2' && application.requestType === '数据表权限' ? '数据 Owner' : node.name }));
}

export default function ApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const baseApplication = mockApplications[id || '1'] || mockApplications['1'];
  const downgradeItems = parseDowngradeItems(searchParams.get('items'));
  const application = id === 'classification-downgrade-1' && searchParams.has('databaseName')
    ? {
        ...baseApplication,
        requestName: `${searchParams.get('tableName') || '数据表'} 字段分级 ${searchParams.get('originalLevel') || 'S4'} → ${searchParams.get('targetLevel') || 'S2'}`,
        purpose: searchParams.get('reason') || baseApplication.purpose,
        classificationDowngrade: {
          databaseName: searchParams.get('databaseName') || 'user_profile_dw',
          tableName: searchParams.get('tableName') || 'dwd_user_profile',
          fields: (searchParams.get('fields') || 'mobile_phone').split(',').map((field) => field.trim()).filter(Boolean),
          originalLevel: searchParams.get('originalLevel') || 'S4',
          targetLevel: searchParams.get('targetLevel') || 'S2',
          reason: searchParams.get('reason') || baseApplication.purpose,
          technicalOwner: '陈晨（数据开发平台自动解析）',
          items: downgradeItems,
        },
      }
    : baseApplication;
  const approvalNodes = getApprovalNodes(application);
  const [fileStatus, setFileStatus] = useState<FileStatus | undefined>(application.fileStatus);
  const [generatedFileSize, setGeneratedFileSize] = useState(application.fileSize);
  const [regenerationNotice, setRegenerationNotice] = useState('');

  useEffect(() => {
    setFileStatus(application.fileStatus);
    setGeneratedFileSize(application.fileSize);
    setRegenerationNotice('');
  }, [application.fileSize, application.fileStatus, application.id]);

  const fileConfig = fileStatus ? {
    generating: { icon: <Loader2 className="h-5 w-5 animate-spin text-info" />, title: '文件生成中', description: '系统正在生成导出文件，预计需要 3-5 分钟。', color: 'bg-info-light border-info/20' },
    ready: { icon: <Download className="h-5 w-5 text-primary" />, title: '文件已就绪', description: `文件大小：${generatedFileSize}`, color: 'bg-primary-light border-primary/20' },
    downloaded: { icon: <CheckCircle2 className="h-5 w-5 text-success" />, title: '文件可下载', description: `最近下载：${application.downloadTime}，7 天有效期内不限下载次数`, color: 'bg-success-light border-success/20' },
    expired: { icon: <Clock className="h-5 w-5 text-muted-foreground" />, title: '文件已过期', description: '文件已超过 7 天保留期限。', color: 'bg-muted border-border' },
    failed: { icon: <FileX className="h-5 w-5 text-destructive" />, title: '生成失败', description: application.errorMessage || '文件生成失败。', color: 'bg-destructive-light border-destructive/20' },
  }[fileStatus] : null;

  const handleRegenerate = () => {
    setFileStatus('generating');
    setRegenerationNotice(`申请单 ${application.id} 已提交重新生成，请稍候。`);

    window.setTimeout(() => {
      setGeneratedFileSize('2.6 MB');
      setFileStatus('ready');
      setRegenerationNotice(`申请单 ${application.id} 文件重新生成完成，可前往下载中心下载。`);
    }, 1800);
  };

  return (
    <div className="w-full min-w-0 p-4 xl:p-6">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/approval-center/my-applications')}>
        <ArrowLeft className="mr-2 h-4 w-4" />返回我的申请
      </Button>
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl">
            {application.requestType === '数据下载' ? '申请详情' : application.requestName}
          </h1>
          <RequestTypeBadge type={application.requestType} />
          <StatusBadge status={application.status} />
        </div>
        <p className="text-sm text-muted-foreground">申请单号：{application.id}</p>
      </div>

      {application.status === '已驳回' && (
        <Alert className="mb-6 border-destructive/50 bg-destructive-light">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{application.errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="detail-layout grid min-w-0 grid-cols-1 gap-6">
        <div className="min-w-0 space-y-6">
          {application.requestType === '数据下载' && <Card>
            <CardHeader><CardTitle>申请信息</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <Info label="申请名称" value={application.requestName} />
              <Info label="所属系统/模块" value={application.module} />
              {application.page && <Info label="来源页面" value={application.page} />}
              <Info label="申请人" value={application.applicant} />
              <Info label="所属部门" value={application.department} />
              <Info label="申请时间" value={application.applyTime} />
              {application.externalUse !== undefined && <Info label="是否对外使用" value={application.externalUse ? '是' : '否'} />}
              {application.classificationLevel && <Info label="最高字段密级" value={`${application.classificationLevel}（数据开发平台返回）`} />}
              {application.classificationLevel === 'S3' && <Info label="个人信息/跨境" value={application.hasPersonalInfoOrCrossBorder ? '涉及' : '不涉及'} />}
              <div className="col-span-2"><Info label="申请用途" value={application.purpose} /></div>
              {application.remark && <div className="col-span-2"><Info label="补充说明" value={application.remark} /></div>}
              {application.classificationLevel && (
                <div className="col-span-2 rounded-lg border bg-muted/30 p-4">
                  <DataClassificationApprovalFlow
                    level={application.classificationLevel}
                    hasPersonalInfoOrCrossBorder={application.hasPersonalInfoOrCrossBorder}
                  />
                </div>
              )}
            </CardContent>
          </Card>}

          {application.exportConditions && (
            <Card>
              <CardHeader><CardTitle>下载内容</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Info label="时间范围" value={application.exportConditions.dateRange} />
                <TagList label="筛选条件" values={application.exportConditions.filters} />
              </CardContent>
            </Card>
          )}

          {application.tablePermission && (
            <TablePermissionDetail
              permission={application.tablePermission}
              creator={application.applicant}
              createdAt={application.applyTime}
              reason={application.purpose}
              requestName={application.requestName}
            />
          )}

          {application.classificationDowngrade && (
            <ClassificationDowngradeDetail downgrade={application.classificationDowngrade} />
          )}

          <ApprovalProcessTable nodes={approvalNodes} applicant={application.applicant} applyTime={application.applyTime} />
        </div>

        <div className="space-y-6">
          {regenerationNotice && (
            <Alert className="border-primary/20 bg-primary-light">
              {fileStatus === 'generating'
                ? <Loader2 className="h-4 w-4 animate-spin text-primary" />
                : <CheckCircle2 className="h-4 w-4 text-success" />}
              <AlertDescription className="text-foreground">{regenerationNotice}</AlertDescription>
            </Alert>
          )}
          {fileConfig && (
            <Card>
              <CardHeader><CardTitle>文件状态</CardTitle></CardHeader>
              <CardContent>
                <div className={`flex items-start gap-3 rounded-lg border p-4 ${fileConfig.color}`}>
                  {fileConfig.icon}<div><p className="font-medium">{fileConfig.title}</p><p className="mt-1 text-sm text-muted-foreground">{fileConfig.description}</p></div>
                </div>
              </CardContent>
            </Card>
          )}
          {application.requestType === '数据表权限' && application.status === '审批通过' && (
            <Card><CardHeader><CardTitle>权限状态</CardTitle></CardHeader><CardContent><div className="rounded-lg border border-success/20 bg-success-light p-4 text-sm text-success">权限已生效，可在有效期内访问所申请的数据表。</div></CardContent></Card>
          )}
          <Card>
            <CardHeader><CardTitle>操作</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {application.status === '审批中' && <Button variant="outline" className="w-full">撤回申请</Button>}
              {application.status === '已驳回' && application.requestType === '数据下载' && <Button variant="outline" className="w-full" onClick={() => navigate('/download-demo')}><Copy className="mr-2 h-4 w-4" />复制并重新发起</Button>}
              {application.requestType === '数据下载' && fileStatus === 'failed' && (
                <Button className="w-full" onClick={handleRegenerate}>
                  <RotateCw className="mr-2 h-4 w-4" />重新生成
                </Button>
              )}
              {application.requestType === '数据下载' && fileStatus === 'generating' && regenerationNotice && (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />正在重新生成
                </Button>
              )}
              {application.requestType === '数据下载' && ['ready', 'downloaded'].includes(fileStatus || '') && <Button className="w-full" onClick={() => navigate(`/?requestId=${encodeURIComponent(application.id)}`)}><Download className="mr-2 h-4 w-4" />去下载中心</Button>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="mb-1 text-sm text-muted-foreground">{label}</p><p className="text-sm leading-relaxed text-foreground">{value}</p></div>;
}

function TagList({ label, values }: { label: string; values: string[] }) {
  return <div><p className="mb-2 text-sm text-muted-foreground">{label}</p><div className="flex flex-wrap gap-2">{values.map((value) => <span key={value} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{value}</span>)}</div></div>;
}
