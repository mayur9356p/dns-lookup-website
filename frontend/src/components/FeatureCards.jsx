import React from 'react';
import { Network, Cpu, Mail, Server, ArrowUpRight } from 'lucide-react';

export default function FeatureCards({ onSelectType, activeType }) {
  const features = [
    {
      id: 'A',
      title: 'IPv4 Address Lookup',
      type: 'A Record',
      description: 'Maps human-friendly domain names to 32-bit numerical IPv4 routing addresses for web servers.',
      icon: Network,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.2)',
      sample: '142.251.220.78',
    },
    {
      id: 'AAAA',
      title: 'IPv6 Address Lookup',
      type: 'AAAA Record',
      description: 'Resolves next-generation 128-bit hexadecimal IPv6 addresses powering modern high-speed internet.',
      icon: Cpu,
      color: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.2)',
      sample: '2607:f8b0:4004:837::200e',
    },
    {
      id: 'MX',
      title: 'Mail Server Lookup',
      type: 'MX Record',
      description: 'Identifies authoritative email exchange servers responsible for receiving messages with priority weighting.',
      icon: Mail,
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.2)',
      sample: '10 smtp.google.com',
    },
    {
      id: 'NS',
      title: 'Name Server Lookup',
      type: 'NS Record',
      description: 'Locates the authoritative DNS nameservers delegated to manage and answer queries for the domain zone.',
      icon: Server,
      color: '#22d3ee',
      glow: 'rgba(34, 211, 238, 0.2)',
      sample: 'ns1.google.com',
    },
  ];

  return (
    <section className="section" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <p className="section-subtitle">Core Capabilities</p>
          <h2 className="section-title">Essential DNS Inspection Tools</h2>
          <p className="section-desc">
            Quickly query the fundamental building blocks of internet routing and infrastructure.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((item) => {
            const Icon = item.icon;
            const isSelected = activeType === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectType(item.id)}
                className="glass-card"
                style={{
                  padding: '28px 24px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  borderColor: isSelected ? item.color : undefined,
                  boxShadow: isSelected ? `0 0 25px ${item.glow}` : undefined,
                  transform: isSelected ? 'translateY(-4px)' : undefined,
                }}
              >
                {/* Header row with icon & type badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: `rgba(${item.id === 'A' ? '56,189,248' : item.id === 'AAAA' ? '192,132,252' : item.id === 'MX' ? '251,191,36' : '34,211,238'}, 0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${item.color}40`,
                    }}
                  >
                    <Icon size={24} style={{ color: item.color }} />
                  </div>

                  <span className={`type-badge type-badge-${item.id}`}>
                    {item.type}
                  </span>
                </div>

                {/* Card Title */}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{item.title}</span>
                  <ArrowUpRight size={18} style={{ color: 'var(--text-muted)' }} />
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    marginBottom: '20px',
                  }}
                >
                  {item.description}
                </p>

                {/* Sample format hint */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ color: item.color }}>eg:</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.sample}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
