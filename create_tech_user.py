#!/usr/bin/env python
"""
Create a tech-role user for Ardhi Plus.
"""
from server import app, db, User
from werkzeug.security import generate_password_hash

if __name__ == "__main__":
    # Create or update the site tech user. This script generates a secure
    # temporary password, prints it for the operator, and saves the hashed
    # password to the database while storing the transient plaintext in
    # `temp_password` for one-time retrieval by the operator.
    with app.app_context():
        email = "tech@ardhiplus.co.ke"
        name = "Bilford Bwire"
        role = "tech"

        # generate a reasonably strong temporary password
        raw_password = secrets.token_urlsafe(10)

        user = User.query.filter_by(email=email).first()
        hashed = generate_password_hash(raw_password)
        if user:
            print(f"User {email} already exists. Updating role and password...")
            user.role = role
            user.password = hashed
            user.temp_password = raw_password
        else:
            user = User(name=name, email=email, password=hashed, role=role, temp_password=raw_password)
            db.session.add(user)
        db.session.commit()
        print(f"Tech user {email} created/updated with role '{role}'.")
        print(f"Temporary password (copy this now): {raw_password}")
