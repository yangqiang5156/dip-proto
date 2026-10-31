import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card } from '../ui/card';
import {
  DataClassificationApprovalFlow,
  DataClassificationLevel,
  SystemBanner,
} from '../download-center';
import { AlertCircle, Loader2 } from 'lucide-react';

export interface DownloadContext {
  entryName: string;
  entryId: string;
  module: string;
  pageName: string;
  buttonName: string;
  dataType: string;
  exportConditions: string;
  classificationLevel?: DataClassificationLevel;
  hasPersonalInfoOrCrossBorder?: boolean;
}

export type ModalState = 'normal' | 'no-config' | 'resolve-error' | 'submitting' | 'success';

interface DownloadRequestModalProps {
  open: boolean;
  onClose: () => void;
  context: DownloadContext;
  state?: ModalState;
  onSubmit: (data: {
    purpose: string;
    externalUse: string;
    remarks: string;
  }) => void;
}

export function DownloadRequestModal({
  open,
  onClose,
  context,
  state = 'normal',
  onSubmit,
}: DownloadRequestModalProps) {
  const [purpose, setPurpose] = useState('');
  const [externalUse, setExternalUse] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const classificationLevel = context.classificationLevel || 'S3';
  const hasApprovalError = state === 'resolve-error';

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!purpose.trim()) {
      newErrors.purpose = '请输入下载用途';
    }
    if (!externalUse) {
      newErrors.externalUse = '请选择是否对外使用';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ purpose, externalUse, remarks });
    }
  };

  const handleCancel = () => {
    setPurpose('');
    setExternalUse('');
    setRemarks('');
    setErrors({});
    onClose();
  };

  const isSubmitDisabled =
    state === 'submitting' || state === 'no-config' || hasApprovalError;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:w-[50vw] sm:max-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">下载申请</DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            系统将按导出字段最高密级自动匹配流程，审批通过后可前往下载中心下载文件
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* System error banners */}
          {state === 'no-config' && (
            <SystemBanner
              type="error"
              title="配置缺失"
              message="当前入口未完成审批配置，请联系管理员"
            />
          )}

          {hasApprovalError && state !== 'no-config' && (
            <SystemBanner
              type="error"
              title="数据开发平台角色解析失败"
              message="未能获取表对应的审批角色或人员，请联系数据开发平台管理员"
            />
          )}

          {/* Context Summary Card */}
          <Card className="p-4 bg-muted/30">
            <h3 className="text-sm font-semibold text-text-primary mb-3">申请上下文</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-text-secondary">入口名称:</span>
                <p className="text-text-primary mt-0.5">{context.entryName}</p>
              </div>
              <div>
                <span className="text-text-secondary">入口ID:</span>
                <p className="text-text-primary mt-0.5 font-mono text-xs">
                  {context.entryId}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">所属模块:</span>
                <p className="text-text-primary mt-0.5">{context.module}</p>
              </div>
              <div>
                <span className="text-text-secondary">页面名称:</span>
                <p className="text-text-primary mt-0.5">{context.pageName}</p>
              </div>
              <div>
                <span className="text-text-secondary">按钮名称:</span>
                <p className="text-text-primary mt-0.5">{context.buttonName}</p>
              </div>
              <div>
                <span className="text-text-secondary">数据类型:</span>
                <p className="text-text-primary mt-0.5">{context.dataType}</p>
              </div>
              <div>
                <span className="text-text-secondary">最高字段密级:</span>
                <p className="mt-0.5 font-medium text-text-primary">
                  {classificationLevel}
                </p>
              </div>
              <div>
                <span className="text-text-secondary">个人信息/跨境:</span>
                <p className="mt-0.5 text-text-primary">
                  {context.hasPersonalInfoOrCrossBorder ? '涉及' : '不涉及'}
                </p>
              </div>
            </div>
          </Card>

          {/* Export Conditions Card */}
          <Card className="p-4 bg-muted/30">
            <h3 className="text-sm font-semibold text-text-primary mb-2">导出条件摘要</h3>
            <p className="text-sm text-text-secondary">{context.exportConditions}</p>
          </Card>

          {/* Application Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-sm font-medium">
                下载用途 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="purpose"
                placeholder="请详细描述数据的具体使用场景，例如用于哪个分析项目、报告或业务决策"
                rows={3}
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (errors.purpose) {
                    setErrors({ ...errors, purpose: '' });
                  }
                }}
                className={errors.purpose ? 'border-destructive' : ''}
              />
              {errors.purpose && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.purpose}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUse" className="text-sm font-medium">
                是否对外使用 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={externalUse}
                onValueChange={(value) => {
                  setExternalUse(value);
                  if (errors.externalUse) {
                    setErrors({ ...errors, externalUse: '' });
                  }
                }}
              >
                <SelectTrigger
                  id="externalUse"
                  className={errors.externalUse ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="请选择数据是否会在公司外部使用" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">否 - 仅内部使用</SelectItem>
                  <SelectItem value="yes">是 - 需要对外使用</SelectItem>
                </SelectContent>
              </Select>
              {errors.externalUse && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.externalUse}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-medium">
                备注
              </Label>
              <Textarea
                id="remarks"
                placeholder="其他需要说明的信息（可选）"
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <Card className="bg-muted/30 p-4">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">审批流程预览</h3>
            <DataClassificationApprovalFlow
              level={classificationLevel}
              hasPersonalInfoOrCrossBorder={context.hasPersonalInfoOrCrossBorder}
            />
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={state === 'submitting'}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {state === 'submitting' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            提交申请
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
