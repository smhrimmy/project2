import archives from '../src/api-functions/archives.js';
import batchCheck from '../src/api-functions/batch-check.js';
import blockLists from '../src/api-functions/block-lists.js';
import carbon from '../src/api-functions/carbon.js';
import cookies from '../src/api-functions/cookies.js';
import dnsServer from '../src/api-functions/dns-server.js';
import dns from '../src/api-functions/dns.js';
import dnssec from '../src/api-functions/dnssec.js';
import features from '../src/api-functions/features.js';
import firewall from '../src/api-functions/firewall.js';
import getIp from '../src/api-functions/get-ip.js';
import headers from '../src/api-functions/headers.js';
import hsts from '../src/api-functions/hsts.js';
import httpSecurity from '../src/api-functions/http-security.js';
import legacyRank from '../src/api-functions/legacy-rank.js';
import linkedPages from '../src/api-functions/linked-pages.js';
import mailConfig from '../src/api-functions/mail-config.js';
import ports from '../src/api-functions/ports.js';
import quality from '../src/api-functions/quality.js';
import rank from '../src/api-functions/rank.js';
import redirects from '../src/api-functions/redirects.js';
import robotsTxt from '../src/api-functions/robots-txt.js';
import securityTxt from '../src/api-functions/security-txt.js';
import sitemap from '../src/api-functions/sitemap.js';
import socialTags from '../src/api-functions/social-tags.js';
import ssl from '../src/api-functions/ssl.js';
import status from '../src/api-functions/status.js';
import techStack from '../src/api-functions/tech-stack.js';
import threats from '../src/api-functions/threats.js';
import tls from '../src/api-functions/tls.js';
import traceRoute from '../src/api-functions/trace-route.js';
import txtRecords from '../src/api-functions/txt-records.js';
import whois from '../src/api-functions/whois.js';
import wordpressCheck from '../src/api-functions/wordpress-check.js';

const handlers = {
  'archives': archives,
  'batch-check': batchCheck,
  'block-lists': blockLists,
  'carbon': carbon,
  'cookies': cookies,
  'dns-server': dnsServer,
  'dns': dns,
  'dnssec': dnssec,
  'features': features,
  'firewall': firewall,
  'get-ip': getIp,
  'headers': headers,
  'hsts': hsts,
  'http-security': httpSecurity,
  'legacy-rank': legacyRank,
  'linked-pages': linkedPages,
  'mail-config': mailConfig,
  'ports': ports,
  'quality': quality,
  'rank': rank,
  'redirects': redirects,
  'robots-txt': robotsTxt,
  'security-txt': securityTxt,
  'sitemap': sitemap,
  'social-tags': socialTags,
  'ssl': ssl,
  'status': status,
  'tech-stack': techStack,
  'threats': threats,
  'tls': tls,
  'trace-route': traceRoute,
  'txt-records': txtRecords,
  'whois': whois,
  'wordpress-check': wordpressCheck,
};

export default async function handler(req, res) {
  // Extract the function name from the URL
  const urlParts = new URL(req.url, `http://${req.headers.host}`);
  
  // pathSegments example: ['', 'api', 'ssl'] or ['', 'ssl'] depending on rewrite
  const pathSegments = urlParts.pathname.split('/').filter(Boolean);
  
  // We assume the LAST segment is the function name
  // e.g. /api/ssl -> ssl
  let functionName = pathSegments[pathSegments.length - 1];
  
  // If the path ends with 'index' (e.g. /api/index), we need to check query param or handle error
  // But our rewrite logic will likely map /api/ssl -> /api/index, preserving the URL?
  // Vercel rewrites: "destination": "/api/index" means the serverless function at api/index.js runs.
  // The req.url seen by the function is usually the *rewritten* URL (e.g. /api/index).
  // WAIT. If Vercel rewrites URL, req.url might be /api/index.
  // If so, we lose the function name.
  
  // Correction: Vercel rewrites usually preserve the original URL in `req.url` if we don't change it, 
  // OR we can pass it as a query param or path param.
  
  // Better approach:
  // Rewrite rule: "source": "/api/:match*", "destination": "/api/index?fn=:match*"
  // Then we can read `req.query.fn`.
  
  if (req.query.fn) {
    functionName = Array.isArray(req.query.fn) ? req.query.fn[0] : req.query.fn;
  }
  
  // Fallback: check path if query param is missing (though our config should ensure it)
  if (!functionName || functionName === 'index') {
     // try to parse from original url if possible, but let's rely on query param
     return res.status(400).json({ error: 'No function specified', debug: { url: req.url, query: req.query } });
  }

  const selectedHandler = handlers[functionName];

  if (!selectedHandler) {
    return res.status(404).json({ error: `Function '${functionName}' not found` });
  }

  // Execute the handler
  return selectedHandler(req, res);
}
