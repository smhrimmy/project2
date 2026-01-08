import middleware from './_common/middleware.js';
import { handler as sslHandler } from './ssl.js';
import { handler as dnsHandler } from './dns.js';
import { handler as statusHandler } from './status.js';

// Mock request/response objects for internal calls
const createMockReqRes = (url) => {
  const req = { query: { url } };
  const res = {
    statusCode: 200,
    body: null,
    status: (code) => { res.statusCode = code; return res; },
    json: (data) => { res.body = data; return res; }
  };
  return { req, res };
};

const batchCheckHandler = async (req, res) => {
  const body = req.body || (req.event && req.event.body ? JSON.parse(req.event.body) : {});
  const domains = body.domains || [];

  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    return { error: 'No domains provided' };
  }

  if (domains.length > 5) {
    return { error: 'Maximum 5 domains allowed per batch' };
  }

  const results = await Promise.all(domains.map(async (domain) => {
    const domainResults = { domain };
    
    // Normalize URL
    const url = domain.startsWith('http') ? domain : `https://${domain}`;

    try {
      // Run checks in parallel
      const [ssl, dns, status] = await Promise.all([
        // SSL Check
        (async () => {
          try {
            const { req, res } = createMockReqRes(url);
            await sslHandler(req, res);
            return res.body;
          } catch (e) { return { error: e.message }; }
        })(),
        // DNS Check
        (async () => {
          try {
            const { req, res } = createMockReqRes(domain.replace(/^https?:\/\//, ''));
            await dnsHandler(req, res);
            return res.body;
          } catch (e) { return { error: e.message }; }
        })(),
        // Status Check
        (async () => {
          try {
            const { req, res } = createMockReqRes(url);
            await statusHandler(req, res);
            return res.body;
          } catch (e) { return { error: e.message }; }
        })()
      ]);

      domainResults.ssl = ssl;
      domainResults.dns = dns;
      domainResults.status = status;
    } catch (err) {
      domainResults.error = err.message;
    }

    return domainResults;
  }));

  return { results };
};

export const handler = middleware(batchCheckHandler);
export default handler;
