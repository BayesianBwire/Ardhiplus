ArdhiPlus — Tech & Site Documentation
=====================================

Overview
--------
This document describes the admin and technical maintenance features for ArdhiPlus, how the `tech` role operates, account management policies, and developer guidance to operate and maintain the site.

Contacts
--------
- Primary tech contact: tech@ardhiplus.co.ke
- Tech user name: Bilford Bwire

Architecture Summary
--------------------
- Backend: Flask + SQLAlchemy + Flask-Migrate. Entrypoint: `server.py`.
- Database: PostgreSQL in production (Supabase). Configured via `DATABASE_URL` or `SQLALCHEMY_DATABASE_URI`.
- Frontend: Jinja2 templates in `templates/` plus static assets in `static/` (CSS/JS). React not used for main admin pages.
- Real-time: Socket.IO (`flask_socketio`) for optional realtime features.

Key Files & Folders
-------------------
- `server.py` — main Flask application, routes, API endpoints, and role checks.
- `templates/` — Jinja2 templates. Important files:
  - `admin.html` — admin dashboard and management UI.
  - `tech.html` — maintenance/tech panel for `tech` users.
  - `base.html` — site base template.
- `static/js/main.js` — primary frontend behaviors (forms, admin actions, analytics).
- `static/css/styles.css` — site styling and admin card styles.
- `create_tech_user.py` — helper to create/update the `tech` user and print a temporary password.
- `docs/TECH_SITE_DOCUMENTATION.md` — this document.

Roles and Access
----------------
- `superadmin` — full system control.
- `admin` — site administration (user management, approvals).
- `tech` — maintenance role; may access `/tech` and `/ardhimwenyewe`. The `tech` role can perform emergency actions like `suspend_all` and reset user passwords via the maintenance panel.

Account & Password Policy (site-specific)
-----------------------------------------
- Passwords are stored hashed using Werkzeug's `generate_password_hash`.
- Temporary passwords for new accounts are generated server-side and returned to the creating admin for secure handoff.
- Password reset / forgot-password endpoints are DISABLED by policy; users must contact `tech@ardhiplus.co.ke` for assistance.
- Pasting into password fields is disabled in the UI to encourage manual typing and reduce accidental insecure copy-paste.

Creating the Tech User
----------------------
Run the helper locally (requires app context and DB connectivity):

```powershell
python create_tech_user.py
```

The script will create or update the `tech@ardhiplus.co.ke` account with a generated temporary password and print the password to the console. The operator must copy and hand it securely to the tech person.

Admin Creation Flow
-------------------
- Admins create other admin accounts via the `Add Admin` form on the admin page.
- The API `POST /api/admin/users` returns `{temp_password: "..."}` to the creator; the UI shows the temp password once in an alert.
- Newly created admin should be given the temp password by the creating admin; the `temp_password` is cleared automatically on the first successful login.

Tech Maintenance Panel
----------------------
- `/tech` is a restricted page for the `tech` role. It includes:
  - `Suspend Platform` (calls `/api/admin/suspend_all`) — only `tech` users may perform this.
  - `View Recent Audit` — calls `/api/audit`.
  - `Reset User Password` — calls `/api/admin/reset_user_password`.

Security Notes
--------------
- `temp_password` is stored only transiently and is cleared on first successful login.
- Reset flows were intentionally disabled to force manual intervention by tech personnel.
- Consider moving the `temp_password` handoff to an out-of-band secure channel (not stored at rest). If desired, we can remove storing `temp_password` entirely and instead print it only when necessary.

Analytics & Overall Position
----------------------------
- `/api/admin/analytics` returns metrics used by the admin dashboard, including a computed `overall_position` object with:
  - `ratio`: `verified/total`
  - `value`: percentage verified (integer)
  - `change`: difference in verified listings this week vs previous week
  - `trend`: array of counts for the last 7 days (oldest→newest)
- The UI renders a sparkline and an animated delta for visual clarity.

Disabling Password Reset (Operational Impact)
--------------------------------------------
- Users cannot self-serve password resets. All reset requests are handled by tech personnel.
- Ensure the tech team has a secure channel to receive requests and a documented verification process for identity before performing resets.

How to produce a PDF of this document
-------------------------------------
If you want a PDF, run (requires `pandoc`):

```bash
pip install pandoc
pandoc docs/TECH_SITE_DOCUMENTATION.md -o docs/TECH_SITE_DOCUMENTATION.pdf
```

Or use your OS/Editor's "Export to PDF" on the markdown file.

Further Improvements (recommended)
----------------------------------
- Replace temp-password handoff with a one-time CLI display and avoid storing plaintext even temporarily.
- Implement 2FA for `tech` and `superadmin` accounts.
- Add audit review pages that filter sensitive actions and support CSV exports.
- Add caching (Redis) for analytics endpoints.

Questions
---------
Tell me which of the recommended improvements you want me to implement next.
