import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, select


def main():
    load_dotenv()
    uri = os.environ.get("SQLALCHEMY_DATABASE_URI")
    if not uri:
        print("SQLALCHEMY_DATABASE_URI not set")
        return

    print("Connecting to:", uri)
    engine = create_engine(uri)
    meta = MetaData()
    meta.reflect(bind=engine)

    tables = list(meta.sorted_tables)
    print(f"Found {len(tables)} tables on destination:")
    for t in tables:
        try:
            with engine.connect() as conn:
                res = conn.execute(select(t))
                rows = list(res)
                print(f" - {t.name}: {len(rows)} rows")
        except Exception as e:
            print(f" - {t.name}: error reading rows: {e}")


if __name__ == '__main__':
    main()
