import React from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export interface DownloadRequestFormData {
  purpose: string;
  useCase: string;
  externalUse: 'yes' | 'no';
  remarks?: string;
}

interface DownloadRequestFormProps {
  onSubmit: (data: DownloadRequestFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<DownloadRequestFormData>;
}

export function DownloadRequestForm({
  onSubmit,
  onCancel,
  defaultValues,
}: DownloadRequestFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<DownloadRequestFormData>({
    defaultValues,
  });

  const externalUse = watch('externalUse');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="purpose">下载用途 *</Label>
        <Input
          id="purpose"
          {...register('purpose', { required: true })}
          placeholder="请输入下载用途"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="useCase">使用场景 *</Label>
        <Textarea
          id="useCase"
          {...register('useCase', { required: true })}
          placeholder="请详细描述使用场景"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="externalUse">是否对外使用 *</Label>
        <Select
          value={externalUse}
          onValueChange={(value) => setValue('externalUse', value as 'yes' | 'no')}
        >
          <SelectTrigger id="externalUse">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">否</SelectItem>
            <SelectItem value="yes">是</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">备注</Label>
        <Textarea
          id="remarks"
          {...register('remarks')}
          placeholder="其他需要说明的信息（可选）"
          rows={3}
        />
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
        <Button type="submit">提交申请</Button>
      </div>
    </form>
  );
}
