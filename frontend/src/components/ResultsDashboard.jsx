import React, { useState } from 'react';
import {
  Clock,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  FileSpreadsheet,
  FileCode,
  RotateCw,
  Server,
  Layers,
  Info,
  Globe,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Shield,
} from 'lucide-react';
import { downloadJsonFile, downloadCsvFile, copyToClipboard } from '../services/dnsApi';

export default function ResultsDashboard({
  result,
  isLoading,
  onRefresh,
  onShowToast,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isCopiedPrimary, setIsCopiedPrimary] = useState(false);

  if (!result && !isLoading) {
    return null;
  }

  const isReverse = result?.mode === 'reverse' || result?.queryType === 'PTR';

  // Format TTL into human-readable representation
  const formatTtl = (ttl) => {
    if (ttl === null || ttl === undefined) return 'N/A';
    const seconds = Number(ttl);
    if (isNaN(seconds)) return `${ttl}s`;
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const rem = seconds % 60;
      return `${seconds}s (${mins}m${rem > 0 ? ` ${rem}s` : ''})`;
    }
    const hours = (seconds / 3600).toFixed(1);
    return `${seconds}s (~${hours}h)`;
  };

  // Copy single record value
  const handleCopyValue = async (value, index) => {
    try {
      await copyToClipboard(value);
      setCopiedIndex(index);
      if (onShowToast) onShowToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      if (onShowToast) onShowToast('Failed to copy to clipboard', 'error');
    }
  };

  // Copy primary hostname in reverse mode
  const handleCopyPrimaryHostname = async (hostname) => {
    try {
      await copyToClipboard(hostname);
      setIsCopiedPrimary(true);
      if (onShowToast) onShowToast(`Copied hostname '${hostname}'!`, 'success');
      setTimeout(() => setIsCopiedPrimary(false), 2000);
    } catch {
      if (onShowToast) onShowToast('Failed to copy hostname', 'error');
    }
  };

  // Copy all records formatted
  const handleCopyAll = async () => {
    if (!result?.records || result.records.length === 0) return;
    const formatted = result.records
      .map((r) => {
        const priority = r.priority !== null && r.priority !== undefined ? ` [Priority: ${r.priority}]` : '';
        const ttl = r.ttl !== null && r.ttl !== undefined ? ` (TTL: ${r.ttl}s)` : '';
        return `${r.type.padEnd(6)} ${r.name.padEnd(30)} ${r.value}${priority}${ttl}`;
      })
      .join('\n');

    try {
      await copyToClipboard(formatted);
      if (onShowToast) onShowToast(`Copied ${result.records.length} record(s) to clipboard!`, 'success');
    } catch {
      if (onShowToast) onShowToast('Failed to copy records', 'error');
    }
  };

  // Download Handlers
  const handleDownloadJson = () => {
    if (!result) return;
    const targetName = isReverse ? result.ip : result.domain;
    const queryType = isReverse ? 'PTR' : result.queryType;
    downloadJsonFile(targetName, queryType, result);
    if (onShowToast) onShowToast('Exported JSON successfully', 'success');
  };

  const handleDownloadCsv = () => {
    if (!result?.records || result.records.length === 0) return;
    const targetName = isReverse ? result.ip : result.domain;
    downloadCsvFile(targetName, result.records);
    if (onShowToast) onShowToast('Exported CSV successfully', 'success');
  };

  // Filter records based on active tab in ALL mode
  const recordsToDisplay = result?.records
    ? result.queryType === 'ALL' && activeTab !== 'ALL'
      ? result.records.filter((r) => r.type === activeTab)
      : result.records
    : [];

  // Identify distinct types present in ALL results
  const distinctTypes = result?.records
    ? Array.from(new Set(result.records.map((r) => r.type)))
    : [];

  return (
    <section className="section" style={{ paddingTop: '10px', paddingBottom: '70px' }}>
      <div className="container">
        {/* Dashboard Container */}
        <div
          className="glass-card"
          style={{
            padding: '28px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {/* Queried Target (Domain or IP) */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                {isReverse ? 'Queried IP Address' : 'Queried Domain'}
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{isReverse ? result?.ip : result?.domain || '—'}</span>
                {isReverse && result?.ipVersion && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-blue)',
                      fontWeight: 700,
                    }}
                  >
                    {result.ipVersion}
                  </span>
                )}
              </div>
            </div>

            {/* Query Mode */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Lookup Mode
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`type-badge type-badge-${isReverse ? 'PTR' : result?.queryType || 'A'}`}>
                  {isReverse ? 'PTR' : result?.queryType || '—'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {isReverse
                    ? 'Reverse DNS'
                    : result?.queryType === 'ALL'
                    ? 'Full Spectrum'
                    : 'Single Type'}
                </span>
              </div>
            </div>

            {/* DNS Status */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Resolver Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {result?.status === 'NOERROR' ? (
                  <span className="status-pill success">
                    <CheckCircle2 size={14} />
                    NOERROR (0)
                  </span>
                ) : result?.status === 'NXDOMAIN' ? (
                  <span className="status-pill danger">
                    <XCircle size={14} />
                    NXDOMAIN (3)
                  </span>
                ) : (
                  <span className="status-pill warning">
                    <AlertTriangle size={14} />
                    {result?.status || 'UNKNOWN'}
                  </span>
                )}
              </div>
            </div>

            {/* Latency */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Query Latency
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {result?.queryTimeMs !== undefined ? `${result.queryTimeMs} ms` : '—'}
                </span>
              </div>
            </div>

            {/* Records / Hostnames Count */}
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                {isReverse ? 'Hostnames Found' : 'Records Found'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={16} style={{ color: 'var(--accent-blue)' }} />
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  {result?.recordCount || 0}{' '}
                  {isReverse
                    ? result?.recordCount === 1
                      ? 'hostname'
                      : 'hostnames'
                    : result?.recordCount === 1
                    ? 'record'
                    : 'records'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '20px',
            }}
          >
            {/* Left: Tab filters or Label */}
            {!isReverse && result?.queryType === 'ALL' && distinctTypes.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>
                  Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('ALL')}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: activeTab === 'ALL' ? 'var(--accent-blue)' : 'var(--bg-card)',
                    color: activeTab === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                  }}
                >
                  All ({result.records.length})
                </button>
                {distinctTypes.map((t) => {
                  const count = result.records.filter((r) => r.type === t).length;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTab(t)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: activeTab === t ? 'var(--accent-blue)' : 'var(--bg-card)',
                        color: activeTab === t ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        fontWeight: 600,
                      }}
                    >
                      {t} ({count})
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isReverse ? (
                  <RotateCcw size={18} style={{ color: 'var(--accent-cyan)' }} />
                ) : (
                  <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
                )}
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {isReverse ? 'Reverse DNS (PTR) Resolution' : 'DNS Response Payload'}
                </span>
              </div>
            )}

            {/* Right: Functional Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {/* Copy All */}
              <button
                type="button"
                onClick={handleCopyAll}
                disabled={!result?.records || result.records.length === 0}
                className="btn btn-secondary btn-sm"
                title={isReverse ? 'Copy all resolved hostnames' : 'Copy all records as formatted table'}
              >
                <Copy size={14} />
                <span>{isReverse ? 'Copy Hostnames' : 'Copy All'}</span>
              </button>

              {/* Download JSON */}
              <button
                type="button"
                onClick={handleDownloadJson}
                disabled={!result}
                className="btn btn-secondary btn-sm"
                title="Export complete result as JSON file"
              >
                <FileCode size={14} />
                <span>JSON</span>
              </button>

              {/* Download CSV */}
              <button
                type="button"
                onClick={handleDownloadCsv}
                disabled={!result?.records || result.records.length === 0}
                className="btn btn-secondary btn-sm"
                title="Export records as CSV spreadsheet"
              >
                <FileSpreadsheet size={14} />
                <span>CSV</span>
              </button>

              {/* Refresh */}
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="btn btn-primary btn-sm"
                title="Refresh current DNS query"
              >
                <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* REVERSE DNS DISPLAY                                                 */}
          {/* =================================================================== */}
          {isReverse ? (
            <div>
              {/* If no PTR record found */}
              {result.recordCount === 0 || result.status === 'NXDOMAIN' ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '44px 24px',
                    backgroundColor: 'rgba(56, 189, 248, 0.03)',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Server size={44} style={{ color: 'var(--accent-blue)', margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                    No PTR Record Found
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 16px auto', lineHeight: 1.6 }}>
                    No authoritative PTR (Pointer) records were found for the IP address <code>{result.ip}</code>.
                    The query completed successfully, but the network provider has not assigned a reverse hostname to this address.
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <Info size={14} />
                    <span>Reverse Zone: <code>{result.arpa || `${result.ip}.in-addr.arpa`}</code></span>
                  </div>
                </div>
              ) : (
                /* PTR Records Found */
                <div>
                  {/* Primary Hostname Showcase Card */}
                  {result.hostnames && result.hostnames.length > 0 && (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(56, 189, 248, 0.03) 100%)',
                        border: '1px solid rgba(0, 242, 254, 0.3)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        boxShadow: '0 4px 20px rgba(0, 242, 254, 0.1)',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--accent-cyan)',
                            fontWeight: 700,
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Sparkles size={14} />
                          <span>Resolved Hostname (PTR)</span>
                        </div>
                        <div
                          style={{
                            fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                            wordBreak: 'break-all',
                          }}
                        >
                          {result.hostnames[0]}
                        </div>
                        {result.arpa && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                            Pointer: {result.arpa}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyPrimaryHostname(result.hostnames[0])}
                        className="btn btn-primary"
                        style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                      >
                        {isCopiedPrimary ? (
                          <>
                            <Check size={16} />
                            <span>Copied Hostname!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy Hostname</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Domain Association & FCrDNS Verification Panel */}
                  {result.verification && (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(12, 19, 38, 0.65)',
                        border: '1px solid var(--border-color)',
                        marginBottom: '24px',
                      }}
                    >
                      {/* Section Title & Status Badges */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                          marginBottom: '16px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={20} style={{ color: 'var(--accent-cyan)' }} />
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                            Domain Association & FCrDNS Verification
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {result.verification.fcrdns?.verified ? (
                            <span className="status-pill success" title="Forward-Confirmed Reverse DNS (FCrDNS) passed">
                              <CheckCircle2 size={13} />
                              FCrDNS Verified
                            </span>
                          ) : (
                            <span className="status-pill warning" title="Forward resolution did not match original IP">
                              <AlertTriangle size={13} />
                              FCrDNS Unverified
                            </span>
                          )}

                          {result.verification.google?.matchesCurrentGoogleDns && (
                            <span className="status-pill success" title="IP is in active google.com DNS records">
                              <CheckCircle2 size={13} />
                              Matches google.com DNS
                            </span>
                          )}

                          {result.verification.google?.isVerifiedGoogleIp && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                color: 'var(--accent-cyan)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                              }}
                            >
                              Google Infrastructure
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Explicit Requirement Banners */}
                      {result.verification.google?.googleRelatedMessage && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(56, 189, 248, 0.08)',
                            borderLeft: '4px solid var(--accent-cyan)',
                            marginBottom: '12px',
                          }}
                        >
                          <Info size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {result.verification.google.googleRelatedMessage}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                              Note: Google routes web traffic across its distributed <code>1e100.net</code> server infrastructure (named after 10<sup>100</sup> = 1 googol). Servers handling google.com requests reverse-resolve to specific node identifiers rather than the generic domain name.
                            </div>
                          </div>
                        </div>
                      )}

                      {result.verification.google?.googleDnsMatchMessage && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            borderLeft: '4px solid var(--accent-emerald)',
                            marginBottom: '12px',
                          }}
                        >
                          <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#34d399' }}>
                            {result.verification.google.googleDnsMatchMessage}
                          </span>
                        </div>
                      )}

                      {/* 3-Step Verification Details Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '12px',
                          marginTop: '14px',
                        }}
                      >
                        {/* Step 1: Reverse PTR */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            1. Reverse PTR Lookup
                          </div>
                          <div style={{ fontSize: '0.86rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                            {result.ip} → <span style={{ color: 'var(--accent-cyan)' }}>{result.verification.primaryHostname}</span>
                          </div>
                        </div>

                        {/* Step 2: FCrDNS Forward */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            2. Forward Confirmation (FCrDNS)
                          </div>
                          <div style={{ fontSize: '0.86rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                            {result.verification.primaryHostname} →{' '}
                            <span style={{ color: result.verification.fcrdns?.verified ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                              {result.verification.fcrdns?.forwardIps?.[0] || 'Unresolved'}
                            </span>{' '}
                            {result.verification.fcrdns?.verified ? '✓' : '✗'}
                          </div>
                        </div>

                        {/* Step 3: google.com Pool Match */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                            3. google.com Pool Match
                          </div>
                          <div style={{ fontSize: '0.86rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                            {result.verification.google?.matchesCurrentGoogleDns ? (
                              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Active in google.com DNS ✓</span>
                            ) : result.verification.google?.isVerifiedGoogleIp ? (
                              <span style={{ color: 'var(--accent-cyan)' }}>Verified Google Node (Pool Rotate)</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Non-Google Address</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PTR Table (Accommodates multiple hostnames if present) */}
                  <div className="table-responsive">
                    <table className="dns-table">
                      <thead>
                        <tr>
                          <th style={{ width: '90px' }}>Type</th>
                          <th style={{ width: '280px' }}>Reverse Pointer (ARPA)</th>
                          <th>Resolved Hostname</th>
                          <th style={{ width: '130px' }}>TTL</th>
                          <th style={{ width: '90px', textAlign: 'center' }}>Copy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.records.map((rec, idx) => {
                          const isCopied = copiedIndex === idx;

                          return (
                            <tr key={`${rec.value}-${idx}`}>
                              <td>
                                <span className="type-badge type-badge-PTR">
                                  PTR
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.86rem',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {rec.name}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.92rem',
                                    fontWeight: 600,
                                    color: 'var(--accent-cyan)',
                                  }}
                                >
                                  {rec.value}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.84rem',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {formatTtl(rec.ttl)}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleCopyValue(rec.value, idx)}
                                  className="btn-icon"
                                  style={{ width: '32px', height: '32px' }}
                                  title="Copy this hostname"
                                >
                                  {isCopied ? (
                                    <Check size={15} style={{ color: 'var(--accent-emerald)' }} />
                                  ) : (
                                    <Copy size={15} />
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =================================================================== */
            /* FORWARD DNS DISPLAY                                                 */
            /* =================================================================== */
            <div>
              {result?.status === 'NXDOMAIN' ? (
                /* NXDOMAIN State */
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    backgroundColor: 'rgba(244, 63, 94, 0.05)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <XCircle size={44} style={{ color: 'var(--accent-rose)', margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                    Domain Name Not Found (NXDOMAIN)
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 20px auto' }}>
                    The authoritative name servers report that <strong>{result.domain}</strong> does not exist.
                    Please check for typographical errors or verify that the domain has been registered.
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Info size={15} />
                    <span>Google DNS returned RCODE 3 (Non-Existent Domain)</span>
                  </div>
                </div>
              ) : recordsToDisplay.length === 0 ? (
                /* Empty Result State */
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    backgroundColor: 'rgba(56, 189, 248, 0.03)',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Server size={44} style={{ color: 'var(--accent-blue)', margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                    No {result?.queryType} Records Found
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 16px auto' }}>
                    The domain <strong>{result?.domain}</strong> exists and responded with <code>NOERROR</code>,
                    but no active <strong>{result?.queryType}</strong> records were returned.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Tip: Try querying <strong style={{ color: 'var(--accent-cyan)' }}>ALL</strong> or checking for <strong style={{ color: 'var(--accent-cyan)' }}>A</strong> / <strong style={{ color: 'var(--accent-cyan)' }}>NS</strong> records.
                  </p>
                </div>
              ) : (
                /* Table with Records */
                <div className="table-responsive">
                  <table className="dns-table">
                    <thead>
                      <tr>
                        <th style={{ width: '100px' }}>Type</th>
                        <th style={{ width: '220px' }}>Name / Host</th>
                        <th>Record Data / Target</th>
                        <th style={{ width: '130px' }}>TTL</th>
                        <th style={{ width: '100px' }}>Priority</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>Copy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordsToDisplay.map((rec, idx) => {
                        const isCopied = copiedIndex === idx;

                        return (
                          <tr key={`${rec.type}-${rec.name}-${rec.value}-${idx}`}>
                            {/* Type */}
                            <td>
                              <span className={`type-badge type-badge-${rec.type}`}>
                                {rec.type}
                              </span>
                            </td>

                            {/* Name */}
                            <td>
                              <div
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.86rem',
                                  color: 'var(--text-secondary)',
                                  wordBreak: 'break-all',
                                }}
                              >
                                {rec.name || result.domain}
                              </div>
                            </td>

                            {/* Value / Data */}
                            <td>
                              <div
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.9rem',
                                  color: 'var(--text-primary)',
                                  wordBreak: 'break-all',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px',
                                }}
                              >
                                <span style={{ fontWeight: 500 }}>{rec.value}</span>

                                {/* Additional metadata helpers */}
                                {rec.type === 'SOA' && rec.parsedDetails && (
                                  <div
                                    style={{
                                      fontSize: '0.78rem',
                                      color: 'var(--text-muted)',
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '10px',
                                      marginTop: '4px',
                                      padding: '8px 12px',
                                      backgroundColor: 'rgba(0,0,0,0.25)',
                                      borderRadius: 'var(--radius-sm)',
                                    }}
                                  >
                                    <span>
                                      <strong>Email:</strong> {rec.parsedDetails.responsibleEmail}
                                    </span>
                                    <span>
                                      <strong>Serial:</strong> {rec.parsedDetails.serial}
                                    </span>
                                    <span>
                                      <strong>Refresh:</strong> {rec.parsedDetails.refresh}s
                                    </span>
                                    <span>
                                      <strong>Retry:</strong> {rec.parsedDetails.retry}s
                                    </span>
                                  </div>
                                )}

                                {rec.type === 'TXT' && rec.parsedDetails && (
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    {rec.parsedDetails.isSpf && (
                                      <span
                                        style={{
                                          fontSize: '0.7rem',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                          color: '#34d399',
                                          fontWeight: 600,
                                        }}
                                      >
                                        SPF Policy
                                      </span>
                                    )}
                                    {rec.parsedDetails.isVerification && (
                                      <span
                                        style={{
                                          fontSize: '0.7rem',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          backgroundColor: 'rgba(56, 189, 248, 0.2)',
                                          color: '#38bdf8',
                                          fontWeight: 600,
                                        }}
                                      >
                                        Domain Verification
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* TTL */}
                            <td>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.84rem',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {formatTtl(rec.ttl)}
                              </span>
                            </td>

                            {/* Priority */}
                            <td>
                              {rec.priority !== null && rec.priority !== undefined ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                    color: '#fbbf24',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.82rem',
                                  }}
                                >
                                  ★ {rec.priority}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)' }}>—</span>
                              )}
                            </td>

                            {/* Individual Copy Button */}
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleCopyValue(rec.value, idx)}
                                className="btn-icon"
                                style={{ width: '32px', height: '32px' }}
                                title="Copy this record value"
                              >
                                {isCopied ? (
                                  <Check size={15} style={{ color: 'var(--accent-emerald)' }} />
                                ) : (
                                  <Copy size={15} />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
