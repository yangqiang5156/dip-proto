import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Check, X } from 'lucide-react';

export interface DecisionData {
  action: 'approve' | 'reject';
  opinion: string;
}

interface DecisionActionsProps {
  onDecision: (decision: DecisionData) => void;
  isProcessing?: boolean;
}

export function DecisionActions({ onDecision, isProcessing = false }: DecisionActionsProps) {
  const [opinion, setOpinion] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = () => {
    setAction('approve');
    onDecision({ action: 'approve', opinion });
  };

  const handleReject = () => {
    if (!opinion.trim()) {
      alert('驳回时必须填写审批意见');
      return;
    }
    setAction('reject');
    onDecision({ action: 'reject', opinion });
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-4">审批决策</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="opinion">审批意见</Label>
          <Textarea
            id="opinion"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="请输入审批意见（驳回时必填）"
            rows={4}
            disabled={isProcessing}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleReject}
            variant="destructive"
            disabled={isProcessing}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            驳回
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1"
          >
            <Check className="mr-2 h-4 w-4" />
            通过
          </Button>
        </div>
      </div>
    </Card>
  );
}
