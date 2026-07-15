import React, { useState } from 'react';
import { PageHeader } from '../components/enterprise';
import { Button } from '../components/ui/button';
import { NotificationDrawer } from '../components/download-center/NotificationDrawer';
import { Card } from '../components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationDrawerDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="消息通知抽屉演示"
        description="测试和演示消息通知中心功能"
        breadcrumbs={[
          { label: '下载中心' },
          { label: '消息通知演示' },
        ]}
      />

      <div className="flex-1 p-6">
        <Card className="p-8 max-w-2xl">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">消息通知中心</h2>
              <p className="text-sm text-text-secondary mb-4">
                点击下方按钮打开消息通知抽屉，查看不同类型的通知消息
              </p>
              <p className="text-sm text-text-secondary">
                注意：在实际使用中，可以通过点击顶部导航栏右上角的铃铛图标打开通知抽屉
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">通知类型包括：</h3>
              <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                <li>待审批提醒（审批人）</li>
                <li>申请进度通知（申请人）</li>
                <li>文件生成完成（申请人）</li>
                <li>文件即将过期（申请人）</li>
                <li>文件生成失败（申请人、管理员）</li>
              </ul>
            </div>

            <Button onClick={() => setDrawerOpen(true)}>
              <Bell className="w-4 h-4 mr-2" />
              打开消息通知
            </Button>
          </div>
        </Card>
      </div>

      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
