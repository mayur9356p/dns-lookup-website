import { Router } from 'express';
import {
  sanitizeAndValidateDomain,
  validateRecordType,
  querySingleRecord,
  queryAllRecords,
  validateIpAddress,
  queryReverseDns,
  SUPPORTED_RECORD_TYPES,
} from '../services/dnsService.js';

const router = Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'DNS Lookup API',
    resolver: 'Google Public DNS-over-HTTPS & Node DNS Resolver',
    timestamp: new Date().toISOString(),
    supportedModes: ['forward', 'reverse'],
    supportedTypes: [...SUPPORTED_RECORD_TYPES, 'ALL', 'PTR'],
    reverseEndpoint: '/api/reverse-dns?ip=192.178.211.139',
  });
});

/**
 * DNS Lookup endpoint
 * GET /api/dns?domain=google.com&type=A
 */
router.get('/dns', async (req, res) => {
  try {
    const rawDomain = req.query.domain;
    const rawType = req.query.type || 'A';

    // Domain validation
    const domainCheck = sanitizeAndValidateDomain(rawDomain);
    if (!domainCheck.valid) {
      return res.status(400).json({
        success: false,
        error: domainCheck.error,
        code: 'INVALID_DOMAIN',
      });
    }

    // Record type validation
    const typeCheck = validateRecordType(rawType);
    if (!typeCheck.valid) {
      return res.status(400).json({
        success: false,
        error: typeCheck.error,
        code: 'INVALID_RECORD_TYPE',
      });
    }

    const { domain } = domainCheck;
    const { type } = typeCheck;

    let result;
    if (type === 'ALL') {
      result = await queryAllRecords(domain);
    } else {
      result = await querySingleRecord(domain, type);
    }

    // Determine HTTP status code based on result
    // In DNS, NXDOMAIN or 0 records is a valid query response, not an HTTP 500 error
    return res.status(200).json(result);
  } catch (err) {
    // Catch-all: Never expose stack trace to client
    console.error('[DNS_ROUTE_ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your DNS query.',
      code: 'SERVER_ERROR',
    });
  }
});

/**
 * Reverse DNS Lookup endpoint
 * GET /api/reverse-dns?ip=192.178.211.139
 * Alias: GET /api/reverse?ip=192.178.211.139
 */
const handleReverseDns = async (req, res) => {
  try {
    const rawIp = req.query.ip;

    if (!rawIp) {
      return res.status(400).json({
        success: false,
        error: 'IP address is required. Example: /api/reverse-dns?ip=192.178.211.139',
        code: 'MISSING_IP',
      });
    }

    const ipCheck = validateIpAddress(rawIp);
    if (!ipCheck.valid) {
      return res.status(400).json({
        success: false,
        error: ipCheck.error,
        code: 'INVALID_IP',
      });
    }

    const result = await queryReverseDns(ipCheck.ip);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[REVERSE_DNS_ROUTE_ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your reverse DNS query.',
      code: 'SERVER_ERROR',
    });
  }
};

router.get('/reverse-dns', handleReverseDns);
router.get('/reverse', handleReverseDns);

export default router;

