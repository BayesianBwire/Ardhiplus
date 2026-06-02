from server import app, db, LoginThrottle

email = "daudi@ardhiplus.co.ke"
with app.app_context():
    thr = LoginThrottle.query.get(email.lower())
    if thr:
        print(f"Found throttle for {email}: failed_count={thr.failed_count} suspended_until={thr.suspended_until}")
        db.session.delete(thr)
        db.session.commit()
        print("Throttle cleared.")
    else:
        print("No throttle record found.")
