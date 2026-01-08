# Redesign Plan for HostScope

## Branding Updates
- [ ] Update package.json: name to "hostscope", homepage to "https://hostscope.xyz"
- [ ] Create new logo SVG: server rack with magnifying glass
- [ ] Update public/favicon.svg with new logo
- [ ] Update public/manifest.json: name, icons
- [ ] Update src/components/scafold/Nav.astro: branding to "HostScope"
- [ ] Update src/components/homepage/HeroForm.astro: title to "HostScope", update tagline to hosting support focus
- [ ] Update src/components/homepage/AboutSection.astro: links, description to hosting diagnostics

## UI Redesign
- [ ] Update src/styles/colors.scss: dark theme colors (purple/blue gradients)
- [ ] Update src/styles/global.scss: dark background, modern fonts
- [ ] Update layouts and components for agent-mode UX: dense info, no marketing fluff
- [ ] Add dark mode toggle if needed

## Feature Additions (Hosting Support Focus)
- [ ] Add HTTP status checker
- [ ] Add multi-location site check
- [ ] Add rate limit diagnostics (429 analyzer)
- [ ] Add hosting fingerprint (Apache/Nginx detection)
- [ ] Add WordPress-specific checks
- [ ] Add email/DNS support toolkit
- [ ] Add customer explanation generator

## Testing
- [ ] Run locally to verify changes
- [ ] Check responsiveness and dark mode
