"""Migrate local SQLite `dev.db` data into the Supabase/Postgres configured
via `SQLALCHEMY_DATABASE_URI`.

Usage:
  - Ensure you have rotated any exposed DB password and set the environment
    variable `SQLALCHEMY_DATABASE_URI` to the encoded Supabase URL.
  - (Optional) set `SOURCE_DB` to point to a different local DB; default
    is `sqlite:///dev.db`.
  - Run: `py migrate_to_supabase.py`

This script will:
  1. Import the app and call `init_db()` on the Supabase DB to create tables.
  2. Reflect the source (sqlite) and destination (postgres) schemas.
  3. Copy rows table-by-table in dependency order.

Notes:
  - This is a best-effort row copy. It will skip rows that fail to insert
    and report errors. For complex migrations (large data, UUIDs, FK cycles)
    consider using a dedicated migration tool.
"""
import os
import sys
import traceback
from sqlalchemy import create_engine, MetaData, select
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv


def main():
    load_dotenv()

    target_uri = os.environ.get("SQLALCHEMY_DATABASE_URI")
    if not target_uri:
        print("ERROR: SQLALCHEMY_DATABASE_URI not set in environment.")
        sys.exit(1)

    source_uri = os.environ.get("SOURCE_DB", "sqlite:///dev.db")

    print("SOURCE:", source_uri)
    print("DEST:", target_uri)

    # Ensure server uses the target URI when creating tables
    os.environ["SQLALCHEMY_DATABASE_URI"] = target_uri

    # Import app and models and create tables on destination
    try:
        from server import app, init_db
    except Exception:
        print("Failed to import server.py")
        traceback.print_exc()
        sys.exit(1)

    print("Initializing destination DB (creating tables if needed)...")
    with app.app_context():
        try:
            init_db()
        except Exception:
            print("init_db() raised an exception:")
            traceback.print_exc()

    # Reflect source and destination metadata
    src_engine = create_engine(source_uri)
    dst_engine = create_engine(target_uri)

    src_meta = MetaData()
    dst_meta = MetaData()

    print("Reflecting source schema...")
    src_meta.reflect(bind=src_engine)
    print("Reflecting destination schema...")
    dst_meta.reflect(bind=dst_engine)

    # Copy tables in dependency order
    tables = list(src_meta.sorted_tables)
    print(f"Found {len(tables)} tables to copy.")

    with src_engine.connect() as src_conn, dst_engine.connect() as dst_conn:
        for table in tables:
            print(f"\n--- Copying table: {table.name} ---")
            if table.name not in dst_meta.tables:
                print(f"Destination does not have table {table.name}; skipping.")
                continue

            dst_table = dst_meta.tables[table.name]

            try:
                rows = list(src_conn.execute(select(table)))
            except Exception:
                print(f"Failed to read from source table {table.name}")
                traceback.print_exc()
                continue

            print(f"{len(rows)} rows found in source.{table.name}")
            if not rows:
                continue

            to_insert = []
            for row in rows:
                # Build dict only for columns that exist in destination
                rowdict = {}
                for col in table.columns:
                    if col.name in dst_table.c:
                        rowdict[col.name] = row[col.name]
                to_insert.append(rowdict)

            if not to_insert:
                print("No compatible columns to insert; skipping.")
                continue

            # Perform batched inserts inside a transaction
            trans = dst_conn.begin()
            try:
                dst_conn.execute(dst_table.insert(), to_insert)
                trans.commit()
                print(f"Inserted {len(to_insert)} rows into destination.{table.name}")
            except SQLAlchemyError:
                trans.rollback()
                print(f"Error inserting into {table.name}; attempting row-by-row")
                for r in to_insert:
                    try:
                        dst_conn.execute(dst_table.insert().values(**r))
                    except Exception:
                        print("Failed to insert row:", r)
                        traceback.print_exc()

    print("\nMigration complete. Review logs for errors.")


if __name__ == "__main__":
    main()
