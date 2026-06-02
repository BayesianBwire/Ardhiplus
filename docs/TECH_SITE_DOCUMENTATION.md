# Ardhi Plus — Technical Reference

This document is the authoritative technical reference for developers and operators. It documents architecture, setup, deployment, security posture, administrative flows, API surface, and developer workflows. Be precise when following commands — file paths and environment variables below match the repository.

**Quick summary**
- Backend: Python 3.10+ Flask application in `server.py` using SQLAlchemy and Flask-Migrate.
- Frontend: Jinja2 templates in `templates/` for the server-rendered site and a Vite + React app under `src/` for interactive components.
- Database: PostgreSQL in production (configured via `DATABASE_URL` or `SQLALCHEMY_DATABASE_URI`), optional SQLite for local development (`ALLOW_SQLITE_DEV=1`).
- Auth: session-based pages plus JWT access/refresh tokens for API usage. Passwords hashed with Werkzeug.

---

## Repository layout (important files)
- [server.py](server.py): Flask app entrypoint, models, routes, auth helpers, and admin API.
- [requirements.txt](requirements.txt): Python dependencies used by the backend.
- [create_tech_user.py](create_tech_user.py): Helper that creates/updates the `tech` user (prints a temporary password).
- [migrations/](migrations): Alembic/Flask-Migrate files for DB schema changes.
- [templates/](templates): Jinja2 templates used by Flask for page rendering (index, listings, admin, tech, etc.).
- [static/](static): Compiled/served static assets. `static/site.webmanifest` and generated favicons live here.
- [src/](src): Optional React + TypeScript frontend (Vite). Useful for building client-side SPA parts.
- [tests/](tests): Pytest tests for backend behavior.
- [docs/TECH_SITE_DOCUMENTATION.md](docs/TECH_SITE_DOCUMENTATION.md): THIS file.

---

## Environment & configuration
All environment variables are read by `server.py` at startup. Required/important vars:

- `SQLALCHEMY_DATABASE_URI` or `DATABASE_URL` (required in production) — PostgreSQL URI (scheme must start with `postgresql://`).
- `FLASK_SECRET_KEY` — Flask session secret (defaults to `dev-secret-key-change-me` if missing; change for production).
- `JWT_SECRET` — secret used to sign JWTs (change in production).
- `MESSAGE_KEY` — Fernet key for encrypting application messages (optional; auto-generated if missing).
- `RESEND_API_KEY` — API key for Resend (used by `send_email`). If unset, email sending via Resend is disabled.
- SMTP settings (if using SMTP instead of Resend): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_SENDER`.
- `SESSION_LIFETIME_SECONDS` — number of seconds for server session lifetime (defaults to 7200).
- `ALLOW_SQLITE_DEV=1` and `SKIP_DB_CHECK=1` — enable local SQLite fallback and skip Postgres connectivity checks (use only for local development).

Production checklist:
- Provide a real Postgres URI via `DATABASE_URL` or `SQLALCHEMY_DATABASE_URI`.
- Set `FLASK_SECRET_KEY` and `JWT_SECRET` to strong, random values.
- Configure `RESEND_API_KEY` or SMTP credentials for outgoing email.
- Set `ENV`/process manager configs for robust process restarts.

---

## Local development

Backend (Python)

1. Create a Python virtual environment and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Configure a local `.env` for development. Minimal `.env` content for local dev using SQLite (safe for quick tests only):

```
ALLOW_SQLITE_DEV=1
SKIP_DB_CHECK=1
FLASK_SECRET_KEY=dev-secret
JWT_SECRET=dev-jwt
```

3. Run the app locally:

```powershell
python server.py
```

This starts Flask on `http://127.0.0.1:5000` with auto-initialized DB tables (if they do not exist).

Frontend (React / Vite)

The repository contains a Vite + React app under `src/` for interactive components. To run it in development:

```bash
# from repo root
npm install
npm run dev
```

Build production frontend assets with:

```bash
npm run build
```

The Flask server serves `static/` assets and `templates/`. If you build the Vite app, copy the build outputs into `static/`/`public/` as your deployment process requires.

---

## Database migrations
The app uses Flask-Migrate (Alembic). Typical workflow:

```bash
# ensure virtualenv active and requirements installed
flask db init        # one-time only (migrations/ already present in repo)
flask db migrate -m "describe change"
flask db upgrade
```

Note: `server.py` sets `app.config['SQLALCHEMY_DATABASE_URI']` at import time. Ensure `DATABASE_URL`/`SQLALCHEMY_DATABASE_URI` is set before running migrations.

---

## Running tests
Pytest is used. Run:

```bash
pip install -r requirements.txt  # includes pytest
pytest -q
```

Tests are in [tests/](tests). They exercise auth flows and API endpoints.

---

## Admin / Tech workflows

Roles:
- `superadmin`: full control.
- `admin`: admin UI and API access to user/listing management.
- `tech`: maintenance role; can access `/tech` and call `suspend_all`.

Key admin endpoints:
- `GET /api/admin/analytics` — returns dashboards metrics and recommendations.
- `GET /api/audit` — returns recent audit logs (requires admin or tech via JWT or session).
- `POST /api/admin/users` — create admin users (returns `temp_password` in response). Requires admin role.
- `POST /api/admin/reset_user_password` — reset by email (requires tech/admin session and CSRF).
- `POST /api/admin/suspend_all` — tech-only emergency suspend action.

User creation (admin flow):
- Admin calls `POST /api/admin/users` with `{name,email,role}`. If `password` omitted, server generates one and stores it as `temp_password` field; the API returns it in the JSON response for one-time display.
- The operator must convey the temporary password via an out-of-band secure channel.

Password reset policy:
- Public password reset endpoints are intentionally disabled. The `/forgot-password` and `/reset-password` routes render explanatory messages directing users to `tech@ardhiplus.co.ke`.
- Admins and `tech` can reset passwords via admin APIs; the transient `temp_password` is stored in the DB and is cleared on login where possible.

Audit logging:
- `AuditLog` entries are recorded via `log_action(user_id, action, details)`. Admin pages use this for traceability of sensitive actions.

---

## API surface (selected)
Public endpoints
- `GET /api/listings` — returns verified listings (public data only; seller contact removed).
- `GET /api/listing/<id>` — single listing details (includes seller if listing is not public?) — server returns `Listing.to_dict()`.
- `POST /api/post-listing` — create listing (multipart/form-data supported for photo uploads). Requires CSRF header.
- `POST /api/interest-request` — buyer interest submission.
- `POST /api/report` — report a listing.

Auth / Account
- `POST /api/register` — create account; returns access and refresh tokens and starts a session.
- `POST /api/login` — authenticate; returns tokens, starts session, uses throttling and temp password checks.
- `POST /api/refresh-token` — exchange refresh token for new access token.
- `POST /api/revoke-token` — revoke refresh token.
- `POST /api/logout` — logout (blocks access token and revokes refresh token if provided).

Admin/Protected (JWT or session where noted)
- `GET /api/admin/analytics` — admin analytics
- `GET /api/audit` — recent audit logs
- `GET /api/admin/users` — list users (admin/session)
- `POST /api/admin/users` — create admin users
- `POST /api/admin/suspend_all` — suspend platform (tech)
- `POST /api/admin/reset_user_password` — reset by email (admin/session + CSRF)

Realtime
- Socket.io endpoint expects a valid JWT passed as `token` query param. Connection rejected without token.

CSRF
- The server expects `X-CSRF-Token` (or `X-XSRF-TOKEN`) header on state-changing requests from the browser.
- The session stores a `csrf_token` created in `@app.before_request`.

---

## Static assets, favicon, and PWA
- Favicon files are in `static/` (multiple sizes). The base template links `/static/favicon-32.png`, `/static/favicon-48.png`, `/static/favicon-180.png`, `/favicon.png`, and `/favicon.ico`.
- `static/site.webmanifest` is present and lists `favicon-192.png` and `favicon-512.png` for Android/PWA use.
- To regenerate icons programmatically, see the repository scripts used during maintenance (ImageMagick or Pillow-based script can resize `/static/favicon-180.png` into smaller PNGs and a multi-resolution `favicon.ico`).

---

## Deployment

Minimal Gunicorn example (Linux):

```bash
# set environment variables (DATABASE_URL, FLASK_SECRET_KEY, JWT_SECRET, RESEND_API_KEY, etc.)
gunicorn "server:app" -w 4 -b 0.0.0.0:8000 --log-level info
```

Deployment recommendations:
- Run behind a reverse proxy (NGINX) terminating TLS.
- Use a managed Postgres service (Supabase, RDS). Provide the full Postgres URI via `DATABASE_URL`.
- Set `FLASK_SECRET_KEY` and `JWT_SECRET` to secure, random values.
- Configure process monitoring and restarts (systemd, Docker, or PaaS health checks).
- Ensure `RESEND_API_KEY` or SMTP creds are configured for email.

Docker: A Dockerfile is not included; for container deployments build a small Python image, install `requirements.txt`, copy the project, set environment variables, and run Gunicorn as above.

---

## Operational tasks & scripts
- `create_tech_user.py`: create/update the `tech` role user; prints a one-time temp password.
- `migrations/` contains Alembic revisions; use `flask db` commands to create/upgrade schema.
- `tests/` run with `pytest` for quick verification.

---

## Troubleshooting & common fixes
- "Database unreachable" on startup: verify `DATABASE_URL` is correct, network rules (cloud provider), and that `psycopg2` is installed. For local dev set `ALLOW_SQLITE_DEV=1` and `SKIP_DB_CHECK=1`.
- Emails not sending: confirm `RESEND_API_KEY` or SMTP variables are set and reachable.
- CSRF failures on API calls: confirm client sends `X-CSRF-Token` header matching session `csrf_token`.
- Token issues: ensure `JWT_SECRET` is identical across app instances.

---

## Notes for developers (non-exhaustive)
- The server both renders pages (`templates/`) and exposes JSON APIs (`/api/*`). When adding endpoints, decide whether they require session-based HTML access, JWT, or both.
- Use `admin_or_tech_api_required` decorator for endpoints intended for admin/tech use (accepts JWT or session cookie).
- Audit sensitive operations with `log_action(user_id, action, details)` — this is used across admin APIs.
- Keep `temp_password` usage minimized. The code currently sets `user.temp_password` for admin-created accounts and clears it on login when possible.

---

## Change log (high level)
- Added multi-size favicons and `site.webmanifest` in `static/`.
- Added a quick-list modal component (`src/components/QuickListModal.tsx`) and wired it into the Agents page to capture quick leads.
- Agents page improvements: CTAs for landowners/brokers, land-specialist badge, and sample testimonials in `src/data/mockAgents.ts`.

---

If you want, I will:
- Add an API endpoint to persist quick-list leads and wire the modal to it, or
- Add a `README-deploy.md` with step-by-step Render/Heroku instructions including environment variable examples.

Tell me which of these to implement next.
