import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  AlertCircle,
} from 'lucide-react';

export type MessageType =
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'file_ready'
  | 'expiring_soon'
  | 'generation_failed';

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

interface MessageItemProps {
  message: Message;
  onClick?: () => void;
}

const messageConfig: Record<MessageType, { icon: any; color: string }> = {
  submitted: { icon: FileCheck, color: 'text-accent' },
  pending_approval: { icon: Clock, color: 'text-warning' },
  approved: { icon: CheckCircle, color: 'text-success' },
  rejected: { icon: XCircle, color: 'text-destructive' },
  file_ready: { icon: Download, color: 'text-primary' },
  expiring_soon: { icon: AlertCircle, color: 'text-warning' },
  generation_failed: { icon: XCircle, color: 'text-destructive' },
};

export function MessageItem({ message, onClick }: MessageItemProps) {
  const config = messageConfig[message.type];
  const Icon = config.icon;

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
        !message.isRead ? 'border-primary/50 bg-secondary/30' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 ${config.color}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground">{message.title}</h4>
            {!message.isRead && (
              <Badge variant="default" className="flex-shrink-0 bg-primary">
                新
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {message.content}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">{message.time}</p>
        </div>
      </div>
    </Card>
  );
}
