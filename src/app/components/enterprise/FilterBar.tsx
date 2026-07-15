import React from 'react';
import { Button } from '../ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  children: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  searchLabel?: string;
  resetLabel?: string;
}

export function FilterBar({
  children,
  onSearch,
  onReset,
  searchLabel = '查询',
  resetLabel = '重置',
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-4 mb-4">
      <div className="grid grid-cols-4 gap-4 items-end">
        {children}
      </div>

      {(onSearch || onReset) && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-light">
          {onSearch && (
            <Button onClick={onSearch} size="sm">
              <Search className="w-4 h-4 mr-1.5" />
              {searchLabel}
            </Button>
          )}
          {onReset && (
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {resetLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface FilterItemProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FilterItem({ label, children, required }: FilterItemProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">
        {required && <span className="text-destructive mr-0.5">*</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
