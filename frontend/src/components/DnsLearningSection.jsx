import React, { useState } from 'react';
import {
  BookOpen,
  Network,
  Cpu,
  Mail,
  Server,
  FileText,
  GitBranch,
  ShieldAlert,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function DnsLearningSection({ onSelectType }) {
  const [expandedRecord, setExpandedRecord] = useState(null);

  const dnsGuides = [
    {
      type: 'A',
      title: 'A Record (Address Mapping)',
      subtitle: 'IPv4 Internet Address',
      icon: Network,
      color: '#38bdf8',
      explanation:
        'The most fundamental DNS record. It points a human-friendly domain name (like google.com) directly to a 32-bit numerical IPv4 address (like 142.251.220.78) where the web server lives.',
      analogy: 'Think of an A record like looking up a person\'s street address in a phonebook.',
      sampleFormat: 'example.com.  300  IN  A  93.184.216.34',
      importance: 'Without an A record, web browsers cannot locate the server hosting your website using standard IPv4.',
    },
    {
      type: 'AAAA',
      title: 'AAAA Record (Quad-A)',
      subtitle: 'IPv6 Next-Gen Address',
      icon: Cpu,
      color: '#c084fc',
      explanation:
        'Similar to an A record, but maps the domain to a 128-bit IPv6 address written in hexadecimal. IPv6 provides trillions of unique addresses to solve the global depletion of IPv4 addresses.',
      analogy: 'Like upgrading from a standard local zip code to ultra-precise satellite coordinates.',
      sampleFormat: 'example.com.  300  IN  AAAA  2606:2800:220:1:248:1893:25c8:1946',
      importance: 'Crucial for modern mobile networks, 5G routing, and compliance with modern internet standards.',
    },
    {
      type: 'MX',
      title: 'MX Record (Mail Exchange)',
      subtitle: 'Email Routing & Priority',
      icon: Mail,
      color: '#fbbf24',
      explanation:
        'Specifies which mail servers are authorized to accept incoming email messages for your domain. Each MX record includes a priority number (lower number = higher priority).',
      analogy: 'Like telling the delivery courier to try the main office first (priority 10), and if closed, try the backup warehouse (priority 20).',
      sampleFormat: 'example.com.  300  IN  MX  10 mail.example.com.',
      importance: 'Essential for receiving emails. Without valid MX records, emails sent to @yourdomain will bounce.',
    },
    {
      type: 'NS',
      title: 'NS Record (Name Server)',
      subtitle: 'Authoritative DNS Delegator',
      icon: Server,
      color: '#22d3ee',
      explanation:
        'Identifies the authoritative DNS servers that hold the official DNS records for a domain zone. When resolvers need answers about a domain, they query these nameservers.',
      analogy: 'The authoritative librarian who holds the actual master ledger for that specific district.',
      sampleFormat: 'example.com.  86400  IN  NS  ns1.nameserver.com.',
      importance: 'Delegates DNS control. If NS records point to incorrect servers, your entire website goes offline.',
    },
    {
      type: 'TXT',
      title: 'TXT Record (Text Strings)',
      subtitle: 'Authentication & Security',
      icon: FileText,
      color: '#34d399',
      explanation:
        'Carries machine-readable text data used for domain ownership verification (Google, Microsoft) and email anti-spoofing security protocols like SPF, DKIM, and DMARC.',
      analogy: 'A tamper-evident security seal or badge stuck to your domain proving you are the genuine owner.',
      sampleFormat: 'example.com.  300  IN  TXT  "v=spf1 include:_spf.google.com ~all"',
      importance: 'Prevents spammers from spoofing your domain name in phishing attacks.',
    },
    {
      type: 'CNAME',
      title: 'CNAME Record (Canonical Name)',
      subtitle: 'Domain Alias & Redirect',
      icon: GitBranch,
      color: '#fb7185',
      explanation:
        'Creates an alias from one domain name to another canonical (true) domain name. For example, pointing `www.example.com` to `example.com`.',
      analogy: 'A mail forwarding service where mail sent to your nickname is automatically forwarded to your legal name.',
      sampleFormat: 'www.example.com.  300  IN  CNAME  example.com.',
      importance: 'Allows multiple subdomains to point to a central domain without needing duplicate IP entries.',
    },
    {
      type: 'SOA',
      title: 'SOA Record (Start of Authority)',
      subtitle: 'Zone Administration Metadata',
      icon: ShieldAlert,
      color: '#a5b4fc',
      explanation:
        'Contains critical administrative details regarding the DNS zone, such as the primary nameserver, administrator email, serial number, and refresh/retry/expiry intervals for secondary DNS servers.',
      analogy: 'The legal birth certificate and management contract of a domain zone.',
      sampleFormat: 'example.com.  3600  IN  SOA  ns1.example.com. hostmaster.example.com. (2026102401 7200 3600 1209600 3600)',
      importance: 'Every valid DNS zone must have exactly one SOA record to maintain zone synchronization.',
    },
    {
      type: 'PTR',
      title: 'PTR Record (Pointer / Reverse DNS)',
      subtitle: 'IP Address to Hostname',
      icon: RotateCcw,
      color: '#00f2fe',
      explanation:
        'Resolves an IPv4 or IPv6 address back into its canonical registered hostname. PTR records are stored in the special reverse lookup zones in-addr.arpa (IPv4) and ip6.arpa (IPv6).',
      analogy: 'Like using a reverse phone directory to search who owns a specific telephone number.',
      sampleFormat: '139.211.178.192.in-addr.arpa.  1800  IN  PTR  lcbomp-in-f139.1e100.net.',
      importance: 'Essential for email security and deliverability. Receiving mail servers routinely reject emails from IPs lacking verified matching PTR records to block spam.',
    },
  ];

  const toggleExpand = (type) => {
    setExpandedRecord(expandedRecord === type ? null : type);
  };

  return (
    <section id="records-guide" className="section" style={{ backgroundColor: 'rgba(12, 19, 38, 0.4)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <p className="section-subtitle">DNS Academy</p>
          <h2 className="section-title">Understanding DNS Record Types</h2>
          <p className="section-desc">
            A student-friendly guide to how different DNS records orchestrate web traffic, email delivery, and security.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {dnsGuides.map((guide) => {
            const Icon = guide.icon;
            const isExpanded = expandedRecord === guide.type;

            return (
              <div
                key={guide.type}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: `1px solid var(--border-color)`,
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: `${guide.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${guide.color}35`,
                        }}
                      >
                        <Icon size={20} style={{ color: guide.color }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {guide.title}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {guide.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className={`type-badge type-badge-${guide.type}`}>
                      {guide.type}
                    </span>
                  </div>

                  {/* Plain English Explanation */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '16px',
                    }}
                  >
                    {guide.explanation}
                  </p>

                  {/* Analogy Box */}
                  <div
                    style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.05)',
                      borderLeft: `3px solid ${guide.color}`,
                      padding: '10px 14px',
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                      marginBottom: '16px',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      fontStyle: 'italic',
                    }}
                  >
                    💡 <strong>Real-World Analogy:</strong> {guide.analogy}
                  </div>

                  {/* Expandable Technical Details */}
                  {isExpanded && (
                    <div className="animate-fade-in" style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '4px',
                        }}
                      >
                        Sample Zone Syntax
                      </div>
                      <pre
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.35)',
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          color: guide.color,
                          overflowX: 'auto',
                          marginBottom: '12px',
                        }}
                      >
                        <code>{guide.sampleFormat}</code>
                      </pre>

                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>Why it matters:</strong> {guide.importance}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-color)',
                    marginTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(guide.type)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-blue)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                    }}
                  >
                    <span>{isExpanded ? 'Less Details' : 'Syntax & Usage'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectType(guide.type)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    Test {guide.type}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
