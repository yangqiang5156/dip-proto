import React, { useState } from 'react';
import { PageHeader } from '../components/enterprise';
import { Button } from '../components/ui/button';
import { ApprovalChainConfigModal } from '../components/download-center/ApprovalChainConfigModal';
import { Card } from '../components/ui/card';
import { Settings } from 'lucide-react';

export default function ApprovalChainConfigDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (nodes: any[]) => {
    console.log('Saved approval chain:', nodes);
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="审批链配置演示"
        description="测试和演示审批链配置功能"
        breadcrumbs={[
          { label: '下载中心' },
          { label: '审批链配置演示' },
        ]}
      />

      <div className="flex-1 p-6">
        <Card className="p-8 max-w-2xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">审批链配置</h2>
              <p className="text-sm text-text-secondary">
                点击下方按钮打开审批链配置模态框，测试串行审批流程配置功能
              </p>
            </div>

            <Button onClick={() => setModalOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              打开审批链配置
            </Button>
          </div>
        </Card>
      </div>

      <ApprovalChainConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialNodes={[
          {
            id: 'node-1',
            order: 1,
            sourceType: 'direct-manager',
            resolverStatus: 'valid',
          },
          {
            id: 'node-2',
            order: 2,
            sourceType: 'by-role',
            selectedValue: '部门负责人',
            resolverStatus: 'valid',
          },
          {
            id: 'node-3',
            order: 3,
            sourceType: 'security-group',
            selectedValue: '安全审批组',
            resolverStatus: 'error',
            resolverMessage: '未找到指定的安全组',
          },
        ]}
      />
    </div>
  );
}
