import { Download, Clock, CheckCircle, FileText, Database } from "lucide-react";

interface ExportTask {
  id: string;
  name: string;
  type: string;
  format: string;
  size: string;
  status: "pending" | "processing" | "completed" | "failed";
  createTime: string;
  completeTime?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  downloadUrl?: string;
}

const mockExportTasks: ExportTask[] = [
  {
    id: "1",
    name: "用户行为数据集 2026-01",
    type: "数据导出",
    format: "CSV",
    size: "125 MB",
    status: "completed",
    createTime: "2026-01-25 14:30",
    completeTime: "2026-01-25 16:20",
    approvalStatus: "approved",
    downloadUrl: "#",
  },
  {
    id: "2",
    name: "模型训练数据集 V2.5",
    type: "数据导出",
    format: "Excel",
    size: "85 MB",
    status: "processing",
    createTime: "2026-01-26 09:00",
    approvalStatus: "approved",
  },
  {
    id: "3",
    name: "图像标注结果数据",
    type: "数据导出",
    format: "JSON",
    size: "320 MB",
    status: "pending",
    createTime: "2026-01-26 10:15",
    approvalStatus: "pending",
  },
  {
    id: "4",
    name: "客户信息统计报表",
    type: "数据导出",
    format: "Excel",
    size: "45 MB",
    status: "completed",
    createTime: "2026-01-24 15:20",
    completeTime: "2026-01-24 15:45",
    approvalStatus: "approved",
    downloadUrl: "#",
  },
  {
    id: "5",
    name: "系统日志数据",
    type: "数据导出",
    format: "CSV",
    size: "580 MB",
    status: "failed",
    createTime: "2026-01-23 11:00",
    approvalStatus: "approved",
  },
];

export default function ExportCenter() {
  const getStatusBadge = (status: string, approvalStatus: string) => {
    if (approvalStatus === "pending") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          待审批
        </span>
      );
    }
    if (approvalStatus === "rejected") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
          审批拒绝
        </span>
      );
    }

    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            已完成
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-[#4A7BF7] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            处理中
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            等待中
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            失败
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">导出中心</h1>
        <p className="text-sm text-gray-500">统一管理所有数据导出任务，审批通过后可下载</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">全部任务</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">24</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待审批</p>
              <p className="text-2xl font-semibold text-yellow-600 mt-1">3</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">处理中</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">5</p>
            </div>
            <Database className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">可下载</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">16</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* 导出任务列表 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent">
              <option>全部状态</option>
              <option>待审批</option>
              <option>处理中</option>
              <option>已完成</option>
              <option>失败</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent">
              <option>全部格式</option>
              <option>CSV</option>
              <option>Excel</option>
              <option>JSON</option>
            </select>

            <input
              type="text"
              placeholder="搜索任务名称..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">任务名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">导出格式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">文件大小</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">完成时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockExportTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{task.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.format}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.size}</td>
                  <td className="px-6 py-4">{getStatusBadge(task.status, task.approvalStatus)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.createTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {task.completeTime || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {task.status === "completed" && task.approvalStatus === "approved" && task.downloadUrl ? (
                      <button className="flex items-center gap-1 text-[#4A7BF7] hover:text-[#3d6ad6] text-sm">
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">共 {mockExportTasks.length} 条记录</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              上一页
            </button>
            <button className="px-3 py-1 bg-[#4A7BF7] text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
