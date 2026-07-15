import React from 'react';
import { Check, X, Clock } from 'lucide-react';

export interface ApprovalNode {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'current';
  approver?: string;
  opinion?: string;
  time?: string;
}

interface ApprovalProgressProps {
  nodes: ApprovalNode[];
}

export function ApprovalProgress({ nodes }: ApprovalProgressProps) {
  return (
    <div className="space-y-4">
      {nodes.map((node, index) => (
        <div key={node.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                node.status === 'approved'
                  ? 'bg-success text-success-foreground'
                  : node.status === 'rejected'
                  ? 'bg-destructive text-destructive-foreground'
                  : node.status === 'current'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {node.status === 'approved' ? (
                <Check className="h-4 w-4" />
              ) : node.status === 'rejected' ? (
                <X className="h-4 w-4" />
              ) : node.status === 'current' ? (
                <Clock className="h-4 w-4" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            {index < nodes.length - 1 && (
              <div
                className={`h-12 w-0.5 ${
                  node.status === 'approved' || node.status === 'rejected'
                    ? 'bg-border'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{node.name}</h4>
              {node.status === 'current' && (
                <span className="text-xs text-primary">审批中</span>
              )}
            </div>

            {node.approver && (
              <p className="mt-1 text-sm text-muted-foreground">
                审批人: {node.approver}
              </p>
            )}

            {node.opinion && (
              <div className="mt-2 rounded-lg bg-secondary p-3 text-sm">
                <p className="text-muted-foreground">审批意见:</p>
                <p className="mt-1 text-foreground">{node.opinion}</p>
              </div>
            )}

            {node.time && (
              <p className="mt-2 text-xs text-muted-foreground">{node.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
