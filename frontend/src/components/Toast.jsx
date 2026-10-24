import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'var(--accent-blue)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'var(--accent-emerald)';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--accent-rose)';
        }

        return (
          <div key={toast.id} className="toast glass-card">
            <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>
              {toast.message}
            </span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
