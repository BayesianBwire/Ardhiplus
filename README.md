# Ardhi Plus Properties & Survey

A modern real estate marketplace prototype with a new Python backend and HTML/CSS/JavaScript frontend.

## Features

- Property marketplace and search
- User registration and dashboards
- Survey request services
- Admin approval and verification flow
- WhatsApp and direct communication CTA
- Python Flask API with static frontend templates

## Run locally

Install Python and Flask, then start the backend:

```powershell
py -m pip install -r requirements.txt
py server.py
```

Open http://127.0.0.1:5000 in your browser.

## Database configuration

- The application requires a Postgres database (for example Supabase) in deployment. Set
	`SQLALCHEMY_DATABASE_URI` (or `DATABASE_URL`) to your Postgres connection string before
	starting the app. The app will validate connectivity to the configured Postgres instance
	on startup and refuse to start if the database is unreachable.

PowerShell example (set and run):

```powershell
setx SQLALCHEMY_DATABASE_URI "postgresql://user:pass@host:port/dbname"
py server.py
```

## Sending emails

- This app can send registration confirmations and password reset emails via SMTP. Add these env vars (see `.env.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_SENDER`.
- For Gmail use an App Password and set `SMTP_HOST=smtp.gmail.com` and `SMTP_PORT=587`.
- After setting env vars, restart the app and the system will send emails on registration and when a reset is requested.
```

## Project structure

- `server.py` — Python Flask backend and API endpoints
- `templates/` — HTML pages rendered by Flask
- `static/css/` — stylesheet for the frontend
- `static/js/` — JavaScript used for listings and forms
- `src/` — existing React frontend sources (optional)
- `public/` — existing Vite public assets
