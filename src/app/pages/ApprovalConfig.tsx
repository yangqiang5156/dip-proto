import { useState } from "react";
import { Plus, Edit2, Trash2, GitBranch, User, CheckCircle } from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "approval" | "condition";
  name: string;
  approver?: string;
  condition?: string;
  branches?: WorkflowNode[][];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: string;
  nodes: WorkflowNode[];
  enabled: boolean;
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "默认审批流程",
    description: "适用于一般性的资源申请和权限变更",
    type: "资源创建",
    enabled: true,
    nodes: [
      { id: "1", type: "approval", name: "部门主管审批", approver: "部门主管" },
      { id: "2", type: "approval", name: "技术负责人审批", approver: "技术负责人" },
    ],
  },
  {
    id: "2",
    name: "数据安全审批流程",
    description: "用于涉及敏感数据的导出和访问申请",
    type: "数据导出",
    enabled: true,
    nodes: [
      { id: "1", type: "approval", name: "部门主管审批", approver: "部门主管" },
      {
        id: "2",
        type: "condition",
        name: "条件分支",
        condition: "数据量 > 10000",
        branches: [
          [
            { id: "3a", type: "approval", name: "数据安全专员审批", approver: "数据安全专员" },
            { id: "4a", type: "approval", name: "CTO审批", approver: "CTO" },
          ],
          [{ id: "3b", type: "approval", name: "技术负责人审批", approver: "技术负责人" }],
        ],
      },
    ],
  },
  {
    id: "3",
    name: "快速审批流程",
    description: "适用于低风险、紧急的申请",
    type: "资源创建",
    enabled: true,
    nodes: [{ id: "1", type: "approval", name: "直属领导审批", approver: "直属领导" }],
  },
];

export default function ApprovalConfig() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">审批流程配置</h1>
          <p className="text-sm text-gray-500">管理和配置各类审批流程，支持多级审批和条件分支</p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="px-4 py-2 bg-[#4A7BF7] text-white rounded-lg hover:bg-[#3d6ad6] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新建流程
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：流程列表 */}
        <div className="col-span-1 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">审批流程列表</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {mockWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedWorkflow?.id === workflow.id
                    ? "bg-blue-50 border-l-2 border-[#4A7BF7]"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{workflow.name}</h4>
                  {workflow.enabled && (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{workflow.description}</p>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {workflow.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：流程详情和编辑器 */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm">
          {selectedWorkflow ? (
            <>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedWorkflow.name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedWorkflow.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-[#4A7BF7] hover:bg-gray-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">流程结构</h3>

                {/* 流程可视化 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      开始
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">发起申请</p>
                      <p className="text-xs text-gray-500">申请人提交申请</p>
                    </div>
                  </div>

                  {/* 审批节点 */}
                  {selectedWorkflow.nodes.map((node, index) => (
                    <div key={node.id}>
                      {/* 连接线 */}
                      <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-gray-300"></div>
                      </div>

                      {node.type === "approval" ? (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                          <User className="w-10 h-10 text-[#4A7BF7]" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{node.name}</p>
                            <p className="text-xs text-gray-500">审批人：{node.approver}</p>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-[#4A7BF7] hover:bg-white rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-purple-200 rounded-lg overflow-hidden">
                          <div className="flex items-center gap-3 p-4 bg-purple-50">
                            <GitBranch className="w-10 h-10 text-purple-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{node.name}</p>
                              <p className="text-xs text-gray-500">条件：{node.condition}</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-white rounded">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* 分支 */}
                          {node.branches && (
                            <div className="grid grid-cols-2 divide-x divide-purple-200 bg-white">
                              {node.branches.map((branch, branchIndex) => (
                                <div key={branchIndex} className="p-4">
                                  <p className="text-xs font-medium text-gray-500 mb-3">
                                    分支 {branchIndex + 1}
                                  </p>
                                  <div className="space-y-2">
                                    {branch.map((branchNode) => (
                                      <div
                                        key={branchNode.id}
                                        className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                                      >
                                        <User className="w-4 h-4 text-gray-400" />
                                        <div>
                                          <p className="font-medium text-gray-700">
                                            {branchNode.name}
                                          </p>
                                          <p className="text-gray-500">{branchNode.approver}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 连接线 */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-gray-300"></div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                      结束
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">审批完成</p>
                      <p className="text-xs text-gray-500">申请处理完毕</p>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    添加节点
                  </button>
                  <button className="flex-1 px-4 py-2 bg-[#4A7BF7] text-white rounded-lg hover:bg-[#3d6ad6] transition-colors">
                    保存更改
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <GitBranch className="w-16 h-16 mx-auto mb-4" />
                <p>请选择一个审批流程查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 新建流程对话框 */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新建审批流程</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  流程名称
                </label>
                <input
                  type="text"
                  placeholder="请输入流程名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  流程描述
                </label>
                <textarea
                  placeholder="请输入流程描述"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  适用类型
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent">
                  <option>资源创建</option>
                  <option>数据导出</option>
                  <option>数据表权限</option>
                  <option>模型部署</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button className="flex-1 px-4 py-2 bg-[#4A7BF7] text-white rounded-lg hover:bg-[#3d6ad6] transition-colors">
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
