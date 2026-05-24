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

## Project structure

- `server.py` — Python Flask backend and API endpoints
- `templates/` — HTML pages rendered by Flask
- `static/css/` — stylesheet for the frontend
- `static/js/` — JavaScript used for listings and forms
- `src/` — existing React frontend sources (optional)
- `public/` — existing Vite public assets
