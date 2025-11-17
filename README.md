# f1-jobs

An outline for an automated (and ToS-conscious) "AI job agent" that pulls fresh postings, tailors resumes to each job description, and can assist or automate applications where allowed.

## 0. Reality check
Before building any automation, make sure the approach respects the terms of service for each target portal. Many company sites forbid scraping and automated submissions; violations can lead to blocks or bans. Aim to either (a) assist the user with one-click submission or (b) integrate only with platforms that explicitly allow automation.

> Note on scoring: real ATS platforms do not expose a formal "score." Any displayed match score is an internal heuristic based on keyword coverage and semantic similarity.

## Quickstart: run the demo app locally
This repo now ships a simple full-stack prototype (Express + React/Vite). It simulates jobs posted within the last 24 hours, lets you upload a resume, optimize it for a selected job, and records simulated applications. There is **no real portal automation**; add that only where ToS permits.

### Prerequisites
- Node.js 18+

### Backend (Express)
```bash
cd backend
npm install
npm start
# Backend runs at http://localhost:4000
```

### Frontend (React + Vite)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### Using the app
1. Open `http://localhost:5173`.
2. Browse jobs from the last 24 hours (pre-seeded demo data).
3. Paste and save a resume (plain text for now).
4. Select a job, pick a resume, and click **Optimize for this Job** to generate a mock tailored resume + heuristic match score.
5. Click **Apply (simulated)** to record the application in the dashboard.

## 1. High-level architecture
- **Frontend (Next.js/React):** authentication, jobs feed, resume manager, optimization/apply actions, and application history.
- **Backend API (FastAPI/NestJS):** auth, resume storage, job management, orchestration of crawlers/AI/applicants; endpoints like `/jobs`, `/resume`, `/optimize`, `/apply`, `/applications`.
- **Job crawler/aggregator:** hourly worker pulling the last 24 hours of roles via APIs or legally permitted scraping (Playwright/Puppeteer).
- **AI optimization service:** LLM-powered resume tailoring, cover letters, screening question drafts, and heuristic match scoring.
- **Application worker:** optional Playwright automation to log in, fill forms, upload tailored resumes, and submit when ToS and user consent allow.
- **Storage:** PostgreSQL/MySQL for structured data; S3/GCS for resumes, tailored outputs, and audit logs.
- **Secrets & security:** encrypted storage of portal credentials (KMS/Vault), minimal logging, and no plaintext passwords.

## 2. Data model (simplified)
- **users** — account metadata and auth.
- **resumes** — uploaded base resumes and extracted text.
- **job_sources** — configured portals/APIs with metadata (type, base URLs, enabled flags).
- **job_postings** — normalized jobs (title, company, location, URLs, posting timestamps, raw/parsed descriptions).
- **user_portal_credentials** — encrypted login data per portal (only if auto-login is enabled).
- **applications** — linkage of users to job postings plus status, method (`auto`/`manual`), match scores, and generated asset URLs.
- **application_logs** — chronological events (optimization, form fill, submit) for traceability.

## 3. Key flows
### A) Refresh jobs hourly
1. Scheduler triggers the crawler hourly.
2. For each source, fetch postings from the last 24 hours (API where possible; otherwise Playwright scraper respecting ToS).
3. Normalize and upsert into `job_postings`.
4. Frontend queries `/jobs?posted_within=24h` with filters (company, keywords, location, remote/on-site).

### B) Optimize resume for a JD
1. User selects a job and base resume, then clicks **Optimize**.
2. Backend sends JD text and resume text to the AI optimization service.
3. Service extracts requirements, tailors resume text, generates optional cover letter and screening answers, and computes a heuristic match score.
4. Backend renders a DOCX/PDF, stores it, and records the score in `applications`.
5. UI shows preview, score, and auto-apply threshold options.

### C) Apply to a job
- **Safer assist mode:** generate tailored assets and open the portal with autofill assistance; user performs final submit.
- **Auto-submit mode (higher risk):** Playwright worker logs in with stored credentials, fills fields, uploads tailored resume/cover letter, answers questions, submits, and updates application status. Use robust selectors, retries, and failure screenshots.

## 4. AI optimization approach
- Parse the JD for required/nice-to-have skills, level, and tools.
- Parse the resume for matching skills and experiences.
- Generate tailored resume sections (reordered bullets, JD terminology, factual only) plus optional cover letter and screening Q&A.
- Compute `match_score` via a weighted blend of keyword coverage, embedding similarity, and seniority alignment.

## 5. Suggested stack
- **Frontend:** Next.js, Tailwind, NextAuth/JWT.
- **Backend:** FastAPI (Python) or NestJS (Node); Celery/RQ or queues for background jobs.
- **Automation:** Playwright scripts per portal; Redis/RabbitMQ for job queues.
- **Infra:** PostgreSQL, Redis, S3-compatible storage, and KMS/Vault for secrets; deploy on ECS/Fargate or similar managed hosting.

## 6. Phased rollout
1. **Phase 1 (safe):** aggregator + AI optimizer; user submits manually with prepared assets.
2. **Phase 2 (semi-automated):** official APIs and/or browser extension for autofill, user still clicks submit.
3. **Phase 3 (automated where allowed):** full Playwright submission for approved portals with explicit user consent.
