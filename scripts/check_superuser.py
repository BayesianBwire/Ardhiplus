#!/usr/bin/env python3
import os
import json
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except Exception as e:
    print("psycopg2 is required. Install with: py -3 -m pip install psycopg2-binary")
    raise

def main():
    db = os.environ.get('DATABASE_URL') or os.environ.get('SQLALCHEMY_DATABASE_URI')
    if not db:
        print('DATABASE_URL / SQLALCHEMY_DATABASE_URI not set')
        return
    conn = psycopg2.connect(dsn=db)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('SELECT id, name, email, role, registered_at FROM "user" WHERE lower(role)=%s OR lower(email)=%s', ('admin','daudi@ardhiplus.co.ke'))
    rows = cur.fetchall()
    print(json.dumps(rows, default=str, indent=2))
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
