import { CheckCircle2, Circle, Clock3, XCircle } from 'lucide-react';
import { ApprovalNode } from '../download-center/ApprovalProgress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ApprovalProcessTableProps {
  nodes: ApprovalNode[];
  applicant: string;
  applyTime: string;
}

const statusConfig = {
  approved: {
    label: '审批通过',
    icon: CheckCircle2,
    className: 'text-success',
  },
  rejected: {
    label: '已驳回',
    icon: XCircle,
    className: 'text-destructive',
  },
  current: {
    label: '待审批',
    icon: Clock3,
    className: 'text-primary',
  },
  pending: {
    label: '未开始',
    icon: Circle,
    className: 'text-muted-foreground',
  },
} as const;

export function ApprovalProcessTable({ nodes, applicant, applyTime }: ApprovalProcessTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>处理流程</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="pl-6">操作</TableHead>
              <TableHead>结果</TableHead>
              <TableHead>操作人</TableHead>
              <TableHead>操作说明</TableHead>
              <TableHead className="pr-6">时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="pl-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>提交申请</span>
                </div>
              </TableCell>
              <TableCell className="text-success">提交成功</TableCell>
              <TableCell>{applicant}</TableCell>
              <TableCell>申请</TableCell>
              <TableCell className="pr-6">{applyTime}</TableCell>
            </TableRow>
            {nodes.map((node) => {
              const config = statusConfig[node.status];
              const StatusIcon = config.icon;
              return (
                <TableRow key={node.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${config.className}`} />
                      <span>审批权限 · {node.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className={config.className}>{config.label}</TableCell>
                  <TableCell>{node.approver || '--'}</TableCell>
                  <TableCell className="max-w-[240px] whitespace-normal">{node.opinion || '--'}</TableCell>
                  <TableCell className="pr-6">{node.time || '--'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
