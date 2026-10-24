import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';

export default function RecentSearches({ history, onSelectQuery, onClearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="container" style={{ marginBottom: '32px' }}>
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={18} style={{ color: 'var(--accent-blue)' }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Recent Lookups:
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            flex: 1,
            margin: '0 12px',
          }}
        >
          {history.slice(0, 6).map((item, idx) => {
            const isRev = item.mode === 'reverse' || item.type === 'PTR';
            const targetVal = item.domain || item.target || item.ip;

            return (
              <button
                key={`${targetVal}-${item.type}-${idx}`}
                onClick={() => onSelectQuery(targetVal, item.type, isRev ? 'reverse' : 'forward')}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.08)';
                }}
                title={`Repeat ${isRev ? 'Reverse' : 'Forward'} lookup for ${targetVal}`}
              >
                <span>{targetVal}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: isRev ? 'var(--accent-cyan)' : 'var(--accent-blue)',
                    fontWeight: 700,
                  }}
                >
                  {item.type || (isRev ? 'PTR' : 'A')}
                </span>
                <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
            );
          })}
        </div>

        <button
          onClick={onClearHistory}
          type="button"
          className="btn-icon"
          style={{ width: '32px', height: '32px' }}
          title="Clear search history"
        >
          <Trash2 size={15} style={{ color: 'var(--accent-rose)' }} />
        </button>
      </div>
    </div>
  );
}
