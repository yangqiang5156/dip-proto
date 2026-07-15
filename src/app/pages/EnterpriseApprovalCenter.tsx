import React, { useState } from 'react';
import { PageHeader, FilterBar, FilterItem, EmptyState } from '../components/enterprise';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { StatusBadge, RiskLevelBadge } from '../components/download-center';
import { Plus, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

interface Application {
  id: string;
  requestId: string;
  entryName: string;
  module: string;
  applicant: string;
  applyTime: string;
  status: any;
  riskLevel: 'low' | 'medium' | 'high';
  currentApprover?: string;
}

export default function EnterpriseApprovalCenter() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<string>('');

  const applications: Application[] = [
    {
      id: '1',
      requestId: 'REQ20260429001',
      entryName: '用户数据导出',
      module: '用户管理',
      applicant: '张三',
      applyTime: '2026-04-29 10:30',
      status: '审批中',
      riskLevel: 'medium',
      currentApprover: '李四',
    },
    {
      id: '2',
      requestId: 'REQ20260429002',
      entryName: '订单明细导出',
      module: '订单中心',
      applicant: '王五',
      applyTime: '2026-04-29 09:15',
      status: '审批通过',
      riskLevel: 'low',
    },
    {
      id: '3',
      requestId: 'REQ20260428003',
      entryName: '财务报表导出',
      module: '财务管理',
      applicant: '赵六',
      applyTime: '2026-04-28 16:45',
      status: '已驳回',
      riskLevel: 'high',
    },
    {
      id: '4',
      requestId: 'REQ20260428004',
      entryName: '客户信息导出',
      module: '客户管理',
      applicant: '钱七',
      applyTime: '2026-04-28 14:20',
      status: '待下载',
      riskLevel: 'medium',
    },
  ];

  const handleSearch = () => {
    console.log('Search:', { keyword, status, riskLevel });
  };

  const handleReset = () => {
    setKeyword('');
    setStatus('');
    setRiskLevel('');
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="我的申请"
        description="查看和管理您提交的所有下载申请"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" />
            新建申请
          </Button>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="关键词">
            <Input
              placeholder="申请单号/入口名称/模块"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="审批状态">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">审批中</SelectItem>
                <SelectItem value="approved">审批通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="风险等级">
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger>
                <SelectValue placeholder="全部等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部等级</SelectItem>
                <SelectItem value="low">低风险</SelectItem>
                <SelectItem value="medium">中风险</SelectItem>
                <SelectItem value="high">高风险</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <div></div>
        </FilterBar>

        <div className="bg-white rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">申请单号</TableHead>
                <TableHead className="font-semibold">入口名称</TableHead>
                <TableHead className="font-semibold">所属模块</TableHead>
                <TableHead className="font-semibold">申请人</TableHead>
                <TableHead className="font-semibold">申请时间</TableHead>
                <TableHead className="font-semibold">风险等级</TableHead>
                <TableHead className="font-semibold">审批状态</TableHead>
                <TableHead className="font-semibold">当前审批人</TableHead>
                <TableHead className="font-semibold text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-primary">{app.requestId}</TableCell>
                  <TableCell>{app.entryName}</TableCell>
                  <TableCell className="text-text-secondary">{app.module}</TableCell>
                  <TableCell>{app.applicant}</TableCell>
                  <TableCell className="text-text-secondary">{app.applyTime}</TableCell>
                  <TableCell>
                    <RiskLevelBadge level={app.riskLevel} size="sm" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {app.currentApprover || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>催办</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">撤销申请</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination placeholder */}
        <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
          <span>共 4 条记录</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <span className="px-3 py-1">1 / 1</span>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
