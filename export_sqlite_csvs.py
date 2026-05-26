"""Dump all tables from the local SQLite `dev.db` (or SOURCE_DB) to CSV files.

Usage:
  - Optionally set SOURCE_DB env var (default: sqlite:///dev.db)
  - Run: `py export_sqlite_csvs.py` and CSVs will be written to `exports/`

This is intended as a fallback when direct DB connections to Supabase
are not available or authentication is not ready. The generated CSVs can
be imported via the Supabase dashboard or `psql`.
"""
import os
import csv
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, select


def serialize_value(v):
    if v is None:
        return ""
    try:
        # handle datetime-like objects
        return v.isoformat()
    except Exception:
        return str(v)


def main():
    load_dotenv()
    source_uri = os.environ.get("SOURCE_DB", "sqlite:///dev.db")
    outdir = Path("exports")
    outdir.mkdir(exist_ok=True)

    engine = create_engine(source_uri)
    meta = MetaData()
    print("Reflecting source schema...")
    meta.reflect(bind=engine)

    tables = list(meta.sorted_tables)
    print(f"Found {len(tables)} tables to export")

    with engine.connect() as conn:
        for table in tables:
            print(f"Exporting table: {table.name}")
            rows = list(conn.execute(select(table)))
            if not rows:
                print("  (no rows)")
                continue

            csv_path = outdir / f"{table.name}.csv"
            with csv_path.open("w", newline="", encoding="utf-8") as fh:
                writer = csv.writer(fh)
                headers = [c.name for c in table.columns]
                writer.writerow(headers)
                for row in rows:
                    writer.writerow([serialize_value(row[col]) for col in headers])

            print(f"  Wrote {len(rows)} rows to {csv_path}")

    print("Export complete. CSV files are in the 'exports/' directory.")


if __name__ == "__main__":
    main()
