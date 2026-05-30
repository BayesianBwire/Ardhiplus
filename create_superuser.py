#!/usr/bin/env python
"""
Create a superuser (admin) for Ardhi Plus.
"""
from server import app, db, User
from werkzeug.security import generate_password_hash

if __name__ == "__main__":
    with app.app_context():
        email = "davidodongoekaya@gmail.com"
        password = "Daudi254!"
        name = "Adau Kadau"
        role = "admin"

        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        hashed = generate_password_hash(password)
        print(f"[SUPERUSER] Raw password: '{password}'")
        print(f"[SUPERUSER] Hashed password: '{hashed}'")
        if user:
            print(f"User {email} already exists. Updating role and password...")
            user.role = role
            user.password = hashed
        else:
            user = User(
                name=name,
                email=email,
                password=hashed,
                role=role
            )
            db.session.add(user)
        db.session.commit()
        print(f"Superuser {email} created/updated with role '{role}'.")
