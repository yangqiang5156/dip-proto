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
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  FileX,
  Loader2,
  RotateCw,
  AlertCircle,
  HardDrive,
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
  const [pageState, setPageState] = useState<PageState>('data');
  const [fileStatus, setFileStatus] = useState('');
  const [entryName, setEntryName] = useState('');

  // Mock data
  const files: DownloadableFile[] = [
    {
      id: '1',
      fileName: '销售分析报表_202603.xlsx',
      fileSize: '2.3 MB',
      generatedTime: '2026-04-29 10:30:15',
      requestId: 'DL202604290031',
      entryName: '销售数据导出',
      module: '财务管理',
      status: '待下载',
      downloadUrl: '/downloads/sales_202603.xlsx',
    },
    {
      id: '2',
      fileName: '日志排查明细_20260427.xlsx',
      fileSize: '856 KB',
      generatedTime: '2026-04-28 16:20:30',
      requestId: 'DL202604280098',
      entryName: '系统日志导出',
      module: '系统管理',
      status: '待下载',
      downloadUrl: '/downloads/logs_20260427.xlsx',
    },
    {
      id: '3',
      fileName: '数据资产明细_华东区域.xlsx',
      fileSize: '5.7 MB',
      generatedTime: '2026-04-28 14:15:22',
      requestId: 'DL202604280075',
      entryName: '客户信息表',
      module: '客户管理',
      status: '已下载',
    },
    {
      id: '4',
      fileName: '用户行为分析_Q1.xlsx',
      fileSize: '3.2 MB',
      generatedTime: '2026-04-27 11:40:50',
      requestId: 'DL202604270089',
      entryName: '用户行为分析',
      module: '数据分析',
      status: '文件生成中',
    },
    {
      id: '5',
      fileName: '订单明细_202603.xlsx',
      fileSize: '1.8 MB',
      generatedTime: '2026-04-26 09:30:15',
      requestId: 'DL202604260056',
      entryName: '订单明细',
      module: '订单管理',
      status: '已过期',
    },
    {
      id: '6',
      fileName: '财务对账单_202602.xlsx',
      fileSize: '0 KB',
      generatedTime: '2026-04-25 15:20:10',
      requestId: 'DL202604250123',
      entryName: '财务对账单导出',
      module: '财务管理',
      status: '生成失败',
      errorMessage: '数据源连接超时，请重新提交申请',
    },
  ];

  const handleSearch = () => {
    setPageState('loading');
    setTimeout(() => {
      setPageState('data');
    }, 1000);
  };

  const handleReset = () => {
    setFileStatus('');
    setEntryName('');
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

  const renderFileCard = (file: DownloadableFile) => {
    const statusConfig = getStatusConfig(file.status);

    return (
      <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate">{file.fileName}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3.5 w-3.5" />
                  {file.fileSize}
                </span>
                <span>申请单号: {file.requestId}</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border ${statusConfig.className}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">入口名称</p>
              <p className="text-foreground font-medium">{file.entryName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">所属模块</p>
              <p className="text-foreground">{file.module}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">生成时间</p>
              <p className="text-foreground">{file.generatedTime}</p>
            </div>
          </div>

          {/* Status-specific content */}
          {file.status === '待下载' && (
            <>
              <Button className="w-full" onClick={() => handleDownload(file)}>
                <Download className="h-4 w-4 mr-2" />
                下载文件
              </Button>
            </>
          )}

          {file.status === '文件生成中' && (
            <div className="p-4 rounded-md bg-info-light/30 border border-info/20 text-center">
              <p className="text-sm text-info-foreground">
                系统正在生成您的导出文件，预计需要 3-5 分钟
              </p>
            </div>
          )}

          {file.status === '已下载' && (
            <div className="p-4 rounded-md bg-success-light/30 border border-success/20">
              <p className="text-sm text-success-foreground">
                <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
                文件已下载，如需重新下载请联系管理员
              </p>
            </div>
          )}

          {file.status === '已过期' && (
            <div className="p-4 rounded-md bg-muted border border-border">
              <p className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline mr-1.5" />
                文件已过期，如需重新导出请提交新申请
              </p>
            </div>
          )}

          {file.status === '生成失败' && (
            <div className="p-4 rounded-md bg-destructive-light/30 border border-destructive/20">
              <p className="text-sm text-destructive-foreground">
                <XCircle className="h-4 w-4 inline mr-1.5" />
                {file.errorMessage}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
          <AlertDescription className="text-warning-foreground text-sm">
            下载行为将被记录，请确保数据使用符合公司规范
          </AlertDescription>
        </Alert>

        {/* Filter Bar */}
        <FilterBar onSearch={handleSearch} onReset={handleReset}>
          <FilterItem label="文件状态">
            <Select value={fileStatus} onValueChange={setFileStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="generating">文件生成中</SelectItem>
                <SelectItem value="ready">待下载</SelectItem>
                <SelectItem value="downloaded">已下载</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
                <SelectItem value="failed">生成失败</SelectItem>
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
        {pageState === 'empty' && (
          <div className="bg-white rounded-lg border border-border">
            <EmptyState
              type="no-data"
              title="暂无可下载文件"
              description="当前没有可用的导出文件"
            />
          </div>
        )}

        {/* File List */}
        {pageState === 'data' && (
          <>
            <div className="grid grid-cols-1 gap-4">
              {files.map((file) => renderFileCard(file))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                共 {files.length} 个文件
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
