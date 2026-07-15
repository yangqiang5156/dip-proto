import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Upload } from "lucide-react";

export default function NewApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "resource-create",
    name: "",
    description: "",
    workflow: "default",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 提交申请逻辑
    navigate("/");
  };

  return (
    <div className="p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回审批中心
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">新建申请</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 申请类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                申请类型 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                required
              >
                <option value="resource-create">资源创建</option>
                <option value="data-export">数据导出</option>
                <option value="data-access">数据表权限</option>
                <option value="model-deploy">模型部署</option>
              </select>
            </div>

            {/* 申请名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                申请名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入申请名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                required
              />
            </div>

            {/* 申请说明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                申请说明 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请详细描述申请内容、用途和需求..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent resize-none"
                required
              />
            </div>

            {/* 审批流程 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                审批流程 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.workflow}
                onChange={(e) => setFormData({ ...formData, workflow: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                required
              >
                <option value="default">默认审批流程</option>
                <option value="fast">快速审批流程</option>
                <option value="strict">严格审批流程</option>
                <option value="data-security">数据安全审批流程</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                系统将根据申请类型自动匹配相应的审批流程
              </p>
            </div>

            {/* 附件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                附件
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4A7BF7] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">点击上传或拖拽文件到这里</p>
                <p className="text-xs text-gray-400">支持 PDF、Word、Excel、图片等格式，单个文件不超过 50MB</p>
              </div>
            </div>

            {/* 额外信息 - 数据导出特有字段 */}
            {formData.type === "data-export" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数据源 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="请输入数据库名称或数据集名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    导出格式 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" value="csv" defaultChecked className="text-[#4A7BF7]" />
                      <span className="text-sm">CSV</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" value="excel" className="text-[#4A7BF7]" />
                      <span className="text-sm">Excel</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="format" value="json" className="text-[#4A7BF7]" />
                      <span className="text-sm">JSON</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    预计数据量
                  </label>
                  <input
                    type="text"
                    placeholder="如：约 10000 条记录，100MB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* 数据表权限特有字段 */}
            {formData.type === "data-access" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数据表名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="请输入数据表名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7BF7] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    权限类型 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="text-[#4A7BF7]" />
                      <span className="text-sm">读取</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="text-[#4A7BF7]" />
                      <span className="text-sm">写入</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="text-[#4A7BF7]" />
                      <span className="text-sm">修改</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="text-[#4A7BF7]" />
                      <span className="text-sm">删除</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#4A7BF7] text-white rounded-lg hover:bg-[#3d6ad6] transition-colors"
              >
                提交申请
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
