import React, { useRef } from 'react';
import { Search, Loader2, Sparkles, CornerDownLeft, XCircle, Globe, RotateCcw, FileSearch } from 'lucide-react';

export const RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA', 'ALL'];

export const EXAMPLE_DOMAINS = [
  { domain: 'google.com', label: 'google.com', type: 'A' },
  { domain: 'github.com', label: 'github.com', type: 'MX' },
  { domain: 'cloudflare.com', label: 'cloudflare.com', type: 'ALL' },
  { domain: 'wikipedia.org', label: 'wikipedia.org', type: 'NS' },
  { domain: 'microsoft.com', label: 'microsoft.com', type: 'TXT' },
];

export const EXAMPLE_IPS = [
  { ip: '192.178.211.139', label: '192.178.211.139', note: 'Google' },
  { ip: '8.8.8.8', label: '8.8.8.8', note: 'Google DNS' },
  { ip: '1.1.1.1', label: '1.1.1.1', note: 'Cloudflare' },
  { ip: '9.9.9.9', label: '9.9.9.9', note: 'Quad9' },
  { ip: '2001:4860:4860::8888', label: '2001:4860:4860::8888', note: 'Google IPv6' },
];

export default function HeroSection({
  mode = 'forward',
  onModeChange,
  domain,
  setDomain,
  recordType,
  setRecordType,
  onLookup,
  isLoading,
  inputRef,
}) {
  const localInputRef = useRef(null);
  const activeInputRef = inputRef || localInputRef;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onLookup();
    }
  };

  const handleExampleDomainClick = (exampleDomain, exampleType) => {
    setDomain(exampleDomain);
    if (exampleType) setRecordType(exampleType);
    if (activeInputRef.current) activeInputRef.current.focus();
    setTimeout(() => {
      onLookup(exampleDomain, exampleType || recordType, 'forward');
    }, 50);
  };

  const handleExampleIpClick = (exampleIp) => {
    setDomain(exampleIp);
    if (activeInputRef.current) activeInputRef.current.focus();
    setTimeout(() => {
      onLookup(exampleIp, 'PTR', 'reverse');
    }, 50);
  };

  const isReverse = mode === 'reverse';

  return (
    <section id="home" className="section" style={{ paddingTop: '50px', paddingBottom: '45px' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Feature Pill */}
        <div style={{ marginBottom: '20px' }}>
          <div className="cyber-badge">
            <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Dual Forward & Reverse DNS Resolution</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            maxWidth: '900px',
            margin: '0 auto 16px auto',
          }}
        >
          Discover What's Behind <span className="gradient-text">Every Domain & IP</span>
        </h1>

        {/* Description */}
        <p
          className="section-desc"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          Explore forward DNS records, perform reverse IP-to-hostname lookups, and inspect live routing configurations.
        </p>

        {/* Segmented Mode Selector: [ Forward DNS ] [ Reverse DNS ] */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              type="button"
              onClick={() => onModeChange('forward')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.92rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all var(--transition-fast)',
                backgroundColor: !isReverse ? 'var(--accent-blue)' : 'transparent',
                color: !isReverse ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: !isReverse ? '0 2px 12px rgba(56, 189, 248, 0.35)' : 'none',
              }}
            >
              <Globe size={16} />
              <span>Forward DNS</span>
              <span style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 500 }}>
                (Domain → Records)
              </span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('reverse')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.92rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all var(--transition-fast)',
                backgroundColor: isReverse ? 'var(--accent-blue)' : 'transparent',
                color: isReverse ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isReverse ? '0 2px 12px rgba(56, 189, 248, 0.35)' : 'none',
              }}
            >
              <RotateCcw size={16} />
              <span>Reverse DNS</span>
              <span style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 500 }}>
                (IP → Hostname)
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Container */}
        <div
          className="glass-card"
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            padding: '10px 14px',
            boxShadow: 'var(--shadow-glow)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-hover)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Search Icon & Input */}
            <div
              style={{
                flex: '1 1 320px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <Search size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
              <input
                ref={activeInputRef}
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isReverse
                    ? 'Enter an IP address (e.g. 192.178.211.139)'
                    : 'Enter domain name (e.g. google.com)'
                }
                disabled={isLoading}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontFamily: isReverse ? 'var(--font-mono)' : 'inherit',
                  fontWeight: 500,
                }}
              />
              {domain && (
                <button
                  type="button"
                  onClick={() => {
                    setDomain('');
                    if (activeInputRef.current) activeInputRef.current.focus();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  title="Clear input"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>

            {/* Record Type Dropdown (Forward mode) or Locked PTR Badge (Reverse mode) */}
            <div style={{ flex: '0 0 auto' }}>
              {!isReverse ? (
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  disabled={isLoading}
                  aria-label="Select Record Type"
                  style={{
                    padding: '13px 18px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  {RECORD_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        padding: '8px',
                      }}
                    >
                      {type === 'ALL' ? '⭐ ALL RECORDS' : `${type} RECORD`}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  style={{
                    padding: '12px 18px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="Reverse DNS queries look up PTR (Pointer) records"
                >
                  <FileSearch size={16} />
                  <span>PTR RECORD</span>
                </div>
              )}
            </div>

            {/* Lookup Action Button */}
            <div style={{ flex: '0 0 auto' }}>
              <button
                type="button"
                onClick={() => onLookup()}
                disabled={isLoading || !domain.trim()}
                className="btn btn-primary"
                style={{
                  padding: '13px 26px',
                  minWidth: '150px',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <span>{isReverse ? 'Reverse Lookup' : 'Lookup DNS'}</span>
                    <CornerDownLeft size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Shortcuts / Examples */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isReverse ? 'Try sample IPs:' : 'Try examples:'}
          </span>

          {!isReverse
            ? EXAMPLE_DOMAINS.map((item) => (
                <button
                  key={item.domain}
                  type="button"
                  onClick={() => handleExampleDomainClick(item.domain, item.type)}
                  disabled={isLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-blue)',
                      fontWeight: 700,
                    }}
                  >
                    {item.type}
                  </span>
                </button>
              ))
            : EXAMPLE_IPS.map((item) => (
                <button
                  key={item.ip}
                  type="button"
                  onClick={() => handleExampleIpClick(item.ip)}
                  disabled={isLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(0, 242, 254, 0.15)',
                      color: 'var(--accent-cyan)',
                      fontWeight: 600,
                    }}
                  >
                    {item.note}
                  </span>
                </button>
              ))}
        </div>
      </div>
    </section>
  );
}
