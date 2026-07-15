import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

export interface AuditLogEntry {
  id: string;
  operationType: string;
  actor: string;
  result: 'success' | 'failure';
  time: string;
  remarks?: string;
  ip?: string;
  device?: string;
}

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  onRowClick?: (log: AuditLogEntry) => void;
}

export function AuditLogTable({ logs, onRowClick }: AuditLogTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>操作类型</TableHead>
            <TableHead>操作人</TableHead>
            <TableHead>结果</TableHead>
            <TableHead>时间</TableHead>
            <TableHead>IP地址</TableHead>
            <TableHead>设备信息</TableHead>
            <TableHead>备注</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                暂无审计日志
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow
                key={log.id}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => onRowClick?.(log)}
              >
                <TableCell className="font-medium">{log.operationType}</TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      log.result === 'success'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }
                  >
                    {log.result === 'success' ? '成功' : '失败'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{log.time}</TableCell>
                <TableCell className="text-muted-foreground">
                  {log.ip || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.device || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {log.remarks || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
