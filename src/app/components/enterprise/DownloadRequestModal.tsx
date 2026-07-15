import React, { useState } from 'react';
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
import { RiskLevelBadge } from '../download-center';
import { SystemBanner } from '../download-center/SystemBanner';
import { AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

export interface DownloadContext {
  entryName: string;
  entryId: string;
  module: string;
  pageName: string;
  buttonName: string;
  dataType: string;
  riskLevel: 'low' | 'medium' | 'high';
  exportConditions: string;
}

export interface ApprovalChainNode {
  name: string;
  resolved: boolean;
  error?: string;
}

export type ModalState = 'normal' | 'no-config' | 'resolve-error' | 'submitting' | 'success';

interface DownloadRequestModalProps {
  open: boolean;
  onClose: () => void;
  context: DownloadContext;
  approvalChain: ApprovalChainNode[];
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
  approvalChain,
  state = 'normal',
  onSubmit,
}: DownloadRequestModalProps) {
  const [purpose, setPurpose] = useState('');
  const [externalUse, setExternalUse] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasApprovalError = approvalChain.some((node) => !node.resolved);

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
            该下载操作需要审批，审批通过后可前往下载中心下载文件
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
              title="审批人识别失败"
              message="审批人识别失败，请联系管理员检查组织架构或审批配置"
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
              <div className="col-span-2">
                <span className="text-text-secondary">风险等级:</span>
                <div className="mt-1">
                  <RiskLevelBadge level={context.riskLevel} size="sm" />
                </div>
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

          {/* Approval Chain Preview */}
          {approvalChain.length > 0 && (
            <Card className="p-4 bg-muted/30">
              <h3 className="text-sm font-semibold text-text-primary mb-3">审批流程预览</h3>
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
          )}
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