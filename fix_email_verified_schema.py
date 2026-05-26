from server import app, db
from sqlalchemy import text

with app.app_context():
    engine = db.engine
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE'))
        conn.commit()
    print('Schema update applied: email_verified column added or already exists.')
