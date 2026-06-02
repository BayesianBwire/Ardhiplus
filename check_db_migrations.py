#!/usr/bin/env python
"""
Check database migrations status.

This script connects using `DATABASE_URL` or `SQLALCHEMY_DATABASE_URI` env var (or prompts),
lists database tables, checks Alembic's current revision, and compares with migration files
in `migrations/versions/`.

Usage:
    py -3 check_db_migrations.py

"""
import os
import sys
from pathlib import Path

try:
    import sqlalchemy as sa
except Exception:
    print("Error: sqlalchemy is required. Install with: py -3 -m pip install sqlalchemy")
    sys.exit(1)

DB_URL = os.environ.get("DATABASE_URL") or os.environ.get("SQLALCHEMY_DATABASE_URI")
if not DB_URL:
    print("Error: DATABASE_URL or SQLALCHEMY_DATABASE_URI must be set to a Postgres URL (postgresql://...).")
    sys.exit(1)

print(f"[INFO] Connecting to: {DB_URL}")

engine = sa.create_engine(DB_URL)
inspector = sa.inspect(engine)

print("\n=== Tables in database ===")
tables = inspector.get_table_names()
for t in sorted(tables):
    print(f"- {t}")

print("\n=== Alembic revision ===")
if "alembic_version" in tables:
    with engine.connect() as conn:
        try:
            row = conn.execute(sa.text("SELECT version_num FROM alembic_version")).fetchone()
            current = row[0] if row else None
            print(f"Current alembic revision in DB: {current}")
        except Exception as e:
            print(f"Could not read alembic_version: {e}")
else:
    print("No alembic_version table found — migrations may not have been run.")

print("\n=== Local migration files ===")
vers_dir = Path(__file__).parent / "migrations" / "versions"
local_revs = []
if vers_dir.exists():
    for p in sorted(vers_dir.iterdir()):
        if p.is_file() and p.suffix == ".py":
            local_revs.append(p.stem)
            print(f"- {p.name}")
else:
    print("migrations/versions directory not found in workspace.")

if local_revs and 'current' in locals() and current:
    if current in local_revs:
        idx = local_revs.index(current)
        unapplied = local_revs[idx+1:]
        if unapplied:
            print("\nUnapplied migration files (found after DB revision):")
            for u in unapplied:
                print(f"- {u}.py")
        else:
            print("\nAll local migrations appear applied (DB revision matches latest local file or is latest).")
    else:
        print("\nWarning: DB revision not found among local migration filenames. Manual check recommended.")

print("\nDone.")
