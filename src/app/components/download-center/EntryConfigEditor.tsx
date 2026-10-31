import { useState } from 'react';
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
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { DataClassificationFlowMatrix } from './DataClassificationApprovalFlow';
import {
  AlertCircle,
  Settings,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

type EntryStatus = 'enabled' | 'disabled';

interface EntryConfigData {
  entryId: string;
  entryName: string;
  module: string;
  page: string;
  buttonName: string;
  dataType: string;
  status: EntryStatus;
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
  const entryId = data?.entryId || 'ENTRY009';
  const [entryName, setEntryName] = useState(data?.entryName || '');
  const [module, setModule] = useState(data?.module || '');
  const [page, setPage] = useState(data?.page || '');
  const [buttonName, setButtonName] = useState(data?.buttonName || '');
  const [dataType, setDataType] = useState(data?.dataType || '');
  const [status, setStatus] = useState<EntryStatus>(data?.status || 'disabled');

  const [approvalEnabled, setApprovalEnabled] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-1/2 max-w-none sm:max-w-none p-0 flex flex-col gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-lg">入口配置</SheetTitle>
          <SheetDescription className="text-sm text-text-secondary">
            {mode === 'create' ? '新建' : '编辑'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
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
                  disabled
                  value={entryId}
                  className="bg-muted text-text-secondary"
                />
                <p className="text-xs text-text-tertiary">由系统自动生成，不可修改</p>
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
                <Input
                  id="module"
                  placeholder="例: 财务管理"
                  value={module}
                  onChange={(e) => {
                    setModule(e.target.value);
                    if (errors.module) {
                      setErrors({ ...errors, module: '' });
                    }
                  }}
                  className={errors.module ? 'border-destructive' : ''}
                />
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
                    开启后按导出字段最高密级自动匹配审批流程
                  </p>
                </div>
                <Switch
                  checked={approvalEnabled}
                  onCheckedChange={setApprovalEnabled}
                />
              </div>

              {approvalEnabled && (
                <div className="space-y-3 rounded-lg bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">密级审批规则</span>
                    <span className="text-xs text-text-tertiary">只读 · 数据开发平台提供</span>
                  </div>
                  <DataClassificationFlowMatrix />
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border bg-muted/20 flex-row gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSaveAndEnable} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            保存并启用
          </Button>
        </SheetFooter>
      </SheetContent>

    </Sheet>
  );
}
