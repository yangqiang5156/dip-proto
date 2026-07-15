import React, { useState } from 'react';
import { PageHeader } from '../components/enterprise';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  DownloadRequestModal,
  type DownloadContext,
  type ApprovalChainNode,
  type ModalState,
} from '../components/enterprise/DownloadRequestModal';

export default function DownloadRequestModalDemo() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mockContext: DownloadContext = {
    entryName: '销售分析报表下载',
    entryId: 'report.sales.monthly.export',
    module: '数据分析报表',
    pageName: '销售分析报表',
    buttonName: '导出Excel',
    dataType: 'Excel文件',
    riskLevel: 'medium',
    exportConditions: '时间=2026年03月, 区域=华东, 指标=GMV, 订单数, 客单价',
  };

  const normalApprovalChain: ApprovalChainNode[] = [
    { name: '直属领导', resolved: true },
    { name: '功能负责人', resolved: true },
    { name: '安全部门', resolved: true },
  ];

  const errorApprovalChain: ApprovalChainNode[] = [
    { name: '直属领导', resolved: false, error: '未找到' },
    { name: '功能负责人', resolved: true },
    { name: '安全部门', resolved: true },
  ];

  const handleSubmit = (data: any) => {
    console.log('Submitted data:', data);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setOpenModal(null);
      alert('申请提交成功\n您的下载申请已提交，可前往我的申请查看进度');
    }, 2000);
  };

  const modalVariants = [
    {
      id: 'normal',
      title: '正常状态',
      description: '所有审批节点正常解析，可以正常提交',
      state: 'normal' as ModalState,
      chain: normalApprovalChain,
    },
    {
      id: 'validation',
      title: '表单验证',
      description: '未填写必填项时显示验证错误',
      state: 'normal' as ModalState,
      chain: normalApprovalChain,
    },
    {
      id: 'no-config',
      title: '未配置审批流程',
      description: '当前入口未完成审批配置',
      state: 'no-config' as ModalState,
      chain: [],
    },
    {
      id: 'resolve-error',
      title: '审批人识别失败',
      description: '审批人无法正确解析，例如直属领导无法找到',
      state: 'resolve-error' as ModalState,
      chain: errorApprovalChain,
    },
    {
      id: 'submitting',
      title: '提交中',
      description: '点击提交后的加载状态',
      state: submitting ? 'submitting' : ('normal' as ModalState),
      chain: normalApprovalChain,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="下载申请弹窗"
        description="展示下载申请弹窗的不同状态和交互流程"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
          {modalVariants.map((variant) => (
            <Card key={variant.id} className="p-5">
              <h3 className="text-base font-semibold text-text-primary mb-2">
                {variant.title}
              </h3>
              <p className="text-sm text-text-secondary mb-4">{variant.description}</p>
              <Button onClick={() => setOpenModal(variant.id)} size="sm">
                打开弹窗
              </Button>

              <DownloadRequestModal
                open={openModal === variant.id}
                onClose={() => setOpenModal(null)}
                context={mockContext}
                approvalChain={variant.chain}
                state={variant.state}
                onSubmit={handleSubmit}
              />
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-5 max-w-5xl">
          <h3 className="text-base font-semibold text-text-primary mb-2">使用说明</h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>
              <strong className="text-text-primary">正常流程：</strong>
              用户填写下载用途、使用场景等必填信息，系统显示审批流程预览，点击提交后进入审批流程
            </p>
            <p>
              <strong className="text-text-primary">错误处理：</strong>
              当审批配置缺失或审批人识别失败时，提交按钮会被禁用，并显示相应的错误提示
            </p>
            <p>
              <strong className="text-text-primary">表单验证：</strong>
              必填项未填写时会显示红色边框和错误提示，引导用户正确填写
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
