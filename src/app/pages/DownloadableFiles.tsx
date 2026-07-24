import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
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
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  FileX,
  Loader2,
  RotateCw,
  AlertCircle,
} from 'lucide-react';

type FileStatus = '文件生成中' | '待下载' | '已下载' | '已过期' | '生成失败';

interface DownloadableFile {
  id: string;
  fileName: string;
  fileSize: string;
  generatedTime: string;
  requestId: string;
  entryName: string;
  module: string;
  status: FileStatus;
  downloadUrl?: string;
  errorMessage?: string;
}

type PageState = 'loading' | 'error' | 'empty' | 'data';

export default function DownloadableFiles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageState, setPageState] = useState<PageState>('data');
  const [requestId, setRequestId] = useState(searchParams.get('requestId') || '');
  const [fileStatus, setFileStatus] = useState('all');
  const [entryName, setEntryName] = useState('');

  // Mock data
  const files: DownloadableFile[] = [
    {
      id: '1',
      fileName: '用户行为分析_Q1.xlsx',
      fileSize: '生成中',
      generatedTime: '2026-04-29 09:22:10',
      requestId: 'DL20260429002',
      entryName: '用户行为数据导出',
      module: '用户管理',
      status: '文件生成中',
    },
    {
      id: '2',
      fileName: '订单明细_202604.xlsx',
      fileSize: '1.8 MB',
      generatedTime: '2026-04-28 16:48:20',
      requestId: 'DL20260428003',
      entryName: '订单明细导出',
      module: '订单中心',
      status: '待下载',
      downloadUrl: '/downloads/order_details_202604.xlsx',
    },
    {
      id: '3',
      fileName: '数据资产明细_华东区域.xlsx',
      fileSize: '5.7 MB',
      generatedTime: '2026-04-28 14:15:22',
      requestId: 'DL20260427005',
      entryName: '客户信息导出',
      module: '客户管理',
      status: '已下载',
      downloadUrl: '/downloads/customer_data_east.xlsx',
    },
    {
      id: '4',
      fileName: '物流数据导出_202604.xlsx',
      fileSize: '0 KB',
      generatedTime: '2026-04-25 10:02:45',
      requestId: 'DL20260425007',
      entryName: '物流数据导出',
      module: '物流管理',
      status: '生成失败',
      errorMessage: '数据源连接超时，文件生成失败',
    },
    {
      id: '5',
      fileName: '日志排查明细_20260427.xlsx',
      fileSize: '856 KB',
      generatedTime: '2026-04-28 16:20:30',
      requestId: 'DL20260428098',
      entryName: '系统日志导出',
      module: '系统管理',
      status: '待下载',
      downloadUrl: '/downloads/logs_20260427.xlsx',
    },
  ];

  useEffect(() => {
    setRequestId(searchParams.get('requestId') || '');
    setPageState('data');
  }, [searchParams]);

  const filteredFiles = useMemo(() => files.filter((file) => (
    (fileStatus === 'all' || file.status === fileStatus)
    && file.requestId.toLowerCase().includes(requestId.trim().toLowerCase())
    && file.entryName.toLowerCase().includes(entryName.trim().toLowerCase())
  )), [entryName, fileStatus, requestId]);

  const handleSearch = () => {
    setPageState('loading');
    setSearchParams(requestId.trim() ? { requestId: requestId.trim() } : {});
    setTimeout(() => {
      setPageState('data');
    }, 500);
  };

  const handleReset = () => {
    setRequestId('');
    setFileStatus('all');
    setEntryName('');
    setSearchParams({});
    setPageState('data');
  };

  const handleRetry = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleDownload = (file: DownloadableFile) => {
    console.log('Downloading file:', file.fileName);
    // In a real app, this would trigger the actual download and log the action
  };

  const getStatusConfig = (status: FileStatus) => {
    const config = {
      文件生成中: {
        icon: <Loader2 className="h-4 w-4 text-info animate-spin" />,
        className: 'bg-info-light text-info border-info/20',
        label: '生成中',
      },
      待下载: {
        icon: <Download className="h-4 w-4 text-primary" />,
        className: 'bg-primary-light text-primary border-primary/20',
        label: '待下载',
      },
      已下载: {
        icon: <CheckCircle2 className="h-4 w-4 text-success" />,
        className: 'bg-success-light text-success border-success/20',
        label: '已下载',
      },
      已过期: {
        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
        className: 'bg-muted text-text-secondary border-border',
        label: '已过期',
      },
      生成失败: {
        icon: <FileX className="h-4 w-4 text-destructive" />,
        className: 'bg-destructive-light text-destructive border-destructive/20',
        label: '失败',
      },
    };
    return config[status];
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="可下载文件"
        description="查看和下载已审批通过的导出文件"
        breadcrumbs={[
          { label: '下载中心' },
          { label: '可下载文件' },
        ]}
      />

      <div className="flex-1 p-6 overflow-auto">
        {/* Download Logging Notice */}
        <Alert className="mb-6 border-warning/50 bg-warning-light/30">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-sm font-medium text-warning">
            下载行为将被记录，请确保数据使用符合公司规范
          </AlertDescription>
        </Alert>

        {searchParams.get('requestId') && (
          <Alert className="mb-6 border-primary/30 bg-primary-light/40">
            <Download className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-primary">
              已从“我的申请”定位申请单 {searchParams.get('requestId')} 对应的交付文件
            </AlertDescription>
          </Alert>
        )}

        {/* Filter Bar */}
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="申请单号">
            <Input
              placeholder="请输入申请单号"
              value={requestId}
              onChange={(event) => setRequestId(event.target.value)}
            />
          </FilterItem>
          <FilterItem label="文件状态">
            <Select value={fileStatus} onValueChange={setFileStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="文件生成中">文件生成中</SelectItem>
                <SelectItem value="待下载">待下载</SelectItem>
                <SelectItem value="已下载">已下载</SelectItem>
                <SelectItem value="已过期">已过期</SelectItem>
                <SelectItem value="生成失败">生成失败</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="入口名称">
            <Input
              placeholder="请输入入口名称"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="生成时间">
            <Input type="date" placeholder="选择日期" />
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
        {(pageState === 'empty' || (pageState === 'data' && filteredFiles.length === 0)) && (
          <div className="bg-white rounded-lg border border-border">
            <EmptyState
              type="no-data"
              title="暂无可下载文件"
              description={requestId ? `未找到申请单 ${requestId} 对应的交付文件` : '当前没有符合筛选条件的导出文件'}
            />
          </div>
        )}

        {/* File Table */}
        {pageState === 'data' && filteredFiles.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-lg border bg-white">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">文件名称</TableHead>
                    <TableHead className="font-semibold">申请单号</TableHead>
                    <TableHead className="font-semibold">入口名称</TableHead>
                    <TableHead className="font-semibold">所属模块</TableHead>
                    <TableHead className="font-semibold">文件大小</TableHead>
                    <TableHead className="font-semibold">生成时间</TableHead>
                    <TableHead className="font-semibold">文件状态</TableHead>
                    <TableHead className="text-right font-semibold">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => {
                    const statusConfig = getStatusConfig(file.status);
                    return (
                      <TableRow key={file.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{file.fileName}</TableCell>
                        <TableCell className="font-mono text-xs font-medium text-primary">{file.requestId}</TableCell>
                        <TableCell>{file.entryName}</TableCell>
                        <TableCell className="text-text-secondary">{file.module}</TableCell>
                        <TableCell className="text-text-secondary">{file.fileSize}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-text-secondary">{file.generatedTime}</TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${statusConfig.className}`}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                            {file.status === '文件生成中' && (
                              <p className="text-xs text-info">预计需要 3-5 分钟</p>
                            )}
                            {file.status === '生成失败' && (
                              <p className="max-w-48 text-xs text-destructive">{file.errorMessage}</p>
                            )}
                            {file.status === '已下载' && (
                              <p className="max-w-48 text-xs text-success">7 天有效期内可重复下载</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {file.status === '待下载' && (
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary" onClick={() => handleDownload(file)}>
                              <Download className="mr-1 h-4 w-4" />下载
                            </Button>
                          )}
                          {file.status === '已下载' && (
                            <Button variant="ghost" size="sm" className="text-success hover:bg-success/10 hover:text-success" onClick={() => handleDownload(file)}>
                              <Download className="mr-1 h-4 w-4" />再次下载
                            </Button>
                          )}
                          {file.status === '文件生成中' && <span className="text-xs text-text-tertiary">生成完成后可下载</span>}
                          {file.status === '生成失败' && <span className="text-xs text-destructive">暂不可下载</span>}
                          {file.status === '已过期' && <span className="text-xs text-text-tertiary">已过期</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                共 {filteredFiles.length} 个文件
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
