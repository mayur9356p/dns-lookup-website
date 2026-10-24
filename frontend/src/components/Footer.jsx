import React from 'react';
import { Globe, Heart, Shield, Terminal, ArrowUp } from 'lucide-react';

export default function Footer({ onSelectType }) {
  const supportedRecords = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA', 'ALL'];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '60px',
        paddingBottom: '30px',
        marginTop: '40px',
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(0,242,254,0.15), rgba(59,130,246,0.25))',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Globe size={18} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                DNS <span className="gradient-text">Lookup</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              A modern, lightweight cybersecurity DNS inspection utility powered by Google Public DNS-over-HTTPS. Designed for students, network administrators, and web developers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Shield size={14} style={{ color: 'var(--accent-emerald)' }} />
              <span>TLS Encrypted Resolution (RFC 8484)</span>
            </div>
          </div>

          {/* Supported Records */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Supported DNS Records
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {supportedRecords.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onSelectType(t);
                    scrollToTop();
                  }}
                  className={`type-badge type-badge-${t}`}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                  }}
                  title={`Click to test ${t} query`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '14px', lineHeight: 1.5 }}>
              Click any record type above to immediately prefill the query selector.
            </p>
          </div>

          {/* College Project / Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a href="#home" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  Hero Search
                </a>
              </li>
              <li>
                <a href="#records-guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  DNS Records Guide
                </a>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  How It Works (DoH)
                </a>
              </li>
              <li>
                <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
                  About & Tech Stack
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} DNS Lookup Application. Built for College Project Demonstration.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Powered by <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Google Public DNS</span>
            </span>

            <button
              onClick={scrollToTop}
              className="btn-icon"
              style={{ width: '34px', height: '34px' }}
              title="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
