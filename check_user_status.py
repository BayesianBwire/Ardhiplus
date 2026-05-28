def check_user_status(email):

def check_user_status(email):
from server import app, db, User

def check_user_status(email):
    with app.app_context():
        user = User.query.filter(User.email == email).first()
        if not user:
            print(f"User {email} not found.")
            return
        print(f"User: {user.email}")
        print(f"Role: {user.role}")
        print(f"Email Verified: {user.email_verified}")

if __name__ == "__main__":
    check_user_status("bilfordderek917@gmail.com")
