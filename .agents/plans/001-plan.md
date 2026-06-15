# [SEQ-PRO] Plan 001 - Codzienny Asystent Nawożenia

## Goals
- [x] Setup React with Vite and Tailwind CSS.
- [x] Configure Design Tokens in `/home/tkogut/projects/ogrodnik-4-0/design-tokens.md` to match green ecological aesthetics.
- [x] Implement the 7-day fertilization schedule logic.
- [x] Build the main dashboard with device date, date validation (2026-06-25 to 2026-08-31), current day card, and Tuesday alert.
- [x] Build the +3 days schedule preview calendar.
- [x] Create PWA capabilities (manifest, service worker, install instructions).
- [x] Containerize with Docker, Docker Compose, and Nginx.
- [x] Document deployment steps.

## Steps
1. **Initialize Project & Install Dependencies** [x]
   - Initialize npm project.
   - Install React, Tailwind CSS, Vite, Lucide React (for eco icons).
2. **Update Design Tokens** [x]
   - Update `/home/tkogut/projects/ogrodnik-4-0/design-tokens.md` to reflect ecological green palette.
3. **Core App Logic & Components** [x]
   - Design helper module for date validation & scheduling.
   - Create main UI components using standard terminal file streams.
4. **PWA Integration** [x]
   - Create manifest.json.
   - Create service worker (sw.js) for caching.
   - Add prompt hook for installation support.
5. **Dockerization** [x]
   - Add Dockerfile (multi-stage).
   - Add docker-compose.yml and nginx.conf.
6. **Validation & Verification** [x]
   - Run production build.
   - Verify offline support, audit PWA, and build Docker containers.
7. **Documentation** [x]
   - Write instructions in README.md.
