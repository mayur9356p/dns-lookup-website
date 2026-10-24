/**
 * DNS API Client & Utility Functions
 */

// In development, Vite proxies /api to http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Perform DNS Lookup via backend
 * @param {string} domain 
 * @param {string} type 
 */
export async function lookupDns(domain, type = 'A') {
  const cleanDomain = domain.trim();
  const url = `${API_BASE_URL}/api/dns?domain=${encodeURIComponent(cleanDomain)}&type=${encodeURIComponent(type)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please verify the backend is running.');
    }
    throw err;
  }
}

/**
 * Perform Reverse DNS Lookup (IP -> Hostname) via backend
 * @param {string} ip
 */
export async function lookupReverseDns(ip) {
  const cleanIp = ip.trim();
  const url = `${API_BASE_URL}/api/reverse-dns?ip=${encodeURIComponent(cleanIp)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please verify the backend is running.');
    }
    throw err;
  }
}


/**
 * Check backend health
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Export records as JSON file
 */
export function downloadJsonFile(domain, type, data) {
  const filename = `${domain}_${type}_dns_records_${Date.now()}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export records as CSV file
 */
export function downloadCsvFile(domain, records) {
  const filename = `${domain}_dns_records_${Date.now()}.csv`;
  const headers = ['Type', 'Name', 'Value', 'TTL (seconds)', 'Priority'];
  
  const rows = records.map((rec) => [
    `"${(rec.type || '').replace(/"/g, '""')}"`,
    `"${(rec.name || '').replace(/"/g, '""')}"`,
    `"${(rec.value || '').replace(/"/g, '""')}"`,
    rec.ttl !== null && rec.ttl !== undefined ? rec.ttl : '',
    rec.priority !== null && rec.priority !== undefined ? rec.priority : '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  }
}
