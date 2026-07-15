import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { RiskLevelBadge } from './RiskLevelBadge';
import { ApprovalChainConfigModal } from './ApprovalChainConfigModal';
import { Separator } from '../ui/separator';
import {
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Settings,
  Loader2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';
type EntryStatus = 'enabled' | 'disabled';

interface EntryConfigData {
  entryId: string;
  entryName: string;
  module: string;
  page: string;
  buttonName: string;
  dataType: string;
  riskLevel: RiskLevel;
  status: EntryStatus;
}

interface ApprovalChainPreview {
  name: string;
  resolved: boolean;
  error?: string;
}

interface EntryConfigEditorProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  data?: EntryConfigData;
  onSave: (data: EntryConfigData, enableOnSave: boolean) => void;
}

export function EntryConfigEditor({
  open,
  onClose,
  mode,
  data,
  onSave,
}: EntryConfigEditorProps) {
  const [entryId, setEntryId] = useState(data?.entryId || '');
  const [entryName, setEntryName] = useState(data?.entryName || '');
  const [module, setModule] = useState(data?.module || '');
  const [page, setPage] = useState(data?.page || '');
  const [buttonName, setButtonName] = useState(data?.buttonName || '');
  const [dataType, setDataType] = useState(data?.dataType || '');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(data?.riskLevel || 'medium');
  const [status, setStatus] = useState<EntryStatus>(data?.status || 'disabled');

  const [approvalEnabled, setApprovalEnabled] = useState(true);
  const [fileValidityDays, setFileValidityDays] = useState('7');
  const [downloadLimit, setDownloadLimit] = useState('3');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [chainConfigOpen, setChainConfigOpen] = useState(false);

  // Mock approval chain
  const approvalChain: ApprovalChainPreview[] = [
    { name: '直属主管', resolved: true },
    { name: '部门负责人', resolved: true },
    { name: '安全部门', resolved: false, error: '未找到' },
  ];

  const hasApprovalError = approvalChain.some((node) => !node.resolved);
  const hasIncompleteChain = approvalChain.length < 2;

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      onSave(
        {
          entryId,
          entryName,
          module,
          page,
          buttonName,
          dataType,
          riskLevel,
          status: 'disabled',
        },
        false
      );
      setSaving(false);
    }, 800);
  };

  const handleSaveAndEnable = () => {
    const newErrors: Record<string, string> = {};

    if (!entryId.trim()) {
      newErrors.entryId = '请输入入口ID';
    }
    if (!entryName.trim()) {
      newErrors.entryName = '请输入入口名称';
    }
    if (!module) {
      newErrors.module = '请选择所属模块';
    }
    if (!page.trim()) {
      newErrors.page = '请输入所属页面';
    }
    if (!buttonName.trim()) {
      newErrors.buttonName = '请输入按钮名称';
    }
    if (!dataType.trim()) {
      newErrors.dataType = '请输入数据类型';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSaving(true);
      setTimeout(() => {
        onSave(
          {
            entryId,
            entryName,
            module,
            page,
            buttonName,
            dataType,
            riskLevel,
            status: 'enabled',
          },
          true
        );
        setSaving(false);
      }, 800);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  const openApprovalChainConfig = () => {
    setChainConfigOpen(true);
  };

  const handleSaveApprovalChain = (nodes: any[]) => {
    console.log('Saved approval chain:', nodes);
    // In a real app, this would update the approval chain configuration
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[600px] max-w-full p-0 flex flex-col gap-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-lg">入口配置</SheetTitle>
          <SheetDescription className="text-sm text-text-secondary">
            {mode === 'create' ? '新建' : '编辑'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Risk and Validation Alerts */}
          {hasApprovalError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>审批人识别失败</AlertTitle>
              <AlertDescription>
                部分审批节点无法解析，请检查组织架构配置
              </AlertDescription>
            </Alert>
          )}

          {hasIncompleteChain && !hasApprovalError && (
            <Alert className="border-warning bg-warning-light/20">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-warning">审批链不完整</AlertTitle>
              <AlertDescription className="text-warning">
                建议配置至少两级审批节点
              </AlertDescription>
            </Alert>
          )}

          {errors.entryId && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>入口ID已存在或格式无效</AlertDescription>
            </Alert>
          )}

          {/* 基础信息 Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-text-primary">基础信息</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entryId" className="text-sm">
                  入口ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="entryId"
                  placeholder="例: ENTRY001"
                  value={entryId}
                  onChange={(e) => {
                    setEntryId(e.target.value);
                    if (errors.entryId) {
                      setErrors({ ...errors, entryId: '' });
                    }
                  }}
                  className={errors.entryId ? 'border-destructive' : ''}
                />
                {errors.entryId && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.entryId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryName" className="text-sm">
                  入口名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="entryName"
                  placeholder="例: 销售数据导出"
                  value={entryName}
                  onChange={(e) => {
                    setEntryName(e.target.value);
                    if (errors.entryName) {
                      setErrors({ ...errors, entryName: '' });
                    }
                  }}
                  className={errors.entryName ? 'border-destructive' : ''}
                />
                {errors.entryName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.entryName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="module" className="text-sm">
                  所属模块 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={module}
                  onValueChange={(value) => {
                    setModule(value);
                    if (errors.module) {
                      setErrors({ ...errors, module: '' });
                    }
                  }}
                >
                  <SelectTrigger
                    id="module"
                    className={errors.module ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="请选择模块" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-analysis">数据分析</SelectItem>
                    <SelectItem value="finance">财务管理</SelectItem>
                    <SelectItem value="customer">客户管理</SelectItem>
                    <SelectItem value="order">订单管理</SelectItem>
                    <SelectItem value="hr">人力资源</SelectItem>
                    <SelectItem value="system">系统管理</SelectItem>
                  </SelectContent>
                </Select>
                {errors.module && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.module}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="page" className="text-sm">
                  所属页面 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="page"
                  placeholder="例: 销售报表"
                  value={page}
                  onChange={(e) => {
                    setPage(e.target.value);
                    if (errors.page) {
                      setErrors({ ...errors, page: '' });
                    }
                  }}
                  className={errors.page ? 'border-destructive' : ''}
                />
                {errors.page && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.page}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonName" className="text-sm">
                  按钮名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="buttonName"
                  placeholder="例: 导出数据"
                  value={buttonName}
                  onChange={(e) => {
                    setButtonName(e.target.value);
                    if (errors.buttonName) {
                      setErrors({ ...errors, buttonName: '' });
                    }
                  }}
                  className={errors.buttonName ? 'border-destructive' : ''}
                />
                {errors.buttonName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.buttonName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataType" className="text-sm">
                  数据类型 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataType"
                  placeholder="例: 交易数据"
                  value={dataType}
                  onChange={(e) => {
                    setDataType(e.target.value);
                    if (errors.dataType) {
                      setErrors({ ...errors, dataType: '' });
                    }
                  }}
                  className={errors.dataType ? 'border-destructive' : ''}
                />
                {errors.dataType && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dataType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskLevel" className="text-sm">
                  风险等级 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={riskLevel}
                  onValueChange={(value) => setRiskLevel(value as RiskLevel)}
                >
                  <SelectTrigger id="riskLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <RiskLevelBadge level="low" size="sm" />
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <RiskLevelBadge level="medium" size="sm" />
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <RiskLevelBadge level="high" size="sm" />
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm">
                  状态
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as EntryStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">启用</SelectItem>
                    <SelectItem value="disabled">停用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* 审批规则 Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-text-primary">审批规则</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">启用审批</Label>
                  <p className="text-xs text-text-tertiary">
                    开启后用户下载需经过审批流程
                  </p>
                </div>
                <Switch
                  checked={approvalEnabled}
                  onCheckedChange={setApprovalEnabled}
                />
              </div>

              {approvalEnabled && (
                <>
                  <Card className="p-4 bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        审批链预览
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary"
                        onClick={openApprovalChainConfig}
                      >
                        配置
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {approvalChain.map((node, index) => (
                        <React.Fragment key={index}>
                          <div
                            className={`px-3 py-1.5 rounded-md text-sm ${
                              node.resolved
                                ? 'bg-primary-light text-primary border border-primary/20'
                                : 'bg-destructive-light text-destructive border border-destructive/20'
                            }`}
                          >
                            {node.name}
                            {!node.resolved && node.error && (
                              <span className="ml-1 text-xs">({node.error})</span>
                            )}
                          </div>
                          {index < approvalChain.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-text-tertiary" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </Card>

                  <div className="flex items-start gap-2 p-3 bg-info-light/20 border border-info/20 rounded-md">
                    <CheckCircle2 className="w-4 h-4 text-info mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm text-info font-medium">健康状态</p>
                      <p className="text-xs text-info/80">
                        {hasApprovalError
                          ? '部分审批节点解析失败'
                          : hasIncompleteChain
                            ? '审批链配置不完整'
                            : '审批链配置正常'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* 文件规则 Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-text-primary">文件规则</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileValidity" className="text-sm">
                  文件有效期（天）
                </Label>
                <Input
                  id="fileValidity"
                  type="number"
                  min="1"
                  max="30"
                  value={fileValidityDays}
                  onChange={(e) => setFileValidityDays(e.target.value)}
                />
                <p className="text-xs text-text-tertiary">
                  生成的文件在此期限后自动失效
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadLimit" className="text-sm">
                  下载次数限制
                </Label>
                <Input
                  id="downloadLimit"
                  type="number"
                  min="1"
                  max="100"
                  value={downloadLimit}
                  onChange={(e) => setDownloadLimit(e.target.value)}
                />
                <p className="text-xs text-text-tertiary">
                  文件可被下载的最大次数
                </p>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border bg-muted/20 flex-row gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            取消
          </Button>
          <Button variant="secondary" onClick={handleSaveDraft} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            保存草稿
          </Button>
          <Button onClick={handleSaveAndEnable} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            保存并启用
          </Button>
        </SheetFooter>
      </SheetContent>

      <ApprovalChainConfigModal
        open={chainConfigOpen}
        onClose={() => setChainConfigOpen(false)}
        onSave={handleSaveApprovalChain}
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
    </Sheet>
  );
}