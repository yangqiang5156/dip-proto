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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  User,
  Users,
  Building2,
  Shield,
  UserCircle,
  Info,
  XCircle,
} from 'lucide-react';

type NodeSourceType =
  | 'fixed-person'
  | 'by-role'
  | 'direct-manager'
  | 'function-owner'
  | 'function-requester'
  | 'security-group';

type ResolverStatus = 'valid' | 'warning' | 'error' | 'unknown';

interface ApprovalNode {
  id: string;
  order: number;
  sourceType: NodeSourceType;
  selectedValue?: string;
  resolverStatus: ResolverStatus;
  resolverMessage?: string;
  fallbackPerson?: string;
}

interface ApprovalChainConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (nodes: ApprovalNode[]) => void;
  initialNodes?: ApprovalNode[];
}

const sourceTypeConfig = {
  'fixed-person': {
    label: '固定人员',
    icon: User,
    placeholder: '选择审批人',
    requiresValue: true,
  },
  'by-role': {
    label: '按角色取人',
    icon: Users,
    placeholder: '选择角色',
    requiresValue: true,
  },
  'direct-manager': {
    label: '按直属领导取人',
    icon: UserCircle,
    placeholder: '自动解析申请人的直属领导',
    requiresValue: false,
  },
  'function-owner': {
    label: '按功能负责人取人',
    icon: Building2,
    placeholder: '选择功能模块',
    requiresValue: true,
  },
  'function-requester': {
    label: '按功能需求方取人',
    icon: Building2,
    placeholder: '选择功能模块',
    requiresValue: true,
  },
  'security-group': {
    label: '按安全审批组取人',
    icon: Shield,
    placeholder: '选择安全组',
    requiresValue: true,
  },
};

export function ApprovalChainConfigModal({
  open,
  onClose,
  onSave,
  initialNodes = [],
}: ApprovalChainConfigModalProps) {
  const [nodes, setNodes] = useState<ApprovalNode[]>(
    initialNodes.length > 0
      ? initialNodes
      : []
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialNodes.length > 0 ? initialNodes[0].id : null
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const addNode = () => {
    const newNode: ApprovalNode = {
      id: `node-${Date.now()}`,
      order: nodes.length + 1,
      sourceType: 'fixed-person',
      resolverStatus: 'unknown',
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const removeNode = (id: string) => {
    const filtered = nodes.filter((n) => n.id !== id);
    const reordered = filtered.map((node, index) => ({
      ...node,
      order: index + 1,
    }));
    setNodes(reordered);
    if (selectedNodeId === id) {
      setSelectedNodeId(reordered.length > 0 ? reordered[0].id : null);
    }
  };

  const moveNode = (id: string, direction: 'up' | 'down') => {
    const index = nodes.findIndex((n) => n.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === nodes.length - 1)
    ) {
      return;
    }

    const newNodes = [...nodes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newNodes[index], newNodes[targetIndex]] = [newNodes[targetIndex], newNodes[index]];

    const reordered = newNodes.map((node, idx) => ({
      ...node,
      order: idx + 1,
    }));
    setNodes(reordered);
  };

  const updateSelectedNode = (updates: Partial<ApprovalNode>) => {
    if (!selectedNodeId) return;
    setNodes(
      nodes.map((node) =>
        node.id === selectedNodeId ? { ...node, ...updates } : node
      )
    );
  };

  const handleSave = () => {
    onSave(nodes);
    onClose();
  };

  const handleCancel = () => {
    setNodes(initialNodes);
    onClose();
  };

  const getResolverStatusBadge = (status: ResolverStatus) => {
    switch (status) {
      case 'valid':
        return (
          <Badge className="bg-success-light text-success border border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            已解析
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-warning-light text-warning border border-warning/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            需要备用
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-destructive-light text-destructive border border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            解析失败
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-text-tertiary">
            未配置
          </Badge>
        );
    }
  };

  const hasInvalidNodes = nodes.some(
    (n) => n.resolverStatus === 'error' || n.resolverStatus === 'unknown'
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full sm:w-[50vw] sm:max-w-[50vw] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>审批链配置</DialogTitle>
          <DialogDescription>
            配置串行审批流程 - 按顺序依次审批，所有节点通过后审批完成
          </DialogDescription>
        </DialogHeader>

        {/* Info Banner */}
        <div className="px-6 pt-4">
          <Alert className="border-info/50 bg-info-light/20">
            <Info className="h-4 w-4 text-info" />
            <AlertDescription className="text-info text-sm">
              当前版本仅支持串行审批，审批将按照配置的顺序依次进行
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Node List */}
          <div className="w-[320px] border-r border-border flex flex-col">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-sm text-text-primary">
                审批节点顺序
              </h3>
              <p className="text-xs text-text-tertiary mt-1">
                共 {nodes.length} 个节点
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="w-12 h-12 text-text-tertiary mb-3" />
                  <p className="text-sm text-text-secondary mb-1">暂无审批节点</p>
                  <p className="text-xs text-text-tertiary">点击下方按钮添加节点</p>
                </div>
              ) : (
                <>
                  {nodes.map((node, index) => {
                    const config = sourceTypeConfig[node.sourceType];
                    const Icon = config.icon;
                    const isSelected = node.id === selectedNodeId;

                    return (
                      <div key={node.id} className="space-y-1">
                        <Card
                          className={`p-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary-light/30 shadow-sm'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedNodeId(node.id)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Drag Handle */}
                            <div className="flex flex-col gap-1 pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveNode(node.id, 'up');
                                }}
                                disabled={index === 0}
                                className="text-text-tertiary hover:text-text-primary disabled:opacity-30"
                              >
                                <GripVertical className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Order Badge */}
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-semibold text-xs ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-text-secondary'
                              }`}
                            >
                              {node.order}
                            </div>

                            {/* Node Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                                <span className="text-sm font-medium text-text-primary truncate">
                                  {config.label}
                                </span>
                              </div>
                              {node.selectedValue && (
                                <p className="text-xs text-text-secondary truncate">
                                  {node.selectedValue}
                                </p>
                              )}
                              <div className="mt-1.5">
                                {getResolverStatusBadge(node.resolverStatus)}
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNode(node.id);
                              }}
                              className="text-text-tertiary hover:text-destructive p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Card>

                        {/* Flow Arrow */}
                        {index < nodes.length - 1 && (
                          <div className="flex justify-center py-0.5">
                            <ChevronRight className="w-4 h-4 text-text-tertiary rotate-90" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="p-4 border-t border-border">
              <Button onClick={addNode} variant="outline" className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                添加节点
              </Button>
            </div>
          </div>

          {/* Right Panel - Node Settings */}
          <div className="flex-1 overflow-y-auto">
            {selectedNode ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    节点 {selectedNode.order} - 详细设置
                  </h3>
                  <p className="text-sm text-text-secondary">
                    配���此审批节点的审批人来源和解析规则
                  </p>
                </div>

                <Separator />

                {/* Source Type Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    审批人来源 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedNode.sourceType}
                    onValueChange={(value) =>
                      updateSelectedNode({ sourceType: value as NodeSourceType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sourceTypeConfig).map(([value, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-text-tertiary">
                    {sourceTypeConfig[selectedNode.sourceType].placeholder}
                  </p>
                </div>

                {/* Value Input (if required) */}
                {sourceTypeConfig[selectedNode.sourceType].requiresValue && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {selectedNode.sourceType === 'fixed-person'
                        ? '指定审批人'
                        : selectedNode.sourceType === 'by-role'
                          ? '选择角色'
                          : selectedNode.sourceType === 'security-group'
                            ? '选择安全组'
                            : '选择模块'}
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      placeholder={sourceTypeConfig[selectedNode.sourceType].placeholder}
                      value={selectedNode.selectedValue || ''}
                      onChange={(e) =>
                        updateSelectedNode({ selectedValue: e.target.value })
                      }
                    />
                  </div>
                )}

                {/* Resolver Status Display */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">解析状态</Label>
                  <Card className="p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      {selectedNode.resolverStatus === 'valid' && (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      )}
                      {selectedNode.resolverStatus === 'warning' && (
                        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      )}
                      {selectedNode.resolverStatus === 'error' && (
                        <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      {selectedNode.resolverStatus === 'unknown' && (
                        <Info className="w-5 h-5 text-text-tertiary shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1">
                        <div className="mb-1">
                          {getResolverStatusBadge(selectedNode.resolverStatus)}
                        </div>
                        <p className="text-sm text-text-secondary">
                          {selectedNode.resolverStatus === 'valid' &&
                            '审批人可以正常解析'}
                          {selectedNode.resolverStatus === 'warning' &&
                            '审批人解析存在不确定性，建议配置备用审批人'}
                          {selectedNode.resolverStatus === 'error' &&
                            '审批人解析失败，请检查配置或联系管理员'}
                          {selectedNode.resolverStatus === 'unknown' &&
                            '请先完成配置，系统将自动校验解析状态'}
                        </p>
                        {selectedNode.resolverMessage && (
                          <p className="text-xs text-text-tertiary mt-1">
                            {selectedNode.resolverMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Fallback Person (for warning/error states) */}
                {(selectedNode.resolverStatus === 'warning' ||
                  selectedNode.resolverStatus === 'error') && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      备用审批人
                      {selectedNode.resolverStatus === 'error' && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>
                    <Input
                      placeholder="当主审批人无法解析时使用"
                      value={selectedNode.fallbackPerson || ''}
                      onChange={(e) =>
                        updateSelectedNode({ fallbackPerson: e.target.value })
                      }
                    />
                    <p className="text-xs text-text-tertiary">
                      当系统无法解析主审批人时，将自动使用备用审批人
                    </p>
                  </div>
                )}

                {/* Mock Resolution Examples */}
                <Alert className="border-border">
                  <Info className="h-4 w-4 text-text-secondary" />
                  <AlertTitle className="text-sm">解析示例</AlertTitle>
                  <AlertDescription className="text-xs text-text-secondary">
                    {selectedNode.sourceType === 'direct-manager' &&
                      '系统将自动查找申请人的直属领导作为审批人'}
                    {selectedNode.sourceType === 'by-role' &&
                      '系统将查找具有指定角色权限的用户'}
                    {selectedNode.sourceType === 'fixed-person' &&
                      '使用您指定的固定审批人'}
                    {selectedNode.sourceType === 'function-owner' &&
                      '系统将查找该功能模块的负责人'}
                    {selectedNode.sourceType === 'function-requester' &&
                      '系统将查找该功能模块的需求方'}
                    {selectedNode.sourceType === 'security-group' &&
                      '系统将通知该安全组的所有成员'}
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <User className="w-16 h-16 text-text-tertiary mb-4" />
                <p className="text-sm text-text-secondary mb-2">未选择审批节点</p>
                <p className="text-xs text-text-tertiary max-w-xs">
                  请从左侧列表中选择一个节点进行配置，或添加新节点
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-text-secondary">
              {hasInvalidNodes && (
                <span className="flex items-center gap-1.5 text-warning">
                  <AlertCircle className="w-4 h-4" />
                  存在未配置或解析失败的节点
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleSave} disabled={nodes.length === 0}>
                保存配置
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}