import React from 'react';
import { ArrowRight, Search, Server, FileCheck, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Domain Input',
      icon: Search,
      color: '#38bdf8',
      desc: 'User enters a domain (e.g. google.com) and selects a DNS record type (or ALL). The input is sanitized and validated on the client and server.',
    },
    {
      num: '02',
      title: 'DNS Resolver',
      icon: Server,
      color: '#00f2fe',
      desc: 'The backend forwards the request to Google Public DNS-over-HTTPS (DoH) API securely over encrypted TLS on port 443, eliminating eavesdropping.',
    },
    {
      num: '03',
      title: 'DNS Records',
      icon: FileCheck,
      color: '#818cf8',
      desc: 'Google resolver queries authoritative name servers, decrypts responses, and returns RFC-compliant records with TTL, priorities, and status codes.',
    },
    {
      num: '04',
      title: 'Results Dashboard',
      icon: LayoutDashboard,
      color: '#34d399',
      desc: 'Normalized records are displayed in an interactive table with latency stats, copy tools, and JSON/CSV export options.',
    },
  ];

  return (
    <section id="how-it-works" className="section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <p className="section-subtitle">Architecture & Workflow</p>
          <h2 className="section-title">How DNS-over-HTTPS Works</h2>
          <p className="section-desc">
            A secure four-step lookup pipeline demonstrating end-to-end DNS resolution from input to visualized records.
          </p>
        </div>

        {/* Visual Pipeline Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            position: 'relative',
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className="glass-card"
                style={{
                  padding: '28px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: '1px solid var(--border-color)',
                }}
              >
                {/* Step Number & Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: step.color,
                      opacity: 0.9,
                    }}
                  >
                    {step.num}
                  </span>

                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${step.color}15`,
                      border: `1px solid ${step.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {step.desc}
                </p>

                {/* Connecting arrow indicator for all except last */}
                {idx < steps.length - 1 && (
                  <div
                    className="pipeline-arrow"
                    style={{
                      position: 'absolute',
                      right: '-14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <ArrowRight size={14} style={{ color: 'var(--accent-blue)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security Callout Box */}
        <div
          className="glass-card"
          style={{
            marginTop: '36px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            background: 'linear-gradient(135deg, rgba(16, 24, 48, 0.6), rgba(12, 19, 38, 0.8))',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
              Why DNS-over-HTTPS (DoH)?
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Traditional DNS queries are sent in plaintext over UDP port 53, leaving them vulnerable to ISP snooping, MITM attacks, and DNS spoofing. Google DoH encrypts all queries inside standard HTTPS (HTTP/2 / TLS) tunnels over RFC 8484, guaranteeing integrity and privacy.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pipeline-arrow {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
