import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { DownloadRequestModal, DownloadContext } from '../components/enterprise/DownloadRequestModal';
import { Download } from 'lucide-react';

interface SalesData {
  id: string;
  orderId: string;
  customerName: string;
  product: string;
  amount: number;
  orderDate: string;
  status: string;
}

export default function DownloadDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  const salesData: SalesData[] = [
    {
      id: '1',
      orderId: 'ORD20260429001',
      customerName: '北京科技有限公司',
      product: '企业版软件授权',
      amount: 98000,
      orderDate: '2026-04-29',
      status: '已完成',
    },
    {
      id: '2',
      orderId: 'ORD20260429002',
      customerName: '上海贸易公司',
      product: '数据分析服务',
      amount: 65000,
      orderDate: '2026-04-29',
      status: '已完成',
    },
    {
      id: '3',
      orderId: 'ORD20260428003',
      customerName: '广州制造企业',
      product: '云服务年费',
      amount: 120000,
      orderDate: '2026-04-28',
      status: '已完成',
    },
    {
      id: '4',
      orderId: 'ORD20260428004',
      customerName: '深圳创新公司',
      product: '定制开发服务',
      amount: 350000,
      orderDate: '2026-04-28',
      status: '进行中',
    },
    {
      id: '5',
      orderId: 'ORD20260427005',
      customerName: '杭州互联网公司',
      product: '技术咨询服务',
      amount: 45000,
      orderDate: '2026-04-27',
      status: '已完成',
    },
    {
      id: '6',
      orderId: 'ORD20260427006',
      customerName: '成都电商平台',
      product: '系统集成方案',
      amount: 280000,
      orderDate: '2026-04-27',
      status: '已完成',
    },
    {
      id: '7',
      orderId: 'ORD20260426007',
      customerName: '南京软件公司',
      product: '培训服务',
      amount: 25000,
      orderDate: '2026-04-26',
      status: '已完成',
    },
    {
      id: '8',
      orderId: 'ORD20260426008',
      customerName: '武汉科研机构',
      product: '数据存储服务',
      amount: 88000,
      orderDate: '2026-04-26',
      status: '已完成',
    },
  ];

  const downloadContext: DownloadContext = {
    entryName: '销售数据导出',
    entryId: 'ENTRY_SALES_001',
    module: '销售管理',
    pageName: '销售报表',
    buttonName: '导出数据',
    dataType: '销售订单数据',
    exportConditions: `导出范围: 2026年4月26日 - 2026年4月29日，共 ${salesData.length} 条订单记录，包含客户名称、订单金额等敏感信息`,
    classificationLevel: 'S3',
    hasPersonalInfoOrCrossBorder: true,
  };

  const handleDownloadClick = () => {
    setModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log('提交下载申请:', data);
    setModalOpen(false);
    alert('下载申请已提交，审批通过后可在"我的申请"页面查看和下载文件');
  };

  const totalAmount = salesData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-text-primary">下载Demo</h1>
          <p className="mt-1 text-sm text-text-secondary">演示从业务页面发起数据下载申请</p>
        </div>

        <div className="bg-white rounded-lg border border-border">
          {/* Table Header with Download Button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-text-primary">销售订单列表</h2>
              <p className="text-sm text-text-secondary mt-1">
                共 {salesData.length} 条记录，总金额 ¥{totalAmount.toLocaleString()}
              </p>
            </div>
            <Button onClick={handleDownloadClick}>
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </Button>
          </div>

          {/* Data Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">订单编号</TableHead>
                <TableHead className="font-semibold">客户名称</TableHead>
                <TableHead className="font-semibold">产品/服务</TableHead>
                <TableHead className="font-semibold text-right">订单金额</TableHead>
                <TableHead className="font-semibold">订单日期</TableHead>
                <TableHead className="font-semibold">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-xs text-primary">
                    {item.orderId}
                  </TableCell>
                  <TableCell className="font-medium">{item.customerName}</TableCell>
                  <TableCell className="text-text-secondary">{item.product}</TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{item.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-text-secondary">{item.orderDate}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.status === '已完成'
                          ? 'bg-success-light text-success border border-success/20'
                          : 'bg-info-light text-info border border-info/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Table Footer */}
          <div className="p-4 border-t border-border bg-muted/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                统计周期: 2026年4月26日 - 2026年4月29日
              </span>
              <span className="font-semibold text-text-primary">
                合计金额: ¥{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DownloadRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        context={downloadContext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
