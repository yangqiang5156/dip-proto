import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, Loader2, RotateCw, ShieldAlert, XCircle } from 'lucide-react';
import { FilterBar, FilterItem, EmptyState } from '../components/enterprise';
import { RequestTypeBadge, RequestType } from '../components/approval-center';
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
import { StatusBadge, ApprovalStatus } from '../components/download-center/StatusBadge';
type PageState = 'loading' | 'error' | 'empty' | 'data' | 'permission-denied';

interface AdminRecord {
  id: string;
  requestId: string;
  requestType: RequestType;
  classificationLevel?: string;
  applicant: string;
  department: string;
  module: string;
  requestName: string;
  approvalStatus: ApprovalStatus;
  businessStatus: string;
  lastOperationTime: string;
  operator: string;
}

const records: AdminRecord[] = [
  {
    id: '1', requestId: 'DL202604290031', requestType: '数据下载', classificationLevel: 'S3', applicant: '李明', department: '产品部',
    module: '数据分析', requestName: '用户行为分析', approvalStatus: '审批中',
    businessStatus: '未生成', lastOperationTime: '2026-04-29 14:35:10', operator: '李晨（L3数据管家）',
  },
  {
    id: 'table-approval-1', requestId: 'TB202604290030', requestType: '数据表权限', applicant: '王芳', department: '财务部',
    module: '数据仓库', requestName: 'ads_finance_summary 财务汇总表', approvalStatus: '审批中',
    businessStatus: '待生效', lastOperationTime: '2026-04-29 13:20:16', operator: '周强（数据Owner）',
  },
  {
    id: '2', requestId: 'DL202604290028', requestType: '数据下载', classificationLevel: 'S4', applicant: '王芳', department: '财务部',
    module: '财务管理', requestName: '销售数据导出', approvalStatus: '已驳回',
    businessStatus: '未生成', lastOperationTime: '2026-04-29 11:05:40', operator: '王芳（小微主）',
  },
  {
    id: 'table-request-2', requestId: 'TB202604280156', requestType: '数据表权限', applicant: '张敏', department: '市场部',
    module: '客户数据平台', requestName: 'customer_profile 客户画像表', approvalStatus: '审批通过',
    businessStatus: '已生效', lastOperationTime: '2026-04-28 17:45:33', operator: '系统',
  },
  {
    id: '3', requestId: 'DL202604280155', requestType: '数据下载', classificationLevel: 'S3', applicant: '张敏', department: '市场部',
    module: '客户管理', requestName: '客户信息表', approvalStatus: '审批通过',
    businessStatus: '待下载', lastOperationTime: '2026-04-27 17:45:33', operator: '系统',
  },
  {
    id: '4', requestId: 'DL202604260089', requestType: '数据下载', classificationLevel: 'S2', applicant: '刘强', department: '运营部',
    module: '订单管理', requestName: '订单明细', approvalStatus: '审批通过',
    businessStatus: '已下载', lastOperationTime: '2026-04-26 18:30:12', operator: '李明（申请人）',
  },
  {
    id: 'table-approval-3', requestId: 'TB202604250147', requestType: '数据表权限', applicant: '陈华', department: '人力资源部',
    module: '人力数据集市', requestName: 'dwd_employee_performance 员工绩效表', approvalStatus: '已驳回',
    businessStatus: '待生效', lastOperationTime: '2026-04-25 12:05:15', operator: '安全审计组',
  },
  {
    id: '6', requestId: 'DL202604240123', requestType: '数据下载', classificationLevel: 'S2', applicant: '周杰', department: '技术部',
    module: '系统管理', requestName: '系统日志导出', approvalStatus: '审批通过',
    businessStatus: '生成失败', lastOperationTime: '2026-04-24 16:45:30', operator: '系统',
  },
  {
    id: 'table-approval-2', requestId: 'TB202604230078', requestType: '数据表权限', applicant: '吴明', department: '市场部',
    module: '营销数据集市', requestName: 'ads_campaign_result 活动效果表', approvalStatus: '审批通过',
    businessStatus: '已回收', lastOperationTime: '2026-04-23 10:25:15', operator: '系统',
  },
  {
    id: '8', requestId: 'DL202604220134', requestType: '数据下载', classificationLevel: 'S4', applicant: '郑丽', department: '财务部',
    module: '财务管理', requestName: '费用报销明细', approvalStatus: '审批通过',
    businessStatus: '生成中', lastOperationTime: '2026-04-22 14:50:40', operator: '系统',
  },
];

const businessStatusStyles: Record<string, string> = {
  未生成: 'bg-muted text-text-secondary border-border',
  生成中: 'bg-info-light text-info border-info/20',
  待下载: 'bg-primary-light text-primary border-primary/20',
  已下载: 'bg-success-light text-success border-success/20',
  生成失败: 'bg-destructive-light text-destructive border-destructive/20',
  待生效: 'bg-warning-light text-warning border-warning/20',
  已生效: 'bg-success-light text-success border-success/20',
  已回收: 'bg-muted text-text-secondary border-border',
};

export default function AllRecords() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('data');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestType, setRequestType] = useState('all');
  const [status, setStatus] = useState('all');
  const [businessStatus, setBusinessStatus] = useState('all');

  const filteredRecords = useMemo(() => records.filter((record) => {
    const keyword = searchTerm.trim().toLowerCase();
    return (requestType === 'all' || record.requestType === requestType)
      && (status === 'all' || record.approvalStatus === status)
      && (businessStatus === 'all' || record.businessStatus === businessStatus)
      && (!keyword || record.requestId.toLowerCase().includes(keyword) || record.applicant.toLowerCase().includes(keyword));
  }), [businessStatus, requestType, searchTerm, status]);

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => setPageState(filteredRecords.length === 0 ? 'empty' : 'data'), 500);
  };

  const handleReset = () => {
    setSearchTerm('');
    setRequestType('all');
    setStatus('all');
    setBusinessStatus('all');
    setPageState('data');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-text-primary">全部记录</h1>
          <p className="mt-1 text-sm text-text-secondary">跨申请类型查看平台全部审批记录</p>
        </div>

        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号/申请人">
            <Input placeholder="输入申请单号或申请人" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </FilterItem>
          <FilterItem label="申请类型">
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="数据下载">数据下载</SelectItem>
                <SelectItem value="数据表权限">数据表权限</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="审批状态">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="审批中">审批中</SelectItem>
                <SelectItem value="审批通过">审批通过</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="业务状态">
            <Select value={businessStatus} onValueChange={setBusinessStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="生成中">生成中</SelectItem>
                <SelectItem value="待下载">待下载</SelectItem>
                <SelectItem value="已下载">已下载</SelectItem>
                <SelectItem value="生成失败">生成失败</SelectItem>
                <SelectItem value="待生效">待生效</SelectItem>
                <SelectItem value="已生效">已生效</SelectItem>
                <SelectItem value="已回收">已回收</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
          <FilterItem label="时间范围">
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部时间</SelectItem>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>
        </FilterBar>

        {pageState === 'loading' && (
          <div className="rounded-lg border bg-white p-20 text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-text-secondary">加载中...</p>
          </div>
        )}
        {pageState === 'error' && (
          <div className="rounded-lg border bg-white p-20 text-center">
            <XCircle className="mx-auto mb-3 h-12 w-12 text-destructive" />
            <p className="mb-4 text-sm text-text-secondary">数据加载失败，请重试</p>
            <Button variant="outline" size="sm" onClick={handleSearch}>
              <RotateCw className="mr-1.5 h-4 w-4" />重新加载
            </Button>
          </div>
        )}
        {pageState === 'permission-denied' && (
          <div className="rounded-lg border bg-white p-20 text-center">
            <ShieldAlert className="mx-auto mb-3 h-12 w-12 text-warning" />
            <p className="text-sm text-text-secondary">您没有访问全部审批记录的权限</p>
          </div>
        )}
        {(pageState === 'empty' || (pageState === 'data' && filteredRecords.length === 0)) && (
          <div className="rounded-lg border bg-white">
            <EmptyState type="no-data" title="暂无匹配记录" description="没有找到符合筛选条件的审批记录" />
          </div>
        )}
        {pageState === 'data' && filteredRecords.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-lg border bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">申请类型</TableHead>
                    <TableHead className="font-semibold">最高字段密级</TableHead>
                    <TableHead className="font-semibold">申请人</TableHead>
                    <TableHead className="font-semibold">部门</TableHead>
                    <TableHead className="font-semibold">所属系统/模块</TableHead>
                    <TableHead className="font-semibold">申请名称</TableHead>
                    <TableHead className="font-semibold">审批状态</TableHead>
                    <TableHead className="font-semibold">业务状态</TableHead>
                    <TableHead className="font-semibold">最近操作时间</TableHead>
                    <TableHead className="font-semibold">操作人</TableHead>
                    <TableHead className="text-right font-semibold">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.requestId} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium text-primary">{record.requestId}</TableCell>
                      <TableCell><RequestTypeBadge type={record.requestType} /></TableCell>
                      <TableCell>
                        {record.classificationLevel
                          ? <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{record.classificationLevel}</span>
                          : <span className="text-text-tertiary">-</span>}
                      </TableCell>
                      <TableCell className="font-medium">{record.applicant}</TableCell>
                      <TableCell className="text-text-secondary">{record.department}</TableCell>
                      <TableCell className="text-text-secondary">{record.module}</TableCell>
                      <TableCell className="font-medium">{record.requestName}</TableCell>
                      <TableCell><StatusBadge status={record.approvalStatus} size="sm" /></TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${businessStatusStyles[record.businessStatus] || businessStatusStyles.未生成}`}>
                          {record.businessStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary">{record.lastOperationTime}</TableCell>
                      <TableCell className="text-sm text-text-secondary">{record.operator}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/approval-center/request/${record.id}`)}>
                          <Eye className="mr-1 h-4 w-4" />查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">共 {filteredRecords.length} 条记录</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>上一页</Button>
                <span className="px-3 py-1 text-sm text-text-secondary">1 / 1</span>
                <Button variant="outline" size="sm" disabled>下一页</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
