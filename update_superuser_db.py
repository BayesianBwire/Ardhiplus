#!/usr/bin/env python
"""
Update the superuser password (hash) and clear login throttle for the given email.

Usage: set `DATABASE_URL` or `SQLALCHEMY_DATABASE_URI` in env, then run:
    py -3 update_superuser_db.py

This script supports Postgres (psycopg2) and SQLite (sqlite3).
"""
import os
import sys
from urllib.parse import urlparse

try:
    from werkzeug.security import generate_password_hash
except Exception:
    print("Error: werkzeug is required. Install with: py -3 -m pip install werkzeug")
    sys.exit(1)

DB_URL = os.environ.get("DATABASE_URL") or os.environ.get("SQLALCHEMY_DATABASE_URI")
if not DB_URL:
    DB_URL = input("Enter your DATABASE_URL (or path to sqlite file like sqlite:///dev.db): ").strip()

email = os.environ.get("SUPERUSER_EMAIL", "daudi@ardhiplus.co.ke")
password = os.environ.get("SUPERUSER_PASSWORD", "Daudi254!")

hashed = generate_password_hash(password)

print(f"[INFO] Using email: {email}")
print(f"[INFO] Generated password hash: {hashed[:32]}...")

def update_sqlite(path: str):
    import sqlite3
    if path.startswith("sqlite:///"):
        db_path = path.replace("sqlite:///", "")
    else:
        db_path = path
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("UPDATE \"user\" SET password = ? WHERE lower(email) = lower(?)", (hashed, email))
    cur.execute("DELETE FROM login_throttle WHERE lower(email) = lower(?)", (email,))
    conn.commit()
    print(f"[OK] SQLite: updated user password and cleared throttle (rows changed: {conn.total_changes})")
    conn.close()

def update_postgres(url: str):
    try:
        import psycopg2
    except Exception:
        print("Error: psycopg2 is required for Postgres. Install with: py -3 -m pip install psycopg2-binary")
        sys.exit(1)
    parsed = urlparse(url)
    conn = psycopg2.connect(dsn=url)
    cur = conn.cursor()
    cur.execute('UPDATE "user" SET password = %s WHERE lower(email) = lower(%s)', (hashed, email))
    cur.execute('DELETE FROM login_throttle WHERE lower(email) = lower(%s)', (email,))
    conn.commit()
    cur.close()
    conn.close()
    print("[OK] Postgres: updated user password and cleared throttle.")


if DB_URL.startswith("sqlite"):
    update_sqlite(DB_URL)
elif DB_URL.startswith("postgres") or DB_URL.startswith("postgresql"):
    update_postgres(DB_URL)
else:
    print("Unrecognized DB URL scheme. Please set DATABASE_URL to a Postgres or sqlite URL.")
    sys.exit(1)

print("Done. Restart your server and try logging in.")
