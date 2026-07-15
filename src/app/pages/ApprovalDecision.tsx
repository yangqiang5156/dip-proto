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
    exportConditions: {
      dateRange: '2026-03-01 至 2026-03-31',
      filters: ['订单状态：全部', '支付方式：在线支付'],
      recordCount: '约 8,500 条',
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
        navigate('/pending-approval');
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
        navigate('/pending-approval');
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

  const isReadonly = decisionState === 'readonly';
  const isSubmitting = decisionState === 'submitting';
  const isSuccess = decisionState === 'success';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button and Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/pending-approval')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回待我审批
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl">审批详情</h1>
          <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
            {request.currentNode}
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
                <CardTitle>审批操作</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
