import React from 'react';
import { Award, Code2, Globe2, Cpu, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const highlights = [
    'Direct integration with Google Public DNS-over-HTTPS (DoH) API',
    'Supports 8 query modes: A, AAAA, MX, NS, TXT, CNAME, SOA, and ALL',
    'Instant copy-to-clipboard and JSON/CSV export options',
    'Robust error handling with real DNS status codes (NOERROR, NXDOMAIN, SERVFAIL)',
    'Persistent query history via client-side localStorage',
    'Cybersecurity-inspired UI with dark/light mode toggle',
  ];

  return (
    <section id="about" className="section" style={{ backgroundColor: 'rgba(12, 19, 38, 0.4)' }}>
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Project Overview</p>
          <h2 className="section-title">About DNS Lookup</h2>
          <p className="section-desc">
            A full-stack network intelligence web application engineered for educational clarity and live DNS inspection.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'center',
          }}
        >
          {/* Left card: College Project Profile */}
          <div
            className="glass-card"
            style={{
              padding: '32px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0, 242, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                }}
              >
                <Award size={24} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Computer Networks Project</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Demonstrating Modern Web & DNS Architecture
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Designed as a modern, lightweight demonstration tool for college coursework in Computer Networks, Cybersecurity, and Web Development. Unlike theoretical textbook diagrams, this tool connects to actual live DNS servers in real time.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {highlights.map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle size={16} style={{ color: 'var(--accent-emerald)', marginTop: '4px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right card: Technical Stack Spec */}
          <div
            className="glass-card"
            style={{
              padding: '32px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <Code2 size={24} style={{ color: 'var(--accent-blue)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Technology Stack</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Clean, Modern, and Production-Ready
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Frontend
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
                  React 18 + Vite
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Fast HMR, Lucide Icons
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Backend API
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
                  Node.js + Express
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Rate Limiting, CORS, ES Modules
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  DNS Resolver
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
                  Google DoH API
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  RFC 8484 TLS Encrypted
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Styling
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
                  Modern CSS3
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Dark/Light Theme Variables
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
