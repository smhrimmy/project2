import axios from 'axios';
import middleware from './_common/middleware.js';

const LATEST_WP_VERSION = "6.4.2"; // Hardcoded for now, ideally fetched from WP API

const wordpressCheckHandler = async (url) => {
  const results = {
    isWordPress: false,
    version: null,
    needsUpdate: false,
    latestVersion: LATEST_WP_VERSION,
    theme: null,
    pluginCount: 0,
    phpVersion: null,
    errors: [],
    securityIssues: [],
    performanceHints: []
  };

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HostScope/1.0; +https://hostscope.xyz)'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 600; // Resolve even if 404/500
      }
    });

    const html = typeof response.data === 'string' ? response.data : '';
    const headers = response.headers;

    // Check for Common Errors
    if (response.status >= 500) {
      results.errors.push({ type: 'server', message: `Server returned status code ${response.status}` });
    }
    if (!html && response.status === 200) {
      results.errors.push({ type: 'whitescreen', message: 'White screen of death (Empty response)' });
    }
    if (html.includes('Error establishing database connection')) {
      results.errors.push({ type: 'database', message: 'Error establishing database connection' });
    }
    if (html.includes('Fatal error')) {
      results.errors.push({ type: 'fatal', message: 'PHP Fatal error detected in output' });
    }

    // WordPress Detection
    if (html.includes('/wp-content/') || html.includes('wp-includes') || html.includes('generator" content="WordPress')) {
      results.isWordPress = true;
    }

    // Version Detection
    const generatorMatch = html.match(/<meta name="generator" content="WordPress ([0-9.]+)"/);
    if (generatorMatch) {
      results.version = generatorMatch[1];
    } else {
      // Try fetching readme.html as fallback
      try {
        const readmeRes = await axios.get(`${url}/readme.html`, { timeout: 3000 });
        const versionMatch = readmeRes.data.match(/<br \/> Version ([0-9.]+)/);
        if (versionMatch) results.version = versionMatch[1];
      } catch (e) {
        // Ignore
      }
    }

    if (results.version) {
      results.needsUpdate = results.version !== LATEST_WP_VERSION;
    }

    // Theme Detection
    const themeMatch = html.match(/\/wp-content\/themes\/([a-zA-Z0-9_-]+)\//);
    if (themeMatch) {
      results.theme = themeMatch[1];
    }

    // Plugin Count
    const pluginMatches = html.match(/\/wp-content\/plugins\/([a-zA-Z0-9_-]+)\//g);
    if (pluginMatches) {
      const uniquePlugins = new Set(pluginMatches.map(p => p.split('/')[3]));
      results.pluginCount = uniquePlugins.size;
    }

    // PHP Version
    if (headers['x-powered-by']) {
      const phpMatch = headers['x-powered-by'].match(/PHP\/([0-9.]+)/);
      if (phpMatch) results.phpVersion = phpMatch[1];
    }

    // Security Checks
    try {
      const wpConfigRes = await axios.get(`${url}/wp-config.php`, { timeout: 3000, validateStatus: () => true });
      if (wpConfigRes.status === 200 && wpConfigRes.data.includes('define(')) {
        results.securityIssues.push('wp-config.php is publicly accessible and readable!');
      }
    } catch (e) {}

    // Performance Hints
    if (html.length > 5 * 1024 * 1024) { // 5MB
      results.performanceHints.push('Page size is very large (>5MB)');
    }
    if (!headers['cache-control'] && !headers['expires']) {
      results.performanceHints.push('No caching headers detected');
    }

    return results;

  } catch (err) {
    return { error: `Failed to fetch URL: ${err.message}` };
  }
};

export const handler = middleware(wordpressCheckHandler);
export default handler;
