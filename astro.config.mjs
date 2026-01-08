import { defineConfig } from 'astro/config';

// Integrations
import svelte from '@astrojs/svelte';
import react from "@astrojs/react";
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

// Adapter
// Using the Vercel adapter in static mode to ensure no serverless runtime errors.
import vercel from '@astrojs/vercel/static';

// Helper to get environment variables safely
const getEnv = (key, fallback) => {
  return process.env[key] || import.meta.env?.[key] || fallback;
};

// Site Configuration
const site = getEnv('SITE_URL', 'https://site-sleuth.xyz');
const base = getEnv('BASE_URL', '/');

// Export Astro configuration
export default defineConfig({
  // STRICT REQUIREMENT: Static output to avoid serverless runtime errors (_render nodejs18.x)
  output: 'static',
  
  // Base URL and Site URL for SEO/Sitemap
  base,
  site,

  // Integrations
  integrations: [
    svelte(), 
    react(), 
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }), 
    sitemap()
  ],

  // Adapter configuration
  // We use the static adapter to generate plain HTML/CSS/JS.
  // This removes any dependency on Node.js runtime versions at deployment time.
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  // Vite configuration
  vite: {
    envPrefix: ['VITE_', 'REACT_APP_', 'PUBLIC_'],
    build: {
      // Ensure we don't accidentally bundle server-side only packages
      rollupOptions: {
        external: ['puppeteer', 'chrome-aws-lambda', 'better-sqlite3']
      }
    }
  },

  // Strict image service to avoid serverless image optimization functions if not needed
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});
