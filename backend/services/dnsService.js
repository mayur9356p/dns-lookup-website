import net from 'net';
import dns from 'dns';

/**
 * DNS Service using Google Public DNS-over-HTTPS (DoH) API
 * Spec: https://developers.google.com/speed/public-dns/docs/doh/json
 */

const GOOGLE_DOH_URL = 'https://dns.google/resolve';
const TIMEOUT_MS = 6000;

// DNS RR Type numbers mapped to standard names
const DNS_TYPE_MAP = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  12: 'PTR',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  33: 'SRV',
  257: 'CAA',
};

// Reverse map for lookup by name
const DNS_NAME_TO_TYPE = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  PTR: 12,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  SRV: 33,
  CAA: 257,
};

// DNS RCODE meanings (RFC 1035 / RFC 6895)
const DNS_STATUS_CODES = {
  0: { code: 'NOERROR', description: 'DNS Query completed successfully' },
  1: { code: 'FORMERR', description: 'Format error in DNS query' },
  2: { code: 'SERVFAIL', description: 'Server failure or unreachable authoritative server' },
  3: { code: 'NXDOMAIN', description: 'Domain name does not exist' },
  4: { code: 'NOTIMP', description: 'Query type not implemented by DNS server' },
  5: { code: 'REFUSED', description: 'DNS query refused by server policy' },
  6: { code: 'YXDOMAIN', description: 'Name exists when it should not' },
  7: { code: 'YXRRSET', description: 'RR set exists when it should not' },
  8: { code: 'NXRRSET', description: 'RR set that should exist does not' },
  9: { code: 'NOTAUTH', description: 'Server not authoritative for zone' },
  10: { code: 'NOTZONE', description: 'Name not contained in zone' },
};

export const SUPPORTED_RECORD_TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

/**
 * Clean and validate domain name string
 */
export function sanitizeAndValidateDomain(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Domain name is required.' };
  }

  // Strip protocol (http://, https://) and trailing slashes/paths
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^(https?:\/\/)/i, '');
  domain = domain.split('/')[0];
  domain = domain.split(':')[0]; // strip port if any

  // Remove trailing dot if present
  if (domain.endsWith('.')) {
    domain = domain.slice(0, -1);
  }

  if (domain.length === 0) {
    return { valid: false, error: 'Domain name cannot be empty.' };
  }

  if (domain.length > 253) {
    return { valid: false, error: 'Domain name cannot exceed 253 characters.' };
  }

  // Domain regex: must contain at least one dot, valid labels
  // Allow internationalized domain names / standard labels
  const domainRegex = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63}(?<!-))*\.[a-z]{2,}$/i;

  if (!domainRegex.test(domain)) {
    return {
      valid: false,
      error: 'Invalid domain format. Example valid domains: google.com, github.com, cloudflare.com',
    };
  }

  return { valid: true, domain };
}

/**
 * Validate requested record type
 */
export function validateRecordType(typeInput) {
  if (!typeInput || typeof typeInput !== 'string') {
    return { valid: false, error: 'Record type is required.' };
  }

  const normalized = typeInput.trim().toUpperCase();
  const validTypes = [...SUPPORTED_RECORD_TYPES, 'ALL'];

  if (!validTypes.includes(normalized)) {
    return {
      valid: false,
      error: `Unsupported record type '${typeInput}'. Supported types: ${validTypes.join(', ')}`,
    };
  }

  return { valid: true, type: normalized };
}

/**
 * Format and parse individual DNS record based on type
 */
function normalizeRecord(item, defaultType) {
  const typeCode = item.type;
  const typeName = DNS_TYPE_MAP[typeCode] || defaultType || 'UNKNOWN';
  const name = item.name || '';
  const ttl = item.TTL !== undefined ? item.TTL : null;
  let rawData = item.data || '';
  let priority = null;
  let parsedDetails = null;

  // Handle specific record types
  if (typeName === 'MX') {
    // MX data is in format "<priority> <exchange>"
    const mxParts = rawData.trim().split(/\s+/);
    if (mxParts.length >= 2) {
      priority = parseInt(mxParts[0], 10);
      rawData = mxParts.slice(1).join(' ');
      parsedDetails = {
        priority,
        exchange: rawData,
      };
    }
  } else if (typeName === 'TXT') {
    // TXT data often enclosed in double quotes or multiple strings
    // e.g. "v=spf1 include:_spf.google.com ~all"
    let cleaned = rawData.trim();
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.substring(1, cleaned.length - 1);
    }
    cleaned = cleaned.replace(/\\"/g, '"');
    rawData = cleaned;
    parsedDetails = {
      isSpf: rawData.toLowerCase().startsWith('v=spf1'),
      isVerification: rawData.toLowerCase().includes('verification'),
    };
  } else if (typeName === 'SOA') {
    // SOA data is in format "<mname> <rname> <serial> <refresh> <retry> <expire> <minimum>"
    const soaParts = rawData.trim().split(/\s+/);
    if (soaParts.length >= 7) {
      // Hostmaster email replaces first dot with @
      const rawEmail = soaParts[1] || '';
      const formattedEmail = rawEmail.replace(/\./, '@').replace(/\.$/, '');
      parsedDetails = {
        primaryNameserver: soaParts[0],
        responsibleEmail: formattedEmail,
        serial: parseInt(soaParts[2], 10) || 0,
        refresh: parseInt(soaParts[3], 10) || 0,
        retry: parseInt(soaParts[4], 10) || 0,
        expire: parseInt(soaParts[5], 10) || 0,
        minimumTtl: parseInt(soaParts[6], 10) || 0,
      };
    }
  }

  return {
    name,
    type: typeName,
    typeCode,
    ttl,
    value: rawData,
    priority,
    parsedDetails,
  };
}

/**
 * Fetch a single record type from Google DoH
 */
export async function querySingleRecord(domain, type) {
  const startTime = Date.now();
  const url = `${GOOGLE_DOH_URL}?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/dns-json',
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Google DoH API returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const queryTimeMs = Date.now() - startTime;

    const statusCode = data.Status !== undefined ? data.Status : -1;
    const statusMeta = DNS_STATUS_CODES[statusCode] || {
      code: `CODE_${statusCode}`,
      description: 'Unknown DNS Status',
    };

    let records = [];
    if (data.Answer && Array.isArray(data.Answer)) {
      records = data.Answer.map((item) => normalizeRecord(item, type));
    }

    return {
      success: true,
      domain,
      queryType: type,
      status: statusMeta.code,
      statusCode,
      statusDescription: statusMeta.description,
      queryTimeMs,
      recordCount: records.length,
      records,
      comment: data.Comment || null,
    };
  } catch (err) {
    const queryTimeMs = Date.now() - startTime;
    const isTimeout = err.name === 'AbortError';

    return {
      success: false,
      domain,
      queryType: type,
      status: isTimeout ? 'TIMEOUT' : 'ERROR',
      statusCode: -1,
      statusDescription: isTimeout
        ? 'DNS query timed out after 6 seconds'
        : 'Failed to contact Google DNS-over-HTTPS resolver',
      queryTimeMs,
      recordCount: 0,
      records: [],
      error: isTimeout ? 'DNS query timed out' : 'Resolver failure',
    };
  }
}

/**
 * Fetch ALL supported DNS records concurrently
 */
export async function queryAllRecords(domain) {
  const startTime = Date.now();

  const queries = SUPPORTED_RECORD_TYPES.map((type) => querySingleRecord(domain, type));
  const results = await Promise.allSettled(queries);

  const queryTimeMs = Date.now() - startTime;
  const allRecords = [];
  const groupedRecords = {};
  const typeStatuses = {};

  let successfulQueries = 0;
  let isNxDomain = false;

  results.forEach((res, index) => {
    const type = SUPPORTED_RECORD_TYPES[index];
    groupedRecords[type] = [];

    if (res.status === 'fulfilled' && res.value) {
      const val = res.value;
      typeStatuses[type] = val.status;

      if (val.status === 'NXDOMAIN') {
        isNxDomain = true;
      }

      if (val.success) {
        successfulQueries++;
        if (val.records && val.records.length > 0) {
          val.records.forEach((rec) => {
            allRecords.push(rec);
            groupedRecords[type].push(rec);
          });
        }
      }
    } else {
      typeStatuses[type] = 'ERROR';
    }
  });

  const overallStatus = isNxDomain && allRecords.length === 0 ? 'NXDOMAIN' : 'NOERROR';
  const statusMeta = isNxDomain && allRecords.length === 0
    ? DNS_STATUS_CODES[3]
    : DNS_STATUS_CODES[0];

  return {
    success: true,
    domain,
    queryType: 'ALL',
    status: overallStatus,
    statusCode: overallStatus === 'NXDOMAIN' ? 3 : 0,
    statusDescription: statusMeta.description,
    queryTimeMs,
    recordCount: allRecords.length,
    records: allRecords,
    groupedRecords,
    typeStatuses,
    queriedTypes: SUPPORTED_RECORD_TYPES,
  };
}

/**
 * Validate IPv4 or IPv6 address string
 */
export function validateIpAddress(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'IP address is required.' };
  }

  const cleanIp = input.trim();
  const ipType = net.isIP(cleanIp);

  if (ipType === 4) {
    return { valid: true, ip: cleanIp, version: 'IPv4' };
  } else if (ipType === 6) {
    return { valid: true, ip: cleanIp, version: 'IPv6' };
  }

  return {
    valid: false,
    error: 'Invalid IP address format. Please enter a valid IPv4 (e.g. 192.178.211.139 or 8.8.8.8) or IPv6 address (e.g. 2001:4860:4860::8888).',
  };
}

/**
 * Convert an IPv4 or IPv6 address into its standard ARPA reverse lookup name
 */
export function convertIpToArpa(ip, version) {
  const cleanIp = ip.trim();
  if (version === 'IPv4') {
    return cleanIp.split('.').reverse().join('.') + '.in-addr.arpa';
  }

  // IPv6 expansion
  const parts = cleanIp.toLowerCase().split('::');
  const left = parts[0] ? parts[0].split(':') : [];
  const right = parts[1] ? parts[1].split(':') : [];
  const missing = 8 - (left.length + right.length);
  const middle = [];
  for (let i = 0; i < missing; i++) {
    middle.push('0000');
  }
  const full = [...left, ...middle, ...right].map((p) => p.padStart(4, '0')).join('');
  return full.split('').reverse().join('.') + '.ip6.arpa';
}

/**
 * Forward-Confirmed Reverse DNS (FCrDNS) & Domain Association Verification
 * Validates:
 * 1. Forward lookup of PTR hostname -> compares resolved IPs with original IP (FCrDNS)
 * 2. Forward lookup of google.com (A & AAAA) -> compares with original IP
 * 3. Inspects if PTR hostname belongs to Google infrastructure (1e100.net, google.com)
 */
export async function verifyReverseDnsIp(ip, hostnames, version) {
  if (!hostnames || hostnames.length === 0) {
    return null;
  }

  const primaryHostname = hostnames[0];
  const resolver = new dns.promises.Resolver();
  resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

  // 1. Forward-Confirmed Reverse DNS (FCrDNS): Forward resolve the PTR hostname
  let forwardIps = [];
  try {
    const [ipv4Res, ipv6Res] = await Promise.allSettled([
      resolver.resolve4(primaryHostname),
      resolver.resolve6(primaryHostname),
    ]);

    if (ipv4Res.status === 'fulfilled' && Array.isArray(ipv4Res.value)) {
      forwardIps.push(...ipv4Res.value);
    }
    if (ipv6Res.status === 'fulfilled' && Array.isArray(ipv6Res.value)) {
      forwardIps.push(...ipv6Res.value);
    }
  } catch {
    // Forward resolution may fail if hostname has no A/AAAA records
  }

  const fcrdnsVerified = forwardIps.includes(ip);

  // 2. Query current google.com A & AAAA records to verify live pool membership
  // Query both system resolver and public Google DNS resolver to handle Anycast pools & DNS caching
  let currentGoogleIps = [];
  try {
    const publicResolver = new dns.promises.Resolver();
    publicResolver.setServers(['8.8.8.8', '8.8.4.4']);

    const [sysA, sysAAAA, pubA, pubAAAA] = await Promise.allSettled([
      dns.promises.resolve4('google.com'),
      dns.promises.resolve6('google.com'),
      publicResolver.resolve4('google.com'),
      publicResolver.resolve6('google.com'),
    ]);

    const ipSet = new Set();
    [sysA, sysAAAA, pubA, pubAAAA].forEach((res) => {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        res.value.forEach((v) => ipSet.add(v));
      }
    });

    currentGoogleIps = Array.from(ipSet);
  } catch {
    // google.com query fallback
  }

  const matchesCurrentGoogleDns = currentGoogleIps.includes(ip);

  // 3. Google Infrastructure verification (e.g. 1e100.net or google.com domains)
  const cleanHost = primaryHostname.toLowerCase();
  const is1e100 = cleanHost.endsWith('.1e100.net') || cleanHost === '1e100.net';
  const isGoogleDomain =
    is1e100 ||
    cleanHost.endsWith('.google.com') ||
    cleanHost === 'google.com' ||
    cleanHost.endsWith('.googleusercontent.com') ||
    cleanHost === 'dns.google';

  const isVerifiedGoogleIp = isGoogleDomain && (fcrdnsVerified || matchesCurrentGoogleDns);

  // Messages explicitly specified in requirement
  let googleRelatedMessage = null;
  if (isVerifiedGoogleIp) {
    googleRelatedMessage = `Google-related IP verified. PTR hostname: ${primaryHostname}. The IP does not necessarily reverse-resolve to google.com.`;
  }

  let googleDnsMatchMessage = null;
  if (matchesCurrentGoogleDns) {
    googleDnsMatchMessage = "This IP currently appears in google.com's DNS results.";
  }

  return {
    primaryHostname,
    fcrdns: {
      verified: fcrdnsVerified,
      forwardIps,
      matchesOriginalIp: fcrdnsVerified,
    },
    google: {
      isGoogleInfrastructure: is1e100,
      isVerifiedGoogleIp,
      matchesCurrentGoogleDns,
      googleDomain: 'google.com',
      currentGoogleIps,
      googleRelatedMessage,
      googleDnsMatchMessage,
    },
  };
}

/**
 * Perform Reverse DNS Lookup (IP -> Hostname PTR)
 * Resolves all associated hostnames using Google DoH and Node.js Resolver fallback
 * Performs FCrDNS verification and Google infrastructure domain correlation
 */
export async function queryReverseDns(rawIp) {
  const startTime = Date.now();
  const ipCheck = validateIpAddress(rawIp);
  if (!ipCheck.valid) {
    return {
      success: false,
      ip: rawIp,
      error: ipCheck.error,
      code: 'INVALID_IP',
    };
  }

  const { ip, version } = ipCheck;
  const arpaName = convertIpToArpa(ip, version);

  try {
    // 1. Query Google DoH PTR lookup
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const dohUrl = `${GOOGLE_DOH_URL}?name=${encodeURIComponent(arpaName)}&type=PTR`;
    let dohData = null;

    try {
      const response = await fetch(dohUrl, {
        method: 'GET',
        headers: { Accept: 'application/dns-json' },
        signal: controller.signal,
      });
      if (response.ok) {
        dohData = await response.json();
      }
    } catch {
      // DoH network failure - fallback to Node resolver below
    } finally {
      clearTimeout(timer);
    }

    // Check if DoH returned valid PTR answers
    if (dohData && dohData.Answer && Array.isArray(dohData.Answer) && dohData.Answer.length > 0) {
      const records = dohData.Answer.map((item) => {
        let hostname = item.data || '';
        if (hostname.endsWith('.')) hostname = hostname.slice(0, -1);
        return {
          name: item.name || `${arpaName}.`,
          type: 'PTR',
          typeCode: 12,
          ttl: item.TTL !== undefined ? item.TTL : null,
          value: hostname,
          priority: null,
        };
      });

      const hostnames = Array.from(new Set(records.map((r) => r.value).filter(Boolean)));

      // Perform FCrDNS verification & Google domain correlation
      const verification = await verifyReverseDnsIp(ip, hostnames, version);
      const queryTimeMs = Date.now() - startTime;

      return {
        success: true,
        mode: 'reverse',
        ip,
        ipVersion: version,
        arpa: arpaName,
        queryType: 'PTR',
        status: 'NOERROR',
        statusCode: 0,
        statusDescription: 'DNS Query completed successfully',
        queryTimeMs,
        recordCount: records.length,
        hostnames,
        records,
        verification,
      };
    }

    // 2. Fallback to Node.js Resolver (configured with Google & Cloudflare Public DNS)
    try {
      const resolver = new dns.promises.Resolver();
      resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
      const nodeHostnames = await resolver.reverse(ip);

      if (nodeHostnames && nodeHostnames.length > 0) {
        const records = nodeHostnames.map((hn) => ({
          name: `${arpaName}.`,
          type: 'PTR',
          typeCode: 12,
          ttl: 300,
          value: hn.endsWith('.') ? hn.slice(0, -1) : hn,
          priority: null,
        }));

        const cleanHostnames = records.map((r) => r.value);

        // Perform FCrDNS verification & Google domain correlation
        const verification = await verifyReverseDnsIp(ip, cleanHostnames, version);
        const queryTimeMs = Date.now() - startTime;

        return {
          success: true,
          mode: 'reverse',
          ip,
          ipVersion: version,
          arpa: arpaName,
          queryType: 'PTR',
          status: 'NOERROR',
          statusCode: 0,
          statusDescription: 'DNS Query completed successfully',
          queryTimeMs,
          recordCount: records.length,
          hostnames: cleanHostnames,
          records,
          verification,
        };
      }
    } catch {
      // ENOTFOUND, ENODATA, etc.
    }

    // No PTR record exists for this IP
    const statusCode = dohData && dohData.Status !== undefined ? dohData.Status : 3;
    const isNxDomain = statusCode === 3;

    return {
      success: true,
      mode: 'reverse',
      ip,
      ipVersion: version,
      arpa: arpaName,
      queryType: 'PTR',
      status: isNxDomain ? 'NXDOMAIN' : 'NOERROR',
      statusCode: isNxDomain ? 3 : 0,
      statusDescription: 'No PTR record found for this IP address',
      queryTimeMs: Date.now() - startTime,
      recordCount: 0,
      hostnames: [],
      records: [],
      verification: null,
    };
  } catch {
    return {
      success: false,
      mode: 'reverse',
      ip,
      ipVersion: version,
      queryType: 'PTR',
      status: 'ERROR',
      statusCode: -1,
      statusDescription: 'Resolver failure while processing reverse DNS',
      queryTimeMs: Date.now() - startTime,
      recordCount: 0,
      hostnames: [],
      records: [],
      error: 'Failed to contact reverse DNS resolver',
      verification: null,
    };
  }
}


