import React from 'react';
import { AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export type ConfirmDialogType = 'delete' | 'warning' | 'success';

interface ConfirmDialogProps {
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 size={32} className="text-error" />;
      case 'success':
        return <CheckCircle size={32} className="text-success" />;
      default:
        return <AlertCircle size={32} className="text-warning" />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-error hover:bg-opacity-90';
      case 'success':
        return 'bg-success hover:bg-opacity-90';
      default:
        return 'bg-primary hover:bg-opacity-90';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center pt-8">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted text-sm leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg bg-surface border border-border text-foreground font-semibold hover:bg-border transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50 ${getConfirmButtonColor()}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
