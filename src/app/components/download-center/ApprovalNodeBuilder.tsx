import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Trash2, AlertCircle, User } from 'lucide-react';

export interface ApprovalNodeConfig {
  id: string;
  order: number;
  approverSource: 'manual' | 'role' | 'department' | 'dynamic';
  approverValue?: string;
  resolveStatus?: 'success' | 'warning' | 'error';
  fallbackApprover?: string;
}

interface ApprovalNodeBuilderProps {
  nodes: ApprovalNodeConfig[];
  onChange: (nodes: ApprovalNodeConfig[]) => void;
}

const approverSourceLabels = {
  manual: '手动指定',
  role: '按角色',
  department: '按部门',
  dynamic: '动态规则',
};

export function ApprovalNodeBuilder({ nodes, onChange }: ApprovalNodeBuilderProps) {
  const addNode = () => {
    const newNode: ApprovalNodeConfig = {
      id: `node-${Date.now()}`,
      order: nodes.length + 1,
      approverSource: 'manual',
    };
    onChange([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    onChange(nodes.filter((node) => node.id !== id));
  };

  const updateNode = (id: string, updates: Partial<ApprovalNodeConfig>) => {
    onChange(
      nodes.map((node) => (node.id === id ? { ...node, ...updates } : node))
    );
  };

  return (
    <div className="space-y-4">
      {nodes.map((node, index) => (
        <Card key={node.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm">
              {node.order}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">审批节点 {node.order}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNode(node.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>审批人来源</Label>
                  <Select
                    value={node.approverSource}
                    onValueChange={(value) =>
                      updateNode(node.id, {
                        approverSource: value as ApprovalNodeConfig['approverSource'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(approverSourceLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>审批人</Label>
                  <Input
                    value={node.approverValue || ''}
                    onChange={(e) =>
                      updateNode(node.id, { approverValue: e.target.value })
                    }
                    placeholder="请输入或选择审批人"
                  />
                </div>
              </div>

              {node.resolveStatus === 'error' && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-destructive font-medium">审批人解析失败</p>
                    <p className="mt-1 text-muted-foreground">
                      请检查审批人配置或设置备用审批人
                    </p>
                  </div>
                </div>
              )}

              {node.resolveStatus === 'warning' && (
                <div className="space-y-2">
                  <Label>备用审批人</Label>
                  <Input
                    value={node.fallbackApprover || ''}
                    onChange={(e) =>
                      updateNode(node.id, { fallbackApprover: e.target.value })
                    }
                    placeholder="当主审批人无法解析时使用"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <Badge variant="outline">
                  {approverSourceLabels[node.approverSource]}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addNode} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        添加审批节点
      </Button>
    </div>
  );
}
