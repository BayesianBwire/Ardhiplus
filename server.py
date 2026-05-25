from datetime import datetime
import json
import re
import secrets
from flask import Flask, jsonify, redirect, render_template, request, url_for, session, g
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres.iyyznlbcdiqqjcugfvdg:Ardhiplus%4020@aws-1-eu-central-2.pooler.supabase.com:6543/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key-change-me")

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="broker")
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    temp_password = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "registered_at": self.registered_at.isoformat() + "Z",
        }

class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    size = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    price = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)
    badge = db.Column(db.String(100), nullable=False, default="Pending approval")
    coords_lat = db.Column(db.Float, default=0.0)
    coords_lng = db.Column(db.Float, default=0.0)
    images_json = db.Column(db.Text, nullable=False, default="[]")
    seller_name = db.Column(db.String(255), nullable=True)
    seller_email = db.Column(db.String(255), nullable=True)
    seller_phone = db.Column(db.String(100), nullable=True)
    seller_notes = db.Column(db.Text, nullable=True)

    @property
    def coords(self):
        return {"lat": self.coords_lat, "lng": self.coords_lng}

    @coords.setter
    def coords(self, value):
        self.coords_lat = float(value.get("lat", 0.0))
        self.coords_lng = float(value.get("lng", 0.0))

    @property
    def images(self):
        try:
            return json.loads(self.images_json or "[]")
        except (TypeError, ValueError):
            return []

    @images.setter
    def images(self, value):
        self.images_json = json.dumps(value or [])

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "location": self.location,
            "size": self.size,
            "type": self.type,
            "price": self.price,
            "description": self.description,
            "created_at": self.created_at.strftime("%Y-%m-%d"),
            "coords": self.coords,
            "images": self.images,
            "verified": self.verified,
            "badge": self.badge,
            "seller_name": self.seller_name,
            "seller_email": self.seller_email,
            "seller_phone": self.seller_phone,
            "seller_notes": self.seller_notes,
        }

class SurveyRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_title = db.Column(db.String(255), nullable=False)
    owner_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Reviewing")
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "property_title": self.property_title,
            "owner_name": self.owner_name,
            "email": self.email,
            "location": self.location,
            "status": self.status,
            "requested_at": self.requested_at.isoformat() + "Z",
        }

class InterestRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    listing_title = db.Column(db.String(255), nullable=False)
    buyer_name = db.Column(db.String(255), nullable=False)
    buyer_email = db.Column(db.String(255), nullable=False)
    buyer_phone = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default="Pending")
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "listing_title": self.listing_title,
            "buyer_name": self.buyer_name,
            "buyer_email": self.buyer_email,
            "buyer_phone": self.buyer_phone,
            "message": self.message,
            "status": self.status,
            "requested_at": self.requested_at.isoformat() + "Z",
        }

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    listing_title = db.Column(db.String(255), nullable=False)
    reporter_name = db.Column(db.String(255), nullable=False)
    reporter_email = db.Column(db.String(255), nullable=False)
    issue = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Open")
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "listing_title": self.listing_title,
            "reporter_name": self.reporter_name,
            "reporter_email": self.reporter_email,
            "issue": self.issue,
            "status": self.status,
            "reported_at": self.reported_at.isoformat() + "Z",
        }

class PasswordResetToken(db.Model):
    token = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    temp_password = db.Column(db.String(255), nullable=False)
    expires = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "token": self.token,
            "email": self.email,
            "temp_password": self.temp_password,
            "expires": self.expires,
        }


class LoginThrottle(db.Model):
    email = db.Column(db.String(255), primary_key=True)
    failed_count = db.Column(db.Integer, default=0)
    suspended_until = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {"email": self.email, "failed_count": self.failed_count, "suspended_until": self.suspended_until}

initial_listings = [
    {
        "title": "Prime Residential Plot",
        "location": "Nairobi, Kenya",
        "size": "500 sqm",
        "type": "Residential",
        "price": "KES 12,500,000",
        "created_at": "2024-11-08",
        "coords": {"lat": 1.2921, "lng": 36.8219},
        "description": "Verified by our survey team with full boundary mapping and title review.",
        "verified": True,
        "badge": "Verified Survey",
        "images": [
            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        ],
        "seller_name": "Ardhi Plus Agency",
        "seller_email": "seller1@ardhiplus.co.ke",
        "seller_phone": "+254712345678",
        "seller_notes": "Seller is an accredited land broker with verified title documents.",
    },
    {
        "title": "Commercial Land Parcel",
        "location": "Mombasa Road, Nairobi",
        "size": "1.2 acres",
        "type": "Commercial",
        "price": "KES 25,750,000",
        "created_at": "2024-10-22",
        "coords": {"lat": 1.3160, "lng": 36.8400},
        "description": "Ideal for construction with pre-approved survey reports.",
        "verified": True,
        "badge": "Trust Badge",
        "images": [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
        ],
        "seller_name": "Nairobi Trading Estate",
        "seller_email": "seller2@ardhiplus.co.ke",
        "seller_phone": "+254723456789",
        "seller_notes": "Seller has completed the initial survey and boundary review.",
    },
    {
        "title": "Greenfield Acreage",
        "location": "Naivasha, Kenya",
        "size": "3 acres",
        "type": "Agricultural",
        "price": "KES 18,000,000",
        "created_at": "2024-12-01",
        "coords": {"lat": 0.7667, "lng": 36.4333},
        "description": "Survey request services available; contact a surveyor before purchase.",
        "verified": False,
        "badge": "Survey Pending",
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
        ],
        "seller_name": "Lakeview Farms Ltd",
        "seller_email": "seller3@ardhiplus.co.ke",
        "seller_phone": "+254734567890",
        "seller_notes": "Pending survey verification and title clearance.",
    },
]

def seed_initial_data():
    if Listing.query.first():
        return

    for item in initial_listings:
        listing = Listing(
            title=item["title"],
            location=item["location"],
            size=item["size"],
            type=item["type"],
            price=item["price"],
            description=item["description"],
            verified=item["verified"],
            badge=item["badge"],
            seller_name=item.get("seller_name"),
            seller_email=item.get("seller_email"),
            seller_phone=item.get("seller_phone"),
            seller_notes=item.get("seller_notes"),
        )
        listing.coords = item.get("coords", {})
        listing.images = item.get("images", [])
        created_at = item.get("created_at")
        if created_at:
            listing.created_at = datetime.strptime(created_at, "%Y-%m-%d")
        db.session.add(listing)
    db.session.commit()


def init_db():
    db.create_all()
    seed_initial_data()


def is_strong_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        return "Password must include both letters and numbers."
    return None


@app.before_request
def load_current_user():
    g.user = None
    user_id = session.get("user_id")
    if user_id:
        try:
            g.user = User.query.get(int(user_id))
        except Exception:
            g.user = None

    # ensure a CSRF token exists in session for forms/JS
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_urlsafe(16)


@app.context_processor
def inject_user():
    return {"current_user": getattr(g, "user", None)}


def check_csrf():
    # Expect header 'X-CSRF-Token' to match session token
    token = request.headers.get("X-CSRF-Token") or request.headers.get("X-XSRF-TOKEN")
    if not token or token != session.get("csrf_token"):
        return False
    return True


@app.route("/")
def home():
    featured = Listing.query.order_by(Listing.created_at.desc()).limit(3).all()
    return render_template("index.html", featured=[listing.to_dict() for listing in featured], page="home")


@app.route("/listings")
def listings():
    return render_template("listings.html", page="listings")


@app.route("/services")
def services():
    return render_template("services.html", page="services")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html", page="contact")


@app.route("/login")
def login():
    return render_template("login.html", page="login")


@app.route("/register")
def register():
    return render_template("register.html", page="register")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html", page="dashboard")


@app.route("/ardhimwenyewe")
def hidden_admin():
    pending_listings = Listing.query.filter_by(verified=False).all()
    return render_template(
        "admin.html",
        pending=[listing.to_dict() for listing in pending_listings],
        interest_requests=[item.to_dict() for item in InterestRequest.query.order_by(InterestRequest.requested_at.desc()).all()],
        reports=[item.to_dict() for item in Report.query.order_by(Report.reported_at.desc()).all()],
        page="admin",
    )


@app.route("/admin")
def admin_redirect():
    return redirect(url_for("hidden_admin"))


@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot.html", page="forgot")


@app.route("/reset-password")
def reset_password():
    token = request.args.get("token", "")
    return render_template("reset.html", page="reset", token=token)


@app.route("/api/forgot-password", methods=["POST"])
def api_forgot_password():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    email = data.get("email", "").strip().lower()
    if not email:
        return jsonify({"status": "error", "message": "Please provide your email address."}), 400

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if user:
        token = secrets.token_urlsafe(24)
        temp_password = secrets.token_urlsafe(10)
        reset_token = PasswordResetToken(
            token=token,
            email=user.email,
            temp_password=temp_password,
            expires=datetime.utcnow().timestamp() + 3600,
        )
        db.session.add(reset_token)
        db.session.commit()
        reset_link = url_for("reset_password", token=token, _external=True)
        print(
            f"[Password reset email] to={email} link={reset_link} temp_password={temp_password}"
        )

    return jsonify({"status": "success", "message": "If this email is registered, reset instructions have been sent."}), 200


@app.route("/api/reset-password", methods=["POST"])
def api_reset_password():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    token = data.get("token", "").strip()
    new_password = data.get("new_password", "").strip()

    if not token or not new_password:
        return jsonify({"status": "error", "message": "Token and new password are required."}), 400

    reset_data = PasswordResetToken.query.get(token)
    if not reset_data or reset_data.expires < datetime.utcnow().timestamp():
        return jsonify({"status": "error", "message": "Reset token is invalid or expired."}), 400

    password_error = is_strong_password(new_password)
    if password_error:
        return jsonify({"status": "error", "message": password_error}), 400

    user = User.query.filter(db.func.lower(User.email) == reset_data.email.lower()).first()
    if not user:
        return jsonify({"status": "error", "message": "User not found."}), 404

    user.password = new_password
    user.temp_password = None
    db.session.delete(reset_data)
    db.session.commit()

    return jsonify({"status": "success", "message": "Your password has been reset successfully."}), 200


@app.route("/api/listings")
def api_listings():
    visible_listings = []
    for listing in Listing.query.order_by(Listing.created_at.desc()).all():
        visible_copy = listing.to_dict()
        for key in ("seller_name", "seller_email", "seller_phone", "seller_notes"):
            visible_copy.pop(key, None)
        visible_listings.append(visible_copy)
    return jsonify(visible_listings)


@app.route("/api/listing/<int:listing_id>")
def api_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"status": "error", "message": "Listing not found."}), 404
    return jsonify(listing.to_dict())


@app.route("/api/post-listing", methods=["POST"])
def api_post_listing():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    title = data.get("title", "").strip()
    location = data.get("location", "").strip()
    property_type = data.get("type", "").strip()
    size = data.get("size", "").strip()
    price = data.get("price", "").strip()
    description = data.get("description", "").strip()
    seller_name = data.get("seller_name", "").strip()
    seller_phone = data.get("seller_phone", "").strip()
    coords = data.get("coords") or {}
    images = data.get("images") or []

    if not title or not location or not property_type or not size or not price or not description or not seller_name or not seller_phone:
        return jsonify({"status": "error", "message": "All property fields are required."}), 400

    if not isinstance(coords, dict):
        coords = {}

    listing = Listing(
        title=title,
        location=location,
        size=size,
        type=property_type,
        price=price,
        description=description,
        verified=False,
        badge="Pending approval",
        seller_name=seller_name,
        seller_email=data.get("seller_email", "").strip() or None,
        seller_phone=seller_phone,
        seller_notes=data.get("seller_notes", "").strip() or "Pending survey verification and admin review.",
    )
    listing.coords = {
        "lat": coords.get("lat", 0.0),
        "lng": coords.get("lng", 0.0),
    }
    listing.images = images if isinstance(images, list) and images else [
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ]
    db.session.add(listing)
    db.session.commit()

    return jsonify({"status": "success", "message": "Property submitted for review.", "listing_id": listing.id}), 201


@app.route("/api/interest-request", methods=["POST"])
def api_interest_request():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    property_title = data.get("property_title", "").strip()
    buyer_name = data.get("buyer_name", "").strip()
    buyer_email = data.get("buyer_email", "").strip()
    buyer_phone = data.get("buyer_phone", "").strip()
    message = data.get("message", "").strip()

    if not property_title or not buyer_name or not buyer_email or not buyer_phone:
        return jsonify({"status": "error", "message": "Please complete all request fields."}), 400

    request_entry = InterestRequest(
        listing_title=property_title,
        buyer_name=buyer_name,
        buyer_email=buyer_email,
        buyer_phone=buyer_phone,
        message=message,
    )
    db.session.add(request_entry)
    db.session.commit()
    return jsonify({"status": "success", "message": "Your request has been sent to the admin for connection."}), 201


@app.route("/api/connect-request", methods=["POST"])
def api_connect_request():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    request_id = data.get("request_id")
    request_item = InterestRequest.query.get(request_id)
    if not request_item:
        return jsonify({"status": "error", "message": "Request not found."}), 404

    request_item.status = "Connected"
    db.session.commit()
    return jsonify({"status": "success", "message": "Buyer and seller have been connected by admin."})


@app.route("/api/report", methods=["POST"])
def api_report():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    listing_title = data.get("listing_title", "").strip()
    reporter_name = data.get("reporter_name", "").strip()
    reporter_email = data.get("reporter_email", "").strip()
    issue = data.get("issue", "").strip()

    if not listing_title or not reporter_name or not reporter_email or not issue:
        return jsonify({"status": "error", "message": "Please complete all report fields."}), 400

    report_entry = Report(
        listing_title=listing_title,
        reporter_name=reporter_name,
        reporter_email=reporter_email,
        issue=issue,
    )
    db.session.add(report_entry)
    db.session.commit()
    return jsonify({"status": "success", "message": "Report submitted to admin."}), 201


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    name = data.get("name", "").strip()
    role = data.get("role", "seller").strip().lower()

    allowed_roles = {"land_owner", "broker", "agent"}
    if role not in allowed_roles:
        role = "broker"

    if not name or not email or not password:
        return jsonify({"status": "error", "message": "All fields are required."}), 400

    password_error = is_strong_password(password)
    if password_error:
        return jsonify({"status": "error", "message": password_error}), 400

    if User.query.filter(db.func.lower(User.email) == email.lower()).first():
        return jsonify({"status": "error", "message": "Email already registered."}), 400

    user = User(
        name=name,
        email=email,
        password=password,
        role=role,
    )
    db.session.add(user)
    db.session.commit()
    # Log the user in after registration
    session["user_id"] = user.id
    return jsonify({"status": "success", "message": "Account created successfully."}), 201


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    user = User.query.filter(db.func.lower(User.email) == email.lower()).first()
    # Check throttling
    throttle = LoginThrottle.query.get(email.lower())
    now_ts = datetime.utcnow().timestamp()
    if throttle and throttle.suspended_until and throttle.suspended_until > now_ts:
        return jsonify({"status": "error", "message": "Account temporarily suspended due to multiple failed login attempts. Try again later."}), 429

    if not user or (user.password != password and user.temp_password != password):
        # increment throttle
        if not throttle:
            throttle = LoginThrottle(email=email.lower(), failed_count=1)
            db.session.add(throttle)
        else:
            throttle.failed_count = (throttle.failed_count or 0) + 1
            if throttle.failed_count >= 5:
                throttle.suspended_until = now_ts + 3600  # 1 hour suspension
                throttle.failed_count = 0
        db.session.commit()
        return jsonify({"status": "error", "message": "Incorrect email or password."}), 401

    # Successful login: clear throttle and set session
    if throttle:
        db.session.delete(throttle)
        db.session.commit()

    session["user_id"] = user.id

    message = f"Welcome back, {user.name}!"
    if user.temp_password == password:
        message = "Logged in with a temporary password. Please reset your password now."

    return jsonify({"status": "success", "message": message, "name": user.name}), 200


@app.route("/api/survey-request", methods=["POST"])
def api_survey_request():
    data = request.get_json() or {}
    property_title = data.get("property_title", "").strip()
    owner_name = data.get("owner_name", "").strip()
    email = data.get("email", "").strip()
    location = data.get("location", "").strip()

    if not property_title or not owner_name or not email or not location:
        return jsonify({"status": "error", "message": "Please complete all fields."}), 400

    request_entry = SurveyRequest(
        property_title=property_title,
        owner_name=owner_name,
        email=email,
        location=location,
    )
    db.session.add(request_entry)
    db.session.commit()
    return jsonify({"status": "success", "message": "Your survey request is submitted."}), 201


@app.route("/api/verify-listing", methods=["POST"])
def api_verify_listing():
    data = request.get_json() or {}
    listing_id = data.get("listing_id")

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"status": "error", "message": "Listing not found."}), 404

    listing.verified = True
    listing.badge = "Verified Survey"
    db.session.commit()
    return jsonify({"status": "success", "message": "Listing verified and approved."})


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect(url_for("home"))


if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(debug=True)
