import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FilterBar, FilterItem, EmptyState } from '../components/enterprise';
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
import { Eye, Loader2, RotateCw, XCircle } from 'lucide-react';

type ApprovalResult = '审批通过' | '已驳回';

interface ApprovedRecord {
  id: string;
  requestId: string;
  applicant: string;
  department: string;
  module: string;
  entryName: string;
  result: ApprovalResult;
  approvalTime: string;
  opinion: string;
}

type PageState = 'loading' | 'error' | 'empty' | 'data';

export default function ApprovedByMe() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [result, setResult] = useState('');
  const [applicant, setApplicant] = useState('');
  const [entryName, setEntryName] = useState('');
  const [timeRange, setTimeRange] = useState('');

  // Mock data - in real app this would come from API
  const records: ApprovedRecord[] = [
    {
      id: '5',
      requestId: 'DL202604280056',
      applicant: '陈华',
      department: '人力资源部',
      module: '人力资源',
      entryName: '员工绩效数据',
      result: '审批通过',
      approvalTime: '2026-04-28 11:40:22',
      opinion: '批准',
    },
    {
      id: '6',
      requestId: 'DL202604270143',
      applicant: '周杰',
      department: '技术部',
      module: '系统管理',
      entryName: '系统日志导出',
      result: '审批通过',
      approvalTime: '2026-04-27 16:15:30',
      opinion: '已确认数据用途，符合安全规范，批准',
    },
    {
      id: '7',
      requestId: 'DL202604270089',
      applicant: '吴明',
      department: '市场部',
      module: '营销管理',
      entryName: '客户触达记录',
      result: '已驳回',
      approvalTime: '2026-04-27 10:25:15',
      opinion: '导出范围过大，请缩小时间范围后重新申请',
    },
    {
      id: '8',
      requestId: 'DL202604260123',
      applicant: '郑丽',
      department: '财务部',
      module: '财务管理',
      entryName: '费用报销明细',
      result: '审批通过',
      approvalTime: '2026-04-26 14:50:40',
      opinion: '数据范围合理，业务需求真实，同意导出',
    },
    {
      id: '9',
      requestId: 'DL202604260088',
      applicant: '钱伟',
      department: '采购部',
      module: '采购管理',
      entryName: '供应商信息表',
      result: '已驳回',
      approvalTime: '2026-04-26 09:30:18',
      opinion: '缺少部门负责人签字，请补充完整审批材料',
    },
    {
      id: '10',
      requestId: 'DL202604250147',
      applicant: '孙美',
      department: '客服部',
      module: '客户管理',
      entryName: '客户投诉记录',
      result: '审批通过',
      approvalTime: '2026-04-25 15:20:35',
      opinion: '用途明确，仅用于内部经营复盘，可通过',
    },
    {
      id: '11',
      requestId: 'DL202604250102',
      applicant: '黄强',
      department: '运营部',
      module: '商品管理',
      entryName: '商品销售数据',
      result: '审批通过',
      approvalTime: '2026-04-25 11:10:20',
      opinion: '同意',
    },
    {
      id: '12',
      requestId: 'DL202604240078',
      applicant: '林芳',
      department: '产品部',
      module: '数据分析',
      entryName: '用户留存分析',
      result: '已驳回',
      approvalTime: '2026-04-24 16:45:10',
      opinion: '申请理由不够充分，请详细说明数据用途',
    },
  ];

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleReset = () => {
    setResult('');
    setApplicant('');
    setEntryName('');
    setTimeRange('');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleViewDetail = (id: string) => {
    navigate(`/approval/${id}`);
  };

  const getResultBadge = (result: ApprovalResult) => {
    const config = {
      审批通过: {
        className: 'bg-success-light text-success border border-success/20',
        dotColor: 'bg-success',
      },
      已驳回: {
        className: 'bg-destructive-light text-destructive border border-destructive/20',
        dotColor: 'bg-destructive',
      },
    };

    const item = config[result];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${item.className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`}></span>
        {result}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        {/* Filter Bar */}
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="审批结果">
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger>
                <SelectValue placeholder="全部结果" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部结果</SelectItem>
                <SelectItem value="approved">审批通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="申请人">
            <Input
              placeholder="请输入申请人"
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="入口名称">
            <Input
              placeholder="请输入入口名称"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="时间范围">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="全部时间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部时间</SelectItem>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterBar>

        {/* Loading State */}
        {pageState === 'loading' && (
          <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-text-secondary">加载中...</p>
          </div>
        )}

        {/* Error State */}
        {pageState === 'error' && (
          <div className="bg-white rounded-lg border border-border p-20 flex flex-col items-center justify-center">
            <XCircle className="w-12 h-12 text-destructive mb-3" />
            <h3 className="text-base font-medium text-text-primary mb-2">加载失败</h3>
            <p className="text-sm text-text-secondary mb-4">数据加载失败，请重试</p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RotateCw className="w-4 h-4 mr-1.5" />
              重新加载
            </Button>
          </div>
        )}

        {/* Empty State */}
        {pageState === 'empty' && (
          <div className="bg-white rounded-lg border border-border">
            <EmptyState
              type="no-data"
              title="暂无已审批记录"
              description="您还没有处理过任何审批申请"
            />
          </div>
        )}

        {/* Data Table */}
        {pageState === 'data' && (
          <>
            <div className="bg-white rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">申请人</TableHead>
                    <TableHead className="font-semibold">所属部门</TableHead>
                    <TableHead className="font-semibold">模块</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">审批结果</TableHead>
                    <TableHead className="font-semibold">审批时间</TableHead>
                    <TableHead className="font-semibold text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium font-mono text-xs text-primary">
                        {record.requestId}
                      </TableCell>
                      <TableCell className="font-medium">{record.applicant}</TableCell>
                      <TableCell className="text-text-secondary">
                        {record.department}
                      </TableCell>
                      <TableCell className="text-text-secondary">{record.module}</TableCell>
                      <TableCell className="font-medium">{record.entryName}</TableCell>
                      <TableCell>
                        {getResultBadge(record.result)}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {record.approvalTime}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(record.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                共 {records.length} 条已审批记录
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  上一页
                </Button>
                <span className="px-3 py-1 text-sm text-text-secondary">1 / 1</span>
                <Button variant="outline" size="sm" disabled>
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
