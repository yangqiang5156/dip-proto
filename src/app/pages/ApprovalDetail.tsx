import { useParams, useNavigate } from "react-router";
import { Download, AlertCircle, CheckCircle2, Clock, XCircle, FileX, Loader2, Copy, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StatusBadge, ApprovalStatus } from "../components/download-center/StatusBadge";
import { ApprovalProgress, ApprovalNode } from "../components/download-center/ApprovalProgress";
import { Alert, AlertDescription } from "../components/ui/alert";

type FileStatus =
  | "generating"
  | "ready"
  | "downloaded"
  | "expired"
  | "failed";

interface ApplicationDetail {
  id: string;
  entryName: string;
  module: string;
  page: string;
  applicant: string;
  department: string;
  applyTime: string;
  externalUse: boolean;
  purpose: string;
  remark?: string;
  status: ApprovalStatus;
  fileStatus: FileStatus;
  fileUrl?: string;
  downloadTime?: string;
  fileSize?: string;
  errorMessage?: string;
  exportConditions: {
    dateRange: string;
    filters: string[];
  };
}

const mockApplications: Record<string, ApplicationDetail> = {
  "1": {
    id: "DL202604280031",
    entryName: "用户行为分析",
    module: "数据分析",
    page: "用户画像",
    applicant: "李明",
    department: "产品部",
    applyTime: "2026-04-28 14:30:22",
    externalUse: false,
    purpose: "用于本周产品周报分析，需要导出最近一周的用户活跃数据，分析用户留存率和活跃度趋势",
    remark: "请尽快审批，本周五需要提交报告",
    status: "审批中",
    fileStatus: "generating",
    exportConditions: {
      dateRange: "2026-04-21 至 2026-04-28",
      filters: ["活跃用户", "登录次数 > 5", "地区：北京、上海、深圳"],
    },
  },
  "2": {
    id: "DL202604280028",
    entryName: "销售数据导出",
    module: "财务管理",
    page: "销售报表",
    applicant: "王芳",
    department: "财务部",
    applyTime: "2026-04-28 10:15:30",
    externalUse: true,
    purpose: "季度财务汇报使用，需提供给外部审计机构进行财务审计",
    status: "已驳回",
    fileStatus: "failed",
    errorMessage: "审批被拒绝，原因：缺少部门负责人签字，请补充完整审批材料后重新提交",
    exportConditions: {
      dateRange: "2026-01-01 至 2026-03-31",
      filters: ["订单状态：已完成", "金额 > 1000元", "销售区域：全国"],
    },
  },
  "3": {
    id: "DL202604270156",
    entryName: "客户信息表",
    module: "客户管理",
    page: "客户列表",
    applicant: "张敏",
    department: "市场部",
    applyTime: "2026-04-27 16:45:10",
    externalUse: false,
    purpose: "市场活动策划需要，导出VIP客户信息用于定向营销活动推送",
    status: "待下载",
    fileStatus: "ready",
    fileUrl: "/downloads/customer_data_20260427.xlsx",
    fileSize: "2.3 MB",
    exportConditions: {
      dateRange: "全部时间",
      filters: ["客户等级：VIP", "消费金额 > 10000元", "最近一年活跃"],
    },
  },
  "4": {
    id: "DL202604260089",
    entryName: "订单明细",
    module: "订单管理",
    page: "订单中心",
    applicant: "刘强",
    department: "运营部",
    applyTime: "2026-04-26 09:20:45",
    externalUse: false,
    purpose: "运营月报数据分析，统计3月份订单情况和销售趋势",
    status: "已下载",
    fileStatus: "downloaded",
    fileUrl: "/downloads/order_details_20260426.xlsx",
    downloadTime: "2026-04-26 18:30:12",
    fileSize: "5.7 MB",
    exportConditions: {
      dateRange: "2026-03-01 至 2026-03-31",
      filters: ["订单状态：全部", "支付方式：在线支付"],
    },
  },
  "5": {
    id: "DL202604180012",
    entryName: "员工绩效数据",
    module: "人力资源",
    page: "绩效管理",
    applicant: "陈华",
    department: "人力资源部",
    applyTime: "2026-04-18 11:10:00",
    externalUse: false,
    purpose: "第一季度绩效评估汇总，用于年度绩效考核和薪资调整参考",
    status: "已过期",
    fileStatus: "expired",
    exportConditions: {
      dateRange: "2026-01-01 至 2026-03-31",
      filters: ["员工状态：在职", "部门：全部"],
    },
  },
};

const mockApprovalNodes: Record<string, ApprovalNode[]> = {
  "1": [
    {
      id: "1",
      name: "直属领导",
      status: "approved",
      approver: "张敏",
      opinion: "同意",
      time: "2026-04-28 14:35:10",
    },
    {
      id: "2",
      name: "功能负责人",
      status: "current",
      approver: "李晨",
    },
    {
      id: "3",
      name: "安全部门审批组",
      status: "pending",
      approver: "待分配",
    },
  ],
  "2": [
    {
      id: "1",
      name: "直属领导",
      status: "approved",
      approver: "赵雪",
      opinion: "数据用途合理，同意申请",
      time: "2026-04-28 10:20:15",
    },
    {
      id: "2",
      name: "功能负责人",
      status: "rejected",
      approver: "周强",
      opinion: "缺少部门负责人签字，请补充完整审批材料后重新提交",
      time: "2026-04-28 11:05:40",
    },
  ],
  "3": [
    {
      id: "1",
      name: "直属领导",
      status: "approved",
      approver: "孙丽",
      opinion: "业务需求明确，同意",
      time: "2026-04-27 16:50:22",
    },
    {
      id: "2",
      name: "功能负责人",
      status: "approved",
      approver: "吴刚",
      opinion: "已确认数据范围，批准",
      time: "2026-04-27 17:15:08",
    },
    {
      id: "3",
      name: "安全部门审批组",
      status: "approved",
      approver: "郑涛",
      opinion: "已通过安全审查",
      time: "2026-04-27 17:45:33",
    },
  ],
  "4": [
    {
      id: "1",
      name: "直属领导",
      status: "approved",
      approver: "林芳",
      opinion: "同意导出",
      time: "2026-04-26 09:30:18",
    },
    {
      id: "2",
      name: "功能负责人",
      status: "approved",
      approver: "黄磊",
      opinion: "审核通过",
      time: "2026-04-26 10:12:45",
    },
    {
      id: "3",
      name: "安全部门审批组",
      status: "approved",
      approver: "杨静",
      opinion: "无安全风险",
      time: "2026-04-26 10:50:20",
    },
  ],
  "5": [
    {
      id: "1",
      name: "直属领导",
      status: "approved",
      approver: "钱伟",
      opinion: "同意",
      time: "2026-04-18 11:15:30",
    },
    {
      id: "2",
      name: "功能负责人",
      status: "approved",
      approver: "孙美",
      opinion: "批准",
      time: "2026-04-18 11:40:22",
    },
    {
      id: "3",
      name: "安全部门审批组",
      status: "approved",
      approver: "周杰",
      opinion: "通过",
      time: "2026-04-18 12:05:15",
    },
  ],
};

export default function ApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const application = mockApplications[id || "1"] || mockApplications["1"];
  const approvalNodes = mockApprovalNodes[id || "1"] || mockApprovalNodes["1"];

  const handleDownload = () => {
    console.log("下载文件:", application.fileUrl);
  };

  const handleWithdraw = () => {
    console.log("撤回申请");
  };

  const handleCopyAndResubmit = () => {
    navigate("/new-application");
  };

  const renderFileStatusCard = () => {
    const { fileStatus, fileUrl, fileSize, downloadTime, errorMessage } = application;

    const statusConfig = {
      generating: {
        icon: <Loader2 className="h-5 w-5 text-info animate-spin" />,
        title: "文件生成中",
        description: "系统正在生成您的导出文件，预计需要 3-5 分钟，请稍候...",
        color: "bg-info-light border-info/20",
      },
      ready: {
        icon: <Download className="h-5 w-5 text-primary" />,
        title: "文件已就绪",
        description: `文件大小：${fileSize}`,
        color: "bg-primary-light border-primary/20",
      },
      downloaded: {
        icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        title: "已下载",
        description: `下载时间：${downloadTime}`,
        color: "bg-success-light border-success/20",
      },
      expired: {
        icon: <Clock className="h-5 w-5 text-muted-foreground" />,
        title: "文件已过期",
        description: "文件已超过系统保留期限",
        color: "bg-muted border-border",
      },
      failed: {
        icon: <FileX className="h-5 w-5 text-destructive" />,
        title: "生成失败",
        description: errorMessage || "文件生成失败，请重新提交申请",
        color: "bg-destructive-light border-destructive/20",
      },
    };

    const config = statusConfig[fileStatus];

    return (
      <Card>
        <CardHeader>
          <CardTitle>文件状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${config.color}`}>
            <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{config.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderActions = () => {
    const { status, fileStatus } = application;

    return (
      <div className="space-y-3">
        {status === "审批中" && (
          <Button variant="outline" className="w-full" onClick={handleWithdraw}>
            撤回申请
          </Button>
        )}

        {status === "已驳回" && (
          <Button variant="outline" className="w-full" onClick={handleCopyAndResubmit}>
            <Copy className="h-4 w-4 mr-2" />
            复制并重新发起
          </Button>
        )}

        {fileStatus === "ready" && (
          <Button className="w-full" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            去下载文件
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回我的申请
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl">申请详情</h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="text-sm text-muted-foreground">申请单号：{application.id}</p>
      </div>

      {application.status === "已驳回" && (
        <Alert className="mb-6 border-destructive/50 bg-destructive-light">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {application.errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">申请单号</p>
                  <p className="text-sm text-foreground">{application.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">入口名称</p>
                  <p className="text-sm text-foreground">{application.entryName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">模块</p>
                  <p className="text-sm text-foreground">{application.module}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">页面</p>
                  <p className="text-sm text-foreground">{application.page}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">申请人</p>
                  <p className="text-sm text-foreground">{application.applicant}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">部门</p>
                  <p className="text-sm text-foreground">{application.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">申请时间</p>
                  <p className="text-sm text-foreground">{application.applyTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">是否对外使用</p>
                  <p className="text-sm text-foreground">
                    {application.externalUse ? "是" : "否"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">下载用途</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {application.purpose}
                  </p>
                </div>
                {application.remark && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">备注</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {application.remark}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>导出条件摘要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">时间范围</p>
                  <p className="text-sm text-foreground">{application.exportConditions.dateRange}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">筛选条件</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.exportConditions.filters.map((filter, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>审批流程</CardTitle>
            </CardHeader>
            <CardContent>
              <ApprovalProgress nodes={approvalNodes} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {renderFileStatusCard()}

          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
            </CardHeader>
            <CardContent>{renderActions()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
