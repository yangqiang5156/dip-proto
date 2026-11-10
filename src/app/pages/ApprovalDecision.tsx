import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { ApprovalNode } from '../components/download-center/ApprovalProgress';
import {
  DataClassificationApprovalFlow,
  DataClassificationLevel,
  getClassificationFlow,
  getRoleDisplayName,
} from '../components/download-center';
import {
  ApprovalProcessTable,
  ClassificationDowngradeDetail,
  ClassificationDowngradeDetailData,
  RequestType,
  RequestTypeBadge,
  TablePermissionDetail,
} from '../components/approval-center';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type DecisionState = 'normal' | 'validating' | 'submitting' | 'success';
type DecisionOption = 'approve' | 'reject' | 'transfer' | 'add-sign';

interface TablePermission {
  systemName: string;
  databaseName: string;
  tableNames: string[];
  permissions: string[];
  dataScope: string;
  validity: string;
}

interface ApprovalRequest {
  id: string;
  requestId: string;
  requestType: RequestType;
  applicant: string;
  department: string;
  module: string;
  page?: string;
  requestName: string;
  applyTime: string;
  externalUse?: boolean;
  purpose: string;
  remark?: string;
  currentNode: string;
  approvalStatus: ApprovalStatus;
  decisionTime?: string;
  decisionOpinion?: string;
  classificationLevel?: DataClassificationLevel;
  hasPersonalInfoOrCrossBorder?: boolean;
  exportConditions?: { dateRange: string; filters: string[]; recordCount?: string };
  tablePermission?: TablePermission;
  classificationDowngrade?: ClassificationDowngradeDetailData;
}

const requests: Record<string, ApprovalRequest> = {
  '1': downloadRequest('1', 'DL202604290015', '李明', '产品部', '数据分析', '用户行为分析', 'pending', 'S3', true),
  '2': downloadRequest('2', 'DL202604290012', '王芳', '财务部', '财务管理', '销售数据导出', 'pending', 'S4', true),
  '3': downloadRequest('3', 'DL202604280097', '张敏', '市场部', '客户管理', '客户信息表', 'pending', 'S3', false),
  '4': downloadRequest('4', 'DL202604280075', '刘强', '运营部', '订单管理', '订单明细', 'pending', 'S2', false),
  '5': { ...downloadRequest('5', 'DL202604280056', '陈华', '人力资源部', '人力资源', '员工绩效数据', 'approved', 'S4', true), decisionTime: '2026-04-28 11:40:22', decisionOpinion: '数据范围合理，同意导出。' },
  '8': { ...downloadRequest('8', 'DL202604260123', '郑丽', '财务部', '财务管理', '费用报销明细', 'approved', 'S2', false), decisionTime: '2026-04-26 14:50:40', decisionOpinion: '批准。' },
  'table-approval-1': {
    id: 'table-approval-1', requestId: 'TB20260710001', requestType: '数据表权限', applicant: '杨强', department: '智慧家庭平台',
    module: '权限管理', requestName: '物理表：PROD-t05_ai_nlp_wakeup_log（语音唤醒日志）权限审批申请', applyTime: '2026-07-10 14:22:17',
    purpose: '测试审批流程',
    currentNode: '数据 Owner', approvalStatus: 'pending',
    tablePermission: { systemName: '权限管理', databaseName: 'hdw_dwb', tableNames: ['t05_ai_nlp_wakeup_log'], permissions: ['查询'], dataScope: '字段级权限（7 个字段）', validity: '长期' },
  },
  'table-approval-2': {
    id: 'table-approval-2', requestId: 'TB202604270143', requestType: '数据表权限', applicant: '周杰', department: '技术部',
    module: '数据仓库', requestName: 'ads_order_summary 订单汇总表', applyTime: '2026-04-27 15:30:22',
    purpose: '用于订单服务质量监控和异常排查。', currentNode: '流程结束', approvalStatus: 'approved',
    decisionTime: '2026-04-27 16:15:30', decisionOpinion: '授权范围符合最小权限原则，审批通过。',
    tablePermission: { systemName: '数据仓库', databaseName: 'order_ads', tableNames: ['ads_order_summary'], permissions: ['查询'], dataScope: '仅限技术部生产运维账号', validity: '180 天' },
  },
  'table-approval-3': {
    id: 'table-approval-3', requestId: 'TB202604270089', requestType: '数据表权限', applicant: '吴明', department: '市场部',
    module: '营销数据集市', requestName: 'dwd_customer_contact 客户触达明细', applyTime: '2026-04-27 09:40:18',
    purpose: '用于分析营销活动触达效果。', currentNode: '数据 Owner', approvalStatus: 'rejected',
    decisionTime: '2026-04-27 10:25:15', decisionOpinion: '数据范围过大，请限定负责区域并缩短权限有效期。',
    tablePermission: { systemName: '营销数据集市', databaseName: 'marketing_dw', tableNames: ['dwd_customer_contact'], permissions: ['查询', '导出'], dataScope: '全国全部客户', validity: '长期' },
  },
  'classification-downgrade-1': {
    id: 'classification-downgrade-1', requestId: 'CL20260727001', requestType: '数据分级降级', applicant: '杨强', department: '智慧家庭平台',
    module: '数据治理', requestName: 'dwd_user_profile 字段分级 S4 → S2', applyTime: '2026-07-27 10:18:32',
    purpose: '字段已完成脱敏处理，业务侧仅用于内部聚合分析，申请调整数据分级。',
    currentNode: '技术负责人', approvalStatus: 'pending',
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
};

function downloadRequest(
  id: string,
  requestId: string,
  applicant: string,
  department: string,
  module: string,
  requestName: string,
  approvalStatus: ApprovalStatus,
  classificationLevel: DataClassificationLevel,
  hasPersonalInfoOrCrossBorder: boolean,
): ApprovalRequest {
  const firstApprovalRole = getClassificationFlow(classificationLevel, hasPersonalInfoOrCrossBorder)
    .find((step) => step.type === 'approval')?.name;
  return {
    id, requestId, requestType: '数据下载', applicant, department, module, page: '业务数据页面', requestName,
    applyTime: '2026-04-29 09:15:30', externalUse: false, purpose: '用于业务分析和阶段性经营复盘。',
    remark: '数据仅限内部使用。', currentNode: approvalStatus === 'pending' ? (firstApprovalRole || '自动免审') : '流程结束', approvalStatus,
    classificationLevel, hasPersonalInfoOrCrossBorder,
    exportConditions: { dateRange: '2026-04-22 至 2026-04-29', filters: ['有效数据', '所属区域：申请人负责区域'], recordCount: '约 45,000 条' },
  };
}

function approvalNodes(request: ApprovalRequest): ApprovalNode[] {
  if (request.requestType === '数据分级降级') {
    if (request.approvalStatus === 'approved') {
      return [
        { id: 'downgrade-owner', name: '技术负责人', status: 'approved', approver: '陈晨（我）', opinion: request.decisionOpinion || '同意降级。', time: request.decisionTime },
        { id: 'downgrade-security', name: '信息安全', status: 'approved', approver: '王玮 / 李子超（或签）', opinion: '符合数据分级调整规范。', time: '2026-07-27 11:02:45' },
      ];
    }
    if (request.approvalStatus === 'rejected') {
      return [
        { id: 'downgrade-owner', name: '技术负责人', status: 'rejected', approver: '陈晨（我）', opinion: request.decisionOpinion, time: request.decisionTime },
        { id: 'downgrade-security', name: '信息安全', status: 'pending', approver: '流程已终止' },
      ];
    }
    return [
      { id: 'downgrade-owner', name: '技术负责人', status: 'current', approver: '陈晨（我）' },
      { id: 'downgrade-security', name: '信息安全', status: 'pending', approver: '王玮 / 李子超（或签）' },
    ];
  }

  if (request.requestType === '数据下载' && request.classificationLevel) {
    const steps = getClassificationFlow(
      request.classificationLevel,
      request.hasPersonalInfoOrCrossBorder,
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
        request.approvalStatus === 'approved'
        || isSystemStep && (step.type === 'automatic' || index < firstApprovalIndex)
      ) {
        status = 'approved';
      } else if (request.approvalStatus === 'rejected') {
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
          : status === 'rejected' ? request.decisionOpinion : undefined,
        time: status === 'approved' ? `2026-04-${27 + Math.min(index, 2)} ${15 + index}:20:10` : undefined,
      };
    });
  }

  const ownerName = request.requestType === '数据表权限' ? '数据 Owner' : '功能负责人';
  if (request.approvalStatus === 'approved') {
    return [
      { id: '1', name: '直属主管', status: 'approved', approver: '张敏', opinion: '同意', time: '2026-04-27 15:40:10' },
      { id: '2', name: ownerName, status: 'approved', approver: '李晨（我）', opinion: request.decisionOpinion, time: request.decisionTime },
      { id: '3', name: '安全审计', status: 'approved', approver: '安全审批组', opinion: '符合安全规范', time: '2026-04-27 16:35:12' },
    ];
  }
  if (request.approvalStatus === 'rejected') {
    return [
      { id: '1', name: '直属主管', status: 'approved', approver: '张敏', opinion: '业务需求属实', time: '2026-04-27 09:55:30' },
      { id: '2', name: ownerName, status: 'rejected', approver: '李晨（我）', opinion: request.decisionOpinion, time: request.decisionTime },
      { id: '3', name: '安全审计', status: 'pending', approver: '流程已终止' },
    ];
  }
  return [
    { id: '1', name: '直属主管', status: 'approved', approver: '张敏', opinion: '用途明确，同意申请', time: '2026-04-29 09:20:15' },
    { id: '2', name: ownerName, status: 'current', approver: '李晨（我）' },
    { id: '3', name: '安全审计', status: 'pending', approver: '待分配' },
  ];
}

export default function ApprovalDecision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = requests[id || '1'] || requests['1'];
  const [decisionState, setDecisionState] = useState<DecisionState>('normal');
  const [decision, setDecision] = useState<DecisionOption>('approve');
  const [target, setTarget] = useState('');
  const [opinion, setOpinion] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const [showTargetError, setShowTargetError] = useState(false);
  const isReadonly = request.approvalStatus !== 'pending';
  const isSubmitting = decisionState === 'submitting';

  const complete = () => {
    setDecisionState('submitting');
    setTimeout(() => {
      setDecisionState('success');
      setTimeout(() => navigate('/approval-center/my-approvals'), 1600);
    }, 900);
  };

  const submitDecision = () => {
    const needsTarget = decision === 'transfer' || decision === 'add-sign';
    if (needsTarget && !target) {
      setShowTargetError(true);
      setDecisionState('validating');
      return;
    }
    if (!opinion.trim()) {
      setShowValidationError(true);
      setDecisionState('validating');
      return;
    }
    setShowTargetError(false);
    setShowValidationError(false);
    complete();
  };

  return (
    <div className="w-full min-w-0 p-4 xl:p-6">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/approval-center/my-approvals')}>
        <ArrowLeft className="mr-2 h-4 w-4" />返回我的审批
      </Button>
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl">
            {request.requestType === '数据下载' ? '审批详情' : request.requestName}
          </h1>
          <RequestTypeBadge type={request.requestType} />
          <span className={`rounded-md px-3 py-1 text-sm font-medium ${request.approvalStatus === 'approved' ? 'bg-success-light text-success' : request.approvalStatus === 'rejected' ? 'bg-destructive-light text-destructive' : 'bg-primary/10 text-primary'}`}>
            {request.approvalStatus === 'approved' ? '审批通过' : request.approvalStatus === 'rejected' ? '已驳回' : `待审批 · ${request.currentNode}`}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">申请单号：{request.requestId}</p>
      </div>

      {decisionState === 'success' && <Alert className="mb-6 border-success/50 bg-success-light"><CheckCircle2 className="h-4 w-4 text-success" /><AlertDescription className="text-success">审批已提交，正在返回审批列表...</AlertDescription></Alert>}

      <div className="detail-layout grid min-w-0 grid-cols-1 gap-6">
        <div className="min-w-0 space-y-6">
          {request.requestType === '数据下载' && <Card>
            <CardHeader><CardTitle>申请信息</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Info label="申请人" value={request.applicant} /><Info label="所属部门" value={request.department} />
              <Info label="申请名称" value={request.requestName} /><Info label="所属系统/模块" value={request.module} />
              <Info label="申请时间" value={request.applyTime} />{request.externalUse !== undefined && <Info label="是否对外使用" value={request.externalUse ? '是' : '否'} />}
              {request.classificationLevel && <Info label="最高字段密级" value={`${request.classificationLevel}（数据开发平台返回）`} />}
              {request.classificationLevel === 'S3' && <Info label="个人信息/跨境" value={request.hasPersonalInfoOrCrossBorder ? '涉及' : '不涉及'} />}
              <div className="col-span-2"><Info label="申请用途" value={request.purpose} /></div>
              {request.remark && <div className="col-span-2"><Info label="补充说明" value={request.remark} /></div>}
              {request.classificationLevel && (
                <div className="col-span-2 rounded-lg border bg-muted/30 p-4">
                  <DataClassificationApprovalFlow
                    level={request.classificationLevel}
                    hasPersonalInfoOrCrossBorder={request.hasPersonalInfoOrCrossBorder}
                  />
                </div>
              )}
            </CardContent>
          </Card>}

          {request.exportConditions && <Card><CardHeader><CardTitle>下载内容</CardTitle></CardHeader><CardContent className="space-y-4"><Info label="时间范围" value={request.exportConditions.dateRange} /><TagList label="筛选条件" values={request.exportConditions.filters} />{request.exportConditions.recordCount && <Info label="预计数据量" value={request.exportConditions.recordCount} />}</CardContent></Card>}

          {request.tablePermission && (
            <TablePermissionDetail
              permission={request.tablePermission}
              creator={request.applicant}
              createdAt={request.applyTime}
              reason={request.purpose}
              requestName={request.requestName}
            />
          )}

          {request.classificationDowngrade && (
            <ClassificationDowngradeDetail downgrade={request.classificationDowngrade} />
          )}

          <ApprovalProcessTable nodes={approvalNodes(request)} applicant={request.applicant} applyTime={request.applyTime} />
        </div>

        <div><Card className="sticky top-6 border-2"><CardHeader className="border-b bg-muted/30"><CardTitle>{isReadonly ? '审批结果' : '审批操作'}</CardTitle></CardHeader><CardContent className="pt-6">
          {isReadonly ? (
            <div className="space-y-5">
              <div className={`flex items-center gap-2 rounded-lg border p-4 font-medium ${request.approvalStatus === 'approved' ? 'border-success/20 bg-success-light/40 text-success' : 'border-destructive/20 bg-destructive-light/40 text-destructive'}`}>{request.approvalStatus === 'approved' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}{request.approvalStatus === 'approved' ? '审批通过' : '已驳回'}</div>
              <Info label="我的审批意见" value={request.decisionOpinion || '-'} /><Info label="处理时间" value={request.decisionTime || '-'} />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label><span className="text-destructive">*</span>审批结果</Label>
                <RadioGroup
                  className="grid grid-cols-2 gap-3"
                  value={decision}
                  onValueChange={(value) => {
                    setDecision(value as DecisionOption);
                    setTarget('');
                    setShowTargetError(false);
                  }}
                  disabled={isSubmitting}
                >
                  {[
                    ['approve', '通过'],
                    ['reject', '驳回'],
                    ['transfer', '转交'],
                    ['add-sign', '加签'],
                  ].map(([value, label]) => (
                    <Label
                      key={value}
                      className={`relative cursor-pointer rounded-lg border-2 p-3.5 font-medium transition-all ${
                        decision === value
                          ? 'border-primary bg-primary/10 text-primary shadow-[0_0_0_2px_rgba(48,105,230,0.12)]'
                          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      <RadioGroupItem value={value} className={decision === value ? 'border-primary ring-2 ring-primary/20' : ''} />
                      <span>{label}</span>
                      {decision === value && <CheckCircle2 className="ml-auto h-4 w-4 fill-primary text-primary-foreground" />}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {(decision === 'transfer' || decision === 'add-sign') && (
                <div className="space-y-2">
                  <Label><span className="text-destructive">*</span>{decision === 'transfer' ? '转交对象' : '加签对象'}</Label>
                  <Select value={target} onValueChange={(value) => { setTarget(value); setShowTargetError(false); }} disabled={isSubmitting}>
                    <SelectTrigger className={showTargetError ? 'border-destructive' : ''}>
                      <SelectValue placeholder={`请选择${decision === 'transfer' ? '转交' : '加签'}对象`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="li-chen">李晨（数据 Owner）</SelectItem>
                      <SelectItem value="wang-fang">王芳（部门负责人）</SelectItem>
                      <SelectItem value="security-team">安全审批组</SelectItem>
                    </SelectContent>
                  </Select>
                  {showTargetError && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />请选择处理对象</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="approval-opinion"><span className="text-destructive">*</span>审批说明</Label>
                <div className="relative">
                  <Textarea
                    id="approval-opinion"
                    className={`min-h-[120px] resize-none pb-7 ${showValidationError ? 'border-destructive' : ''}`}
                    placeholder="请输入审批说明"
                    maxLength={128}
                    value={opinion}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setOpinion(event.target.value);
                      setShowValidationError(false);
                    }}
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{opinion.length}/128</span>
                </div>
                {showValidationError && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />请输入审批说明</p>}
              </div>

              <Button className="w-full" disabled={isSubmitting} onClick={submitDecision}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                提交
              </Button>
            </div>
          )}
        </CardContent></Card></div>
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
