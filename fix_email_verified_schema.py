from server import app, db
from sqlalchemy import inspect, text

with app.app_context():
    inspector = inspect(db.engine)
    columns = [col["name"] for col in inspector.get_columns("user")]
    if "email_verified" not in columns:
        db.session.execute(text('ALTER TABLE "user" ADD COLUMN email_verified BOOLEAN DEFAULT FALSE'))
        db.session.commit()
        print('Schema update applied: email_verified column added.')
    else:
        print('email_verified column already exists.')
