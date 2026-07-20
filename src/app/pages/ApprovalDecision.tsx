import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ApprovalProgress, ApprovalNode } from "../components/download-center/ApprovalProgress";
import { RiskLevelBadge } from "../components/download-center/RiskLevelBadge";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

type RiskLevel = 'low' | 'medium' | 'high';
type DecisionState = 'normal' | 'validating' | 'submitting' | 'success' | 'readonly';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface ApprovalRequest {
  id: string;
  requestId: string;
  applicant: string;
  department: string;
  module: string;
  page: string;
  entryName: string;
  applyTime: string;
  externalUse: boolean;
  purpose: string;
  remark: string;
  riskLevel: RiskLevel;
  currentNode: string;
  approvalStatus: ApprovalStatus;
  decisionTime?: string;
  decisionOpinion?: string;
  exportConditions: {
    dateRange: string;
    filters: string[];
    recordCount?: string;
  };
}

const mockRequests: Record<string, ApprovalRequest> = {
  '1': {
    id: '1',
    requestId: 'DL202604290015',
    applicant: '李明',
    department: '产品部',
    module: '数据分析',
    page: '用户画像',
    entryName: '用户行为分析',
    applyTime: '2026-04-29 09:15:30',
    externalUse: false,
    purpose: '用于本周产品周报分析，需要导出最近一周的用户活跃数据，分析用户行为特征和使用习惯',
    remark: '数据仅用于内部分析，不对外公开',
    riskLevel: 'medium',
    currentNode: '功能负责人',
    approvalStatus: 'pending',
    exportConditions: {
      dateRange: '2026-04-22 至 2026-04-29',
      filters: ['活跃用户', '登录次数 > 5', '地区：北京、上海、深圳'],
      recordCount: '约 45,000 条',
    },
  },
  '2': {
    id: '2',
    requestId: 'DL202604290012',
    applicant: '王芳',
    department: '财务部',
    module: '财务管理',
    page: '销售报表',
    entryName: '销售数据导出',
    applyTime: '2026-04-29 08:30:15',
    externalUse: true,
    purpose: '季度财务汇报使用，需提供给外部审计机构进行年度审计',
    remark: '该数据将提供给德勤会计师事务所，用于2026年Q1财务审计',
    riskLevel: 'high',
    currentNode: '功能负责人',
    approvalStatus: 'pending',
    exportConditions: {
      dateRange: '2026-01-01 至 2026-03-31',
      filters: ['订单状态：已完成', '金额 > 1000元', '销售区域：全国'],
      recordCount: '约 280,000 条',
    },
  },
  '3': {
    id: '3',
    requestId: 'DL202604280098',
    applicant: '张敏',
    department: '市场部',
    module: '客户管理',
    page: '客户列表',
    entryName: '客户信息表',
    applyTime: '2026-04-28 16:45:10',
    externalUse: false,
    purpose: '市场活动策划需要，导出VIP客户信息用于定向营销',
    remark: '计划于五一期间开展VIP客户专属活动',
    riskLevel: 'medium',
    currentNode: '功能负责人',
    approvalStatus: 'pending',
    exportConditions: {
      dateRange: '全部时间',
      filters: ['客户等级：VIP', '消费金额 > 10000元', '最近一年活跃'],
      recordCount: '约 12,000 条',
    },
  },
  '4': {
    id: '4',
    requestId: 'DL202604280075',
    applicant: '刘强',
    department: '运营部',
    module: '订单管理',
    page: '订单中心',
    entryName: '订单明细',
    applyTime: '2026-04-28 14:20:30',
    externalUse: false,
    purpose: '运营月报数据分析，统计三月份订单完成情况和用户购买偏好',
    remark: '',
    riskLevel: 'low',
    currentNode: '功能负责人',
    approvalStatus: 'pending',
    exportConditions: {
      dateRange: '2026-03-01 至 2026-03-31',
      filters: ['订单状态：全部', '支付方式：在线支付'],
      recordCount: '约 8,500 条',
    },
  },
  '5': {
    id: '5', requestId: 'DL202604280056', applicant: '陈华', department: '人力资源部',
    module: '人力资源', page: '绩效管理', entryName: '员工绩效数据',
    applyTime: '2026-04-28 11:10:00', externalUse: false,
    purpose: '用于第一季度绩效评估汇总，为年度绩效考核提供数据依据',
    remark: '数据仅限人力资源部内部使用', riskLevel: 'medium', currentNode: '流程结束',
    approvalStatus: 'approved', decisionTime: '2026-04-28 11:40:22', decisionOpinion: '批准',
    exportConditions: {
      dateRange: '2026-01-01 至 2026-03-31', filters: ['员工状态：在职', '部门：全部'], recordCount: '约 1,200 条',
    },
  },
  '6': {
    id: '6', requestId: 'DL202604270143', applicant: '周杰', department: '技术部',
    module: '系统管理', page: '日志中心', entryName: '系统日志导出',
    applyTime: '2026-04-27 15:30:22', externalUse: false,
    purpose: '排查线上服务异常，分析错误日志并定位接口超时原因',
    remark: '排查完成后按安全规范处理数据', riskLevel: 'low', currentNode: '流程结束',
    approvalStatus: 'approved', decisionTime: '2026-04-27 16:15:30',
    decisionOpinion: '已确认数据用途，符合安全规范，批准',
    exportConditions: {
      dateRange: '2026-04-27 14:00 至 16:00', filters: ['日志级别：ERROR', '服务：订单服务'], recordCount: '约 3,600 条',
    },
  },
  '7': {
    id: '7', requestId: 'DL202604270089', applicant: '吴明', department: '市场部',
    module: '营销管理', page: '客户运营', entryName: '客户触达记录',
    applyTime: '2026-04-27 09:40:18', externalUse: true,
    purpose: '分析营销活动触达效果，为下一阶段投放策略提供依据',
    remark: '计划提供给外部营销服务商联合分析', riskLevel: 'high', currentNode: '功能负责人',
    approvalStatus: 'rejected', decisionTime: '2026-04-27 10:25:15',
    decisionOpinion: '导出范围过大，请缩小时间范围后重新申请',
    exportConditions: {
      dateRange: '2025-01-01 至 2026-04-27', filters: ['全部客户', '全部触达渠道'], recordCount: '约 920,000 条',
    },
  },
  '8': {
    id: '8', requestId: 'DL202604260123', applicant: '郑丽', department: '财务部',
    module: '财务管理', page: '报销管理', entryName: '费用报销明细',
    applyTime: '2026-04-26 13:55:08', externalUse: false,
    purpose: '月度费用分析与预算执行复盘', remark: '', riskLevel: 'medium', currentNode: '流程结束',
    approvalStatus: 'approved', decisionTime: '2026-04-26 14:50:40',
    decisionOpinion: '数据范围合理，业务需求真实，同意导出',
    exportConditions: {
      dateRange: '2026-03-01 至 2026-03-31', filters: ['报销状态：已完成', '费用类型：全部'], recordCount: '约 6,800 条',
    },
  },
};

const mockApprovalNodesMap: Record<string, ApprovalNode[]> = {
  '1': [
    {
      id: '1',
      name: '直属领导',
      status: 'approved',
      approver: '张敏',
      opinion: '同意申请，用途合理',
      time: '2026-04-29 09:20:15',
    },
    {
      id: '2',
      name: '功能负责人',
      status: 'current',
      approver: '李晨（我）',
    },
    {
      id: '3',
      name: '安全部门审批组',
      status: 'pending',
      approver: '待分配',
    },
  ],
  '2': [
    {
      id: '1',
      name: '直属领导',
      status: 'approved',
      approver: '赵雪',
      opinion: '数据用途合理，同意申请',
      time: '2026-04-29 08:35:20',
    },
    {
      id: '2',
      name: '功能负责人',
      status: 'current',
      approver: '李晨（我）',
    },
    {
      id: '3',
      name: '安全部门审批组',
      status: 'pending',
      approver: '待分配',
    },
  ],
  '3': [
    {
      id: '1',
      name: '直属领导',
      status: 'approved',
      approver: '孙丽',
      opinion: '业务需求明确，同意',
      time: '2026-04-28 16:50:22',
    },
    {
      id: '2',
      name: '功能负责人',
      status: 'current',
      approver: '李晨（我）',
    },
    {
      id: '3',
      name: '安全部门审批组',
      status: 'pending',
      approver: '待分配',
    },
  ],
  '4': [
    {
      id: '1',
      name: '直属领导',
      status: 'approved',
      approver: '林芳',
      opinion: '同意导出',
      time: '2026-04-28 14:30:18',
    },
    {
      id: '2',
      name: '功能负责人',
      status: 'current',
      approver: '李晨（我）',
    },
    {
      id: '3',
      name: '安全部门审批组',
      status: 'pending',
      approver: '待分配',
    },
  ],
  '5': [
    { id: '1', name: '直属领导', status: 'approved', approver: '王经理', opinion: '用途明确，同意申请', time: '2026-04-28 11:18:10' },
    { id: '2', name: '功能负责人', status: 'approved', approver: '李晨（我）', opinion: '批准', time: '2026-04-28 11:40:22' },
    { id: '3', name: '安全部门审批组', status: 'approved', approver: '安全审批组', opinion: '符合数据安全要求', time: '2026-04-28 12:05:15' },
  ],
  '6': [
    { id: '1', name: '直属领导', status: 'approved', approver: '赵主管', opinion: '同意用于故障排查', time: '2026-04-27 15:38:40' },
    { id: '2', name: '功能负责人', status: 'approved', approver: '李晨（我）', opinion: '已确认数据用途，符合安全规范，批准', time: '2026-04-27 16:15:30' },
    { id: '3', name: '安全部门审批组', status: 'approved', approver: '安全审批组', opinion: '仅限内部排障使用', time: '2026-04-27 16:35:12' },
  ],
  '7': [
    { id: '1', name: '直属领导', status: 'approved', approver: '陈经理', opinion: '业务需求属实', time: '2026-04-27 09:55:30' },
    { id: '2', name: '功能负责人', status: 'rejected', approver: '李晨（我）', opinion: '导出范围过大，请缩小时间范围后重新申请', time: '2026-04-27 10:25:15' },
    { id: '3', name: '安全部门审批组', status: 'pending', approver: '流程已终止' },
  ],
  '8': [
    { id: '1', name: '直属领导', status: 'approved', approver: '周总监', opinion: '同意', time: '2026-04-26 14:08:20' },
    { id: '2', name: '功能负责人', status: 'approved', approver: '李晨（我）', opinion: '数据范围合理，业务需求真实，同意导出', time: '2026-04-26 14:50:40' },
    { id: '3', name: '安全部门审批组', status: 'approved', approver: '安全审批组', opinion: '审批通过', time: '2026-04-26 15:10:05' },
  ],
};

export default function ApprovalDecision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decisionState, setDecisionState] = useState<DecisionState>('normal');
  const [opinion, setOpinion] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);

  const request = mockRequests[id || '1'] || mockRequests['1'];
  const approvalNodes = mockApprovalNodesMap[id || '1'] || mockApprovalNodesMap['1'];

  const handleApprove = () => {
    if (!opinion.trim()) {
      setOpinion('同意');
    }
    setDecisionState('submitting');
    setTimeout(() => {
      setDecisionState('success');
      setTimeout(() => {
        navigate('/my-approvals');
      }, 2000);
    }, 1500);
  };

  const handleReject = () => {
    if (!opinion.trim()) {
      setShowValidationError(true);
      setDecisionState('validating');
      return;
    }
    setShowValidationError(false);
    setDecisionState('submitting');
    setTimeout(() => {
      setDecisionState('success');
      setTimeout(() => {
        navigate('/my-approvals');
      }, 2000);
    }, 1500);
  };

  const handleOpinionChange = (value: string) => {
    setOpinion(value);
    if (value.trim() && showValidationError) {
      setShowValidationError(false);
      setDecisionState('normal');
    }
  };

  const isReadonly = request.approvalStatus !== 'pending' || decisionState === 'readonly';
  const isSubmitting = decisionState === 'submitting';
  const isSuccess = decisionState === 'success';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button and Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/my-approvals')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回我的审批
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl">审批详情</h1>
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${
            request.approvalStatus === 'approved'
              ? 'bg-success-light text-success'
              : request.approvalStatus === 'rejected'
                ? 'bg-destructive-light text-destructive'
                : 'bg-primary/10 text-primary'
          }`}>
            {request.approvalStatus === 'approved'
              ? '审批通过'
              : request.approvalStatus === 'rejected'
                ? '已驳回'
                : `待审批 · ${request.currentNode}`}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">申请单号：{request.requestId}</p>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <Alert className="mb-6 border-success/50 bg-success-light">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            审批已提交，正在跳转...
          </AlertDescription>
        </Alert>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Summary */}
          <Card>
            <CardHeader>
              <CardTitle>申请人信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">申请人</p>
                  <p className="text-sm text-foreground font-medium">{request.applicant}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">所属部门</p>
                  <p className="text-sm text-foreground">{request.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">申请时间</p>
                  <p className="text-sm text-foreground">{request.applyTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">是否对外使用</p>
                  <p className="text-sm text-foreground">
                    {request.externalUse ? '是' : '否'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Purpose */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>申请用途</CardTitle>
                <RiskLevelBadge level={request.riskLevel} size="sm" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">入口名称</p>
                  <p className="text-sm text-foreground font-medium">{request.entryName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">所属模块</p>
                  <p className="text-sm text-foreground">{request.module} / {request.page}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">用途说明</p>
                  <p className="text-sm text-foreground leading-relaxed">{request.purpose}</p>
                </div>
                {request.remark && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">补充说明</p>
                    <p className="text-sm text-foreground leading-relaxed">{request.remark}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Export Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>导出条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">时间范围</p>
                  <p className="text-sm text-foreground">{request.exportConditions.dateRange}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">筛选条件</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.exportConditions.filters.map((filter, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
                {request.exportConditions.recordCount && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">预计数据量</p>
                    <p className="text-sm text-foreground">
                      {request.exportConditions.recordCount}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Approval Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>审批流程</CardTitle>
            </CardHeader>
            <CardContent>
              <ApprovalProgress nodes={approvalNodes} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Approval Action (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="border-2">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle>{isReadonly ? '审批结果' : '审批操作'}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isReadonly ? (
                  <div className="space-y-5">
                    <div className={`rounded-lg border p-4 ${
                      request.approvalStatus === 'approved'
                        ? 'border-success/20 bg-success-light/40'
                        : 'border-destructive/20 bg-destructive-light/40'
                    }`}>
                      <div className={`flex items-center gap-2 font-medium ${
                        request.approvalStatus === 'approved' ? 'text-success' : 'text-destructive'
                      }`}>
                        {request.approvalStatus === 'approved'
                          ? <CheckCircle2 className="h-5 w-5" />
                          : <XCircle className="h-5 w-5" />}
                        {request.approvalStatus === 'approved' ? '审批通过' : '已驳回'}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">我的审批意见</p>
                      <p className="text-sm leading-6 text-foreground">{request.decisionOpinion}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">处理时间</p>
                      <p className="text-sm text-foreground">{request.decisionTime}</p>
                    </div>
                    <p className="border-t pt-4 text-xs leading-5 text-muted-foreground">
                      此审批已完成。左侧可查看完整申请内容和全部审批流程。
                    </p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {/* Opinion Textarea */}
                  <div>
                    <Textarea
                      placeholder="请输入审批意见..."
                      value={opinion}
                      onChange={(e) => handleOpinionChange(e.target.value)}
                      className={`min-h-[120px] resize-none ${
                        showValidationError ? 'border-destructive' : ''
                      }`}
                      disabled={isReadonly || isSubmitting || isSuccess}
                    />
                    {showValidationError && (
                      <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        驳回时必须填写驳回原因
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={handleApprove}
                      disabled={isReadonly || isSubmitting || isSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          提交中...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          通过
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleReject}
                      disabled={isReadonly || isSubmitting || isSuccess}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      驳回
                    </Button>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
