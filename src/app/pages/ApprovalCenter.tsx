import { useState } from "react";
import { Link } from "react-router";
import { Search, Plus } from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface Approval {
  id: string;
  type: string;
  name: string;
  content: string;
  status: ApprovalStatus;
  applicant: string;
  approver: string;
  createTime: string;
  approvalTime: string;
}

const mockApprovals: Approval[] = [
  {
    id: "1",
    type: "资源创建",
    name: "创建项目",
    content: "申请在智能部审词空间下创建《会对识别一期》项目...",
    status: "pending",
    applicant: "张三",
    approver: "-",
    createTime: "2026-01-26 10:00",
    approvalTime: "-",
  },
  {
    id: "2",
    type: "资源导出",
    name: "数据集导出",
    content: "导出《高质标测数据集 V2.5.0》，用于本地部署线...",
    status: "approved",
    applicant: "王小明",
    approver: "王五",
    createTime: "2026-01-25 14:30",
    approvalTime: "2026-01-25 16:20",
  },
  {
    id: "3",
    type: "资源创建",
    name: "创建数据集",
    content: "申请创建《心悦号端标测数据集》，包含3000条图...",
    status: "pending",
    applicant: "赵六",
    approver: "-",
    createTime: "2026-01-26 09:15",
    approvalTime: "-",
  },
  {
    id: "4",
    type: "模型管理",
    name: "发布模型版本",
    content: "申请发布《会对识别模型 V2.5.0》，已完成训练测...",
    status: "rejected",
    applicant: "孙七",
    approver: "李四",
    createTime: "2026-01-24 11:00",
    approvalTime: "2026-01-24 13:45",
  },
];

export default function ApprovalCenter() {
  const [activeTab, setActiveTab] = useState<"all" | "myApproval" | "myApplication">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-[#4A7BF7] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A7BF7]"></span>
          待审批
        </span>;
      case "approved":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
          已通过
        </span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>
          已拒绝
        </span>;
    }
  };

  const filteredApprovals = mockApprovals.filter(approval => {
    if (statusFilter !== "all" && approval.status !== statusFilter) return false;
    if (searchQuery && !approval.name.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">审批中心</h1>
        <p className="text-sm text-gray-500">管理系统内的各类资源访问与操作权限申请</p>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-[#4A7BF7] text-[#4A7BF7]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              全部审批
            </button>
            <button
              onClick={() => setActiveTab("myApproval")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "myApproval"
                  ? "border-[#4A7BF7] text-[#4A7BF7]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              待我审批
            </button>
            <button
              onClick={() => setActiveTab("myApplication")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "myApplication"
                  ? "border-[#4A7BF7] text-[#4A7BF7]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              我的申请
            </button>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="pending">待审批</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent">
            <option>全部申请人</option>
          </select>

          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="申请名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-[#4A7BF7] text-white rounded-lg text-sm hover:bg-[#3d6ad6] transition-colors">
              查询
            </button>
          </div>

          <Link
            to="/new-application"
            className="px-4 py-2 bg-[#4A7BF7] text-white rounded-lg text-sm hover:bg-[#3d6ad6] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建申请
          </Link>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请内容</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">审批状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">审批人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">审批时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApprovals.map((approval) => (
                <tr key={approval.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{approval.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{approval.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{approval.content}</td>
                  <td className="px-6 py-4">{getStatusBadge(approval.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{approval.applicant}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{approval.approver}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{approval.createTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{approval.approvalTime}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/approval/${approval.id}`}
                      className="text-[#4A7BF7] hover:text-[#3d6ad6] text-sm"
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
