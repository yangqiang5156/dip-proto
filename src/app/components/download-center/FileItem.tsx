import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Download, FileText, AlertCircle } from 'lucide-react';

export interface FileItemData {
  id: string;
  name: string;
  size: string;
  generatedTime: string;
  status: 'available' | 'expired';
}

interface FileItemProps {
  file: FileItemData;
  onDownload: (fileId: string) => void;
}

export function FileItem({ file, onDownload }: FileItemProps) {
  const isExpired = file.status === 'expired';

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
          <FileText className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{file.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{file.size}</p>
            </div>

            {isExpired && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="mr-1 h-3 w-3" />
                已过期
              </Badge>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>生成时间: {file.generatedTime}</span>
          </div>

          <div className="mt-3">
            <Button
              onClick={() => onDownload(file.id)}
              disabled={isExpired}
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
