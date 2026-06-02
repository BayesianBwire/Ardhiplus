from functools import wraps
from flask import abort
from datetime import datetime, timedelta
import json
import re
import secrets
import uuid
from flask import Flask, jsonify, redirect, render_template, request, url_for, session, g
import os
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from cryptography.fernet import Fernet
import hmac
import hashlib
from flask_socketio import SocketIO, disconnect, emit
from passlib.hash import bcrypt as passlib_bcrypt
from sqlalchemy.exc import SQLAlchemyError
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import smtplib
import ssl
from email.message import EmailMessage

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False

# Load .env into environment for local development
load_dotenv()

# Prefer an environment-provided database URL (e.g. for production).
# Fall back to a local SQLite file for safe development/testing if the
# configured Postgres database is not reachable.
def resolve_database_uri():
    uri = os.environ.get("SQLALCHEMY_DATABASE_URI") or os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgresql"):
        try:
            import psycopg2
            conn = psycopg2.connect(uri, connect_timeout=5)
            conn.close()
        except Exception as exc:
            print(f"Warning: PostgreSQL database unreachable ({exc}). Falling back to local SQLite.")
            uri = None
    return uri or "sqlite:///dev.db"

app.config["SQLALCHEMY_DATABASE_URI"] = resolve_database_uri()
print("Using database:", app.config["SQLALCHEMY_DATABASE_URI"])
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# Configure SQLAlchemy engine options for better connection pooling and stability
# Only apply PostgreSQL-specific options when using PostgreSQL
engine_options = {
    "pool_size": 5,
    "pool_recycle": 3600,
    "pool_pre_ping": True,
}
if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgresql"):
    engine_options["connect_args"] = {
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 30,
    }
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = engine_options
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key-change-me")
app.config["JWT_SECRET"] = os.environ.get("JWT_SECRET", "dev-jwt-secret-change-me")
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(seconds=int(os.environ.get("SESSION_LIFETIME_SECONDS", 3600 * 2)))
app.config["MESSAGE_KEY"] = os.environ.get("MESSAGE_KEY") or Fernet.generate_key().decode()

# SMTP configuration (used to send registration and password reset emails)
app.config["SMTP_HOST"] = os.environ.get("SMTP_HOST")
app.config["SMTP_PORT"] = int(os.environ.get("SMTP_PORT", "587"))
app.config["SMTP_USER"] = os.environ.get("SMTP_USER")
app.config["SMTP_PASS"] = os.environ.get("SMTP_PASS")
app.config["EMAIL_SENDER"] = os.environ.get("EMAIL_SENDER", app.config.get("SMTP_USER") or "no-reply@example.com")
app.config["SUPPORT_URL"] = os.environ.get("SUPPORT_URL", "https://ardhiplus.co.ke")
app.config["HELP_EMAIL"] = os.environ.get("HELP_EMAIL", "help@ardhiplus.co.ke")
app.config["SUPPORT_EMAIL"] = os.environ.get("SUPPORT_EMAIL", "support@ardhiplus.co.ke")
app.config["ADMIN_EMAIL"] = os.environ.get("ADMIN_EMAIL", "admin@ardhiplus.co.ke")
app.config["FINANCE_EMAIL"] = os.environ.get("FINANCE_EMAIL", "finance@ardhiplus.co.ke")
app.config["HR_EMAIL"] = os.environ.get("HR_EMAIL", "hr@ardhiplus.co.ke")


# Rate limiter
limiter = Limiter(app, key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])

# SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Fernet instance for message encryption
_fernet = Fernet(app.config["MESSAGE_KEY"].encode())

db = SQLAlchemy(app)
migrate = Migrate(app, db)


import requests

def send_email(to_email: str, subject: str, text_body: str, html_body: str | None = None) -> bool:
    api_key = os.environ.get("RESEND_API_KEY")
    sender = app.config.get("EMAIL_SENDER", "support@ardhiplus.co.ke")
    if not api_key:
        app.logger.error("RESEND_API_KEY not set. Cannot send email.")
        return False

    url = "https://api.resend.com/emails"
    payload = {
        "from": sender,
        "to": [to_email],
        "subject": subject,
        "text": text_body,
    }
    if html_body:
        payload["html"] = html_body

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        app.logger.info(f"Sending email to {to_email} via Resend API from {sender}")
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            app.logger.info(f"Successfully sent email to {to_email} via Resend API")
            return True
        else:
            app.logger.error(f"Failed to send email to {to_email} via Resend API: {response.status_code} {response.text}")
            return False
    except Exception as e:
        app.logger.exception(f"Unexpected error sending email to {to_email} via Resend API: {e}")
        return False


def send_welcome_verification_email(user, verification_link: str, verification_code: str) -> bool:
    subj = "Welcome to Ardhi Plus — Verify your email"
    text = (
        f"Hello {user.name},\n\n"
        "Welcome to Ardhi Plus.\n\n"
        "To complete your account setup and secure your account, please verify your email address using the link below:\n\n"
        f"{verification_link}\n\n"
        "Alternatively, use this verification code:\n\n"
        f"{verification_code}\n\n"
        "This verification helps us:\n\n"
        "* Protect your account\n"
        "* Prevent unauthorized access\n"
        "* Improve platform security\n\n"
        "If you did not create this account, please ignore this email.\n\n"
        "Welcome to Ardhi Plus.\n\n"
        "Best regards,\n"
        "Ardhi Plus Team\n"
        f"{app.config.get('SUPPORT_URL')}\n"
    )
    html = (
        f"<p>Hello {user.name},</p>"
        "<p>Welcome to Ardhi Plus.</p>"
        "<p>To complete your account setup and secure your account, please verify your email address using the link below:</p>"
        f"<p><a href=\"{verification_link}\">Verify email</a></p>"
        "<p>Alternatively, use this verification code:</p>"
        f"<p><code>{verification_code}</code></p>"
        "<p>This verification helps us:</p>"
        "<ul>"
        "<li>Protect your account</li>"
        "<li>Prevent unauthorized access</li>"
        "<li>Improve platform security</li>"
        "</ul>"
        "<p>If you did not create this account, please ignore this email.</p>"
        "<p>Welcome to Ardhi Plus.</p>"
        "<p>Best regards,<br>Ardhi Plus Team</p>"
        f"<p><a href=\"{app.config.get('SUPPORT_URL')}\">{app.config.get('SUPPORT_URL')}</a></p>"
    )
    return send_email(user.email, subj, text, html)


def send_password_reset_email(email: str, reset_link: str, temp_password: str) -> bool:
    subj = "Ardhi Plus — Password reset instructions"
    text = (
        "Hello,\n\n"
        "We received a request to reset your Ardhiplus account password.\n\n"
        "To reset your password, click the secure link below:\n\n"
        f"{reset_link}\n\n"
        "This password reset link will expire in 30 minutes for security purposes.\n\n"
        f"Temporary code: {temp_password}\n\n"
        "If you did not request a password reset, please ignore this email. Your account remains secure.\n\n"
        "For additional support, contact us through:\n"
        f"{app.config.get('SUPPORT_URL')}\n\n"
        "Best regards,\n"
        "Ardhi Plus Security Team\n"
    )
    html = (
        "<p>Hello,</p>"
        "<p>We received a request to reset your Ardhiplus account password.</p>"
        "<p>To reset your password, click the secure link below:</p>"
        f"<p><a href=\"{reset_link}\">{reset_link}</a></p>"
        "<p>This password reset link will expire in 30 minutes for security purposes.</p>"
        f"<p>Temporary code: <code>{temp_password}</code></p>"
        "<p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>"
        "<p>For additional support, contact us through:<br>"
        f"<a href=\"{app.config.get('SUPPORT_URL')}\">{app.config.get('SUPPORT_URL')}</a></p>"
        "<p>Best regards,<br>Ardhi Plus Security Team</p>"
    )
    return send_email(email, subj, text, html)


def send_trial_limit_email(user_name: str, to_email: str) -> bool:
    subj = "Ardhi Plus — Your free trial limit has been reached"
    text = (
        f"Hello {user_name},\n\n"
        "Your free trial on Ardhiplus has reached its limit.\n\n"
        "To continue accessing premium features, property listings, messaging, and platform tools, please upgrade your account.\n\n"
        "Why upgrade?\n\n"
        "* Unlimited access to platform features\n"
        "* Priority support\n"
        "* Advanced property tools\n"
        "* Better visibility for listings\n"
        "* Secure communication features\n\n"
        "Upgrade your account here:\n"
        f"{app.config.get('SUPPORT_URL')}\n\n"
        "If you believe this message was sent in error, please contact our support team.\n\n"
        "Thank you for using Ardhiplus.\n\n"
        "Best regards,\n"
        "Ardhi Plus Team\n"
        f"{app.config.get('SUPPORT_URL')}\n"
    )
    html = (
        f"<p>Hello {user_name},</p>"
        "<p>Your free trial on Ardhiplus has reached its limit.</p>"
        "<p>To continue accessing premium features, property listings, messaging, and platform tools, please upgrade your account.</p>"
        "<p>Why upgrade?</p>"
        "<ul>"
        "<li>Unlimited access to platform features</li>"
        "<li>Priority support</li>"
        "<li>Advanced property tools</li>"
        "<li>Better visibility for listings</li>"
        "<li>Secure communication features</li>"
        "</ul>"
        f"<p><a href=\"{app.config.get('SUPPORT_URL')}\">Upgrade your account here</a></p>"
        "<p>If you believe this message was sent in error, please contact our support team.</p>"
        "<p>Thank you for using Ardhiplus.</p>"
        "<p>Best regards,<br>Ardhi Plus Team</p>"
        f"<p><a href=\"{app.config.get('SUPPORT_URL')}\">{app.config.get('SUPPORT_URL')}</a></p>"
    )
    return send_email(to_email, subj, text, html)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="broker")
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    # email_verified field removed
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


class IPBlock(db.Model):
    ip = db.Column(db.String(100), primary_key=True)
    reason = db.Column(db.String(255), nullable=True)
    expires = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {"ip": self.ip, "reason": self.reason, "expires": self.expires}


class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    action = db.Column(db.String(255), nullable=False)
    ip = db.Column(db.String(100), nullable=True)
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class DeviceSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    session_token = db.Column(db.String(255), nullable=False)
    device_info = db.Column(db.String(512), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    revoked = db.Column(db.Boolean, default=False)


class RefreshToken(db.Model):
    token = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked = db.Column(db.Boolean, default=False)


class TokenBlocklist(db.Model):
    jti = db.Column(db.String(255), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)


class RolePermission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50), nullable=False)
    permission = db.Column(db.String(100), nullable=False)


class LoginNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    ip = db.Column(db.String(100), nullable=True)
    device_info = db.Column(db.String(512), nullable=True)
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)
    recipient_id = db.Column(db.Integer, nullable=False)
    ciphertext = db.Column(db.LargeBinary, nullable=False)
    hmac_sig = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class MessageThrottle(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    window_start = db.Column(db.Float, nullable=True)
    count = db.Column(db.Integer, default=0)

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
    # Sample seed disabled so the marketplace shows only real listings.
    # seed_initial_data()


def is_sample_listing(listing):
    sample_titles = {
        "Prime Residential Plot",
        "Commercial Land Parcel",
        "Greenfield Acreage",
    }
    sample_emails = {
        "seller1@ardhiplus.co.ke",
        "seller2@ardhiplus.co.ke",
        "seller3@ardhiplus.co.ke",
    }
    return listing.title in sample_titles and listing.seller_email in sample_emails


def is_strong_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        return "Password must include both letters and numbers."
    return None


@app.before_request
def load_current_user():
    g.user = None
    if is_session_expired():
        session.clear()
    user_id = session.get("user_id")
    if user_id:
        try:
            g.user = User.query.get(int(user_id))
        except Exception:
            g.user = None

    if g.user:
        session["last_active"] = datetime.utcnow().timestamp()

    # ensure a CSRF token exists in session for forms/JS
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_urlsafe(16)

    # Check IP block (with error handling for DB connection issues)
    remote = request.remote_addr
    if remote:
        try:
            ipb = IPBlock.query.get(remote)
            if ipb and ipb.expires and ipb.expires > datetime.utcnow().timestamp():
                return jsonify({"status": "error", "message": "Your IP is blocked."}), 403
        except Exception:
            # Database connection error - log it but allow request to continue
            # to prevent cascading failures on connection pool exhaustion
            pass


@app.context_processor
def inject_user():
    return {"current_user": getattr(g, "user", None)}


def check_csrf():
    # Expect header 'X-CSRF-Token' to match session token
    token = request.headers.get("X-CSRF-Token") or request.headers.get("X-XSRF-TOKEN")
    if not token or token != session.get("csrf_token"):
        return False
    return True


def create_jwt(user_id, expires_delta=None):
    secret = app.config.get("JWT_SECRET")
    now = datetime.utcnow()
    exp = now + (expires_delta or timedelta(minutes=15))
    jti = str(uuid.uuid4())
    payload = {"sub": str(user_id), "iat": int(now.timestamp()), "exp": int(exp.timestamp()), "jti": jti, "type": "access"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def create_refresh_token(user_id, expires_delta=None):
    secret = app.config.get("JWT_SECRET")
    now = datetime.utcnow()
    exp = now + (expires_delta or timedelta(days=7))
    jti = str(uuid.uuid4())
    payload = {"sub": str(user_id), "iat": int(now.timestamp()), "exp": int(exp.timestamp()), "jti": jti, "type": "refresh"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def store_refresh_token(token, user_id, expires_at):
    try:
        refresh = RefreshToken(token=token, user_id=user_id, expires_at=expires_at)
        db.session.add(refresh)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()


def is_token_revoked(jti):
    if not jti:
        return True
    blocked = TokenBlocklist.query.get(jti)
    return bool(blocked)


def blocklist_token(jti, expires_at=None):
    try:
        if not jti:
            return
        if not TokenBlocklist.query.get(jti):
            blocked = TokenBlocklist(jti=jti, expires_at=expires_at)
            db.session.add(blocked)
            db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()


def verify_jwt(token, expected_type=None):
    secret = app.config.get("JWT_SECRET")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        if expected_type and payload.get("type") != expected_type:
            return None
        if is_token_revoked(payload.get("jti")):
            return None
        return payload
    except Exception:
        return None


def is_session_expired():
    if not session.get("user_id"):
        return False
    last_active = session.get("last_active")
    if not last_active:
        return False
    lifetime = app.permanent_session_lifetime
    lifetime_seconds = lifetime.total_seconds() if hasattr(lifetime, "total_seconds") else int(lifetime)
    try:
        last_active_ts = float(last_active)
    except (TypeError, ValueError):
        return False
    return datetime.utcnow().timestamp() - last_active_ts > lifetime_seconds


def log_action(user_id, action, details=None):
    try:
        audit = AuditLog(user_id=user_id, action=action, ip=request.remote_addr, details=details)
        db.session.add(audit)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()


def notify_login(user_id, message=None):
    try:
        notification = LoginNotification(
            user_id=user_id,
            ip=request.remote_addr,
            device_info=request.user_agent.string,
            message=message or "New login from a device.",
        )
        db.session.add(notification)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()


def jwt_required(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Missing or invalid token."}), 401
        token = auth.split(" ", 1)[1]
        payload = verify_jwt(token, expected_type="access")
        if not payload:
            return jsonify({"status": "error", "message": "Invalid or expired token."}), 401
        request.jwt_payload = payload
        return f(*args, **kwargs)

    return wrapper


def has_permission(user, permission):
    if not user:
        return False
    if user.role == "superadmin":
        return True
    if user.role == "admin" and permission.startswith("admin:"):
        return True
    return RolePermission.query.filter_by(role=user.role, permission=permission).first() is not None


def permission_required(permission):
    from functools import wraps

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth = request.headers.get("Authorization", "")
            if not auth.startswith("Bearer "):
                return jsonify({"status": "error", "message": "Missing token."}), 401
            payload = verify_jwt(auth.split(" ", 1)[1], expected_type="access")
            if not payload:
                return jsonify({"status": "error", "message": "Invalid or expired token."}), 401
            user = User.query.get(int(payload.get("sub")))
            if not user or not has_permission(user, permission):
                return jsonify({"status": "error", "message": "Permission denied."}), 403
            request.jwt_payload = payload
            return f(*args, **kwargs)

        return wrapper

    return decorator


def admin_required(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Missing token."}), 401
        payload = verify_jwt(auth.split(" ", 1)[1], expected_type="access")
        if not payload:
            return jsonify({"status": "error", "message": "Invalid or expired token."}), 401
        user = User.query.get(int(payload.get("sub")))
        if not user or not has_permission(user, "admin:access"):
            return jsonify({"status": "error", "message": "Admin access required."}), 403
        request.jwt_payload = payload
        return f(*args, **kwargs)

    return wrapper


def admin_page_required(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        if not getattr(g, "user", None) or getattr(g.user, "role", None) not in ("admin", "superadmin"):
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return wrapper


def login_required(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        if not getattr(g, "user", None):
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return wrapper


@app.route("/api/audit")
@admin_required
def api_audit():
    entries = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(200).all()
    return jsonify([{"id": e.id, "user_id": e.user_id, "action": e.action, "ip": e.ip, "details": e.details, "created_at": e.created_at.isoformat()} for e in entries])


@app.route("/api/messages", methods=["POST"])
@jwt_required
def api_send_message():
    data = request.get_json() or {}
    sender_id = int(request.jwt_payload.get("sub"))
    recipient_id = int(data.get("recipient_id") or 0)
    plaintext = data.get("message", "").strip()
    if not recipient_id or not plaintext:
        return jsonify({"status": "error", "message": "Recipient and message are required."}), 400

    # simple flood detection
    throttle = MessageThrottle.query.get(sender_id)
    now_ts = datetime.utcnow().timestamp()
    window = 60  # seconds
    limit = 20
    if not throttle:
        throttle = MessageThrottle(user_id=sender_id, window_start=now_ts, count=1)
        db.session.add(throttle)
    else:
        if not throttle.window_start or now_ts - throttle.window_start > window:
            throttle.window_start = now_ts
            throttle.count = 1
        else:
            throttle.count = throttle.count + 1
    if throttle.count > limit:
        db.session.commit()
        return jsonify({"status": "error", "message": "Message rate limit exceeded."}), 429

    # encrypt message
    ciphertext = _fernet.encrypt(plaintext.encode())
    # compute HMAC
    sig = hmac.new(app.secret_key.encode(), ciphertext, hashlib.sha256).hexdigest()

    msg = Message(sender_id=sender_id, recipient_id=recipient_id, ciphertext=ciphertext, hmac_sig=sig)
    db.session.add(msg)
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({"status": "error", "message": "Failed to store message."}), 500

    log_action(sender_id, "send_message", f"to={recipient_id} msg_id={msg.id}")

    return jsonify({"status": "success", "message": "Message sent.", "id": msg.id}), 201


@app.route("/api/messages/<int:message_id>")
@jwt_required
def api_get_message(message_id):
    user_id = int(request.jwt_payload.get("sub"))
    msg = Message.query.get(message_id)
    if not msg:
        return jsonify({"status": "error", "message": "Message not found."}), 404
    if msg.recipient_id != user_id and msg.sender_id != user_id:
        return jsonify({"status": "error", "message": "Not authorized to view this message."}), 403

    # verify HMAC
    expected = hmac.new(app.secret_key.encode(), msg.ciphertext, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, msg.hmac_sig):
        return jsonify({"status": "error", "message": "Message integrity check failed."}), 500

    try:
        plaintext = _fernet.decrypt(msg.ciphertext).decode()
    except Exception:
        return jsonify({"status": "error", "message": "Failed to decrypt message."}), 500

    return jsonify({"status": "success", "message": plaintext, "from": msg.sender_id, "created_at": msg.created_at.isoformat()}), 200


@app.route("/api/devices")
@jwt_required
def api_devices():
    user_id = int(request.jwt_payload.get("sub"))
    devices = DeviceSession.query.filter_by(user_id=user_id, revoked=False).all()
    return jsonify([{"id": d.id, "device_info": d.device_info, "created_at": d.created_at.isoformat(), "last_active": d.last_active.isoformat()} for d in devices])


@app.route("/api/devices/revoke", methods=["POST"])
@jwt_required
def api_revoke_device():
    data = request.get_json() or {}
    user_id = int(request.jwt_payload.get("sub"))
    device_id = data.get("device_id")
    if not device_id:
        return jsonify({"status": "error", "message": "device_id required"}), 400
    device = DeviceSession.query.get(int(device_id))
    if not device or device.user_id != user_id:
        return jsonify({"status": "error", "message": "Not found"}), 404
    device.revoked = True
    db.session.commit()
    log_action(user_id, "revoke_device", f"device={device_id}")
    return jsonify({"status": "success", "message": "Device revoked."})


@socketio.on("connect")
def handle_connect():
    token = request.args.get("token") or request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = None
    if token:
        payload = verify_jwt(token)
    if not payload:
        print("Socket connection rejected: invalid token")
        return False
    user_id = int(payload.get("sub"))
    # attach user info to session
    request.environ["user_id"] = user_id
    log_action(user_id, "socket_connect", f"sid={request.sid}")
    emit("connected", {"message": "connected"})


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
@login_required
def dashboard():
    return render_template("dashboard.html", page="dashboard")


@app.route("/post-property")
def post_property():
    return render_template("post_property.html", page="post-property")


@app.route("/api/admin/analytics")
@admin_page_required
def api_admin_analytics():
    # Get all analytics data for admin dashboard
    pending_count = Listing.query.filter_by(verified=False).count()
    verified_count = Listing.query.filter_by(verified=True).count()
    survey_requests_count = SurveyRequest.query.count()
    interest_requests_count = InterestRequest.query.count()
    reports_count = Report.query.count()
    users_count = User.query.count()
    
    # Get status breakdown for survey requests
    survey_pending = SurveyRequest.query.filter_by(status="Pending").count()
    survey_scheduled = SurveyRequest.query.filter_by(status="Scheduled").count()
    survey_completed = SurveyRequest.query.filter_by(status="Completed").count()
    
    # Get status breakdown for interest requests
    interest_pending = InterestRequest.query.filter_by(status="Pending").count()
    interest_connected = InterestRequest.query.filter_by(status="Connected").count()
    
    # Get status breakdown for reports
    reports_open = Report.query.filter_by(status="Open").count()
    reports_resolved = Report.query.filter_by(status="Resolved").count()
    
    return jsonify({
        "listings": {
            "pending": pending_count,
            "verified": verified_count,
            "total": pending_count + verified_count,
        },
        "survey_requests": {
            "total": survey_requests_count,
            "pending": survey_pending,
            "scheduled": survey_scheduled,
            "completed": survey_completed,
        },
        "interest_requests": {
            "total": interest_requests_count,
            "pending": interest_pending,
            "connected": interest_connected,
        },
        "reports": {
            "total": reports_count,
            "open": reports_open,
            "resolved": reports_resolved,
        },
        "users": users_count,
        "recommendations": generate_admin_recommendations(
            pending_count, verified_count, survey_requests_count, 
            reports_count, interest_requests_count
        ),
    })


def generate_admin_recommendations(pending, verified, surveys, reports, interests):
    """Generate actionable recommendations based on platform metrics."""
    recommendations = []
    
    if pending > 10:
        recommendations.append({
            "priority": "high",
            "title": "High pending listings backlog",
            "message": f"You have {pending} listings awaiting verification. Consider prioritizing approvals.",
        })
    
    if surveys > verified:
        recommendations.append({
            "priority": "medium",
            "title": "Survey requests exceeding verified properties",
            "message": f"Survey requests ({surveys}) are higher than verified listings ({verified}). Check survey scheduling.",
        })
    
    if reports > 0:
        recommendations.append({
            "priority": "high",
            "title": f"{reports} active reports need review",
            "message": "Review reported issues to maintain platform trust and address fraud concerns.",
        })
    
    if interests > 50:
        recommendations.append({
            "priority": "medium",
            "title": "High buyer engagement",
            "message": f"{interests} buyer interest requests show strong platform demand.",
        })
    
    if verified > 0 and pending == 0:
        recommendations.append({
            "priority": "low",
            "title": "All listings verified",
            "message": "Great! All property listings are verified and approved.",
        })
    
    return recommendations


@app.route("/ardhimwenyewe")
@admin_page_required
def hidden_admin():
    # Superuser admin panel dedicated to site management and approval tasks.
    # Query real data from database
    pending = Listing.query.filter_by(verified=False).all()
    verified = Listing.query.filter_by(verified=True).all()
    survey_requests = SurveyRequest.query.all()
    interest_requests = InterestRequest.query.all()
    reports = Report.query.all()
    
    return render_template(
        "admin.html",
        page="admin",
        pending=[listing.to_dict() for listing in pending],
        verified=[listing.to_dict() for listing in verified],
        survey_requests=[sr.to_dict() for sr in survey_requests],
        interest_requests=[ir.to_dict() for ir in interest_requests],
        reports=[r.to_dict() for r in reports],
    )


@app.route("/admin")
def admin_dashboard():
    # Alias for /ardhimwenyewe - redirect to the dedicated admin route
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
            expires=datetime.utcnow().timestamp() + 1800,
        )
        db.session.add(reset_token)
        db.session.commit()
        reset_link = url_for("reset_password", token=token, _external=True)
        # Send password reset email (best-effort)
        try:
            send_password_reset_email(email, reset_link, temp_password)
        except Exception:
            pass

    return jsonify({"status": "success", "message": "If this email is registered, reset instructions have been sent."}), 200


@app.route("/verify-email")
def verify_email_page():
    token = request.args.get("token", "")
    return render_template("verify_email.html", token=token)


@app.route("/api/verify-email", methods=["POST", "GET"])
def api_verify_email():
    if request.method == "GET":
        token = request.args.get("token", "").strip()
        if not token:
            return render_template("verify_email.html", error="Verification token is required.")
        
        verify_data = EmailVerificationToken.query.get(token)
        if not verify_data or verify_data.expires < datetime.utcnow().timestamp():
            return render_template("verify_email.html", error="Verification token is invalid or expired.")
        
        user = User.query.filter(db.func.lower(User.email) == verify_data.email.lower()).first()
        if not user:
            return render_template("verify_email.html", error="User not found.")
        
        user.email_verified = True
        db.session.delete(verify_data)
        db.session.commit()
        return render_template("verify_email.html", success=True)
    
    # POST method
    data = request.get_json() or {}
    token = data.get("token", "").strip()
    code = data.get("code", "").strip()

    if not token and not code:
        return jsonify({"status": "error", "message": "Verification token or code is required."}), 400

    verify_data = None
    if token:
        verify_data = EmailVerificationToken.query.get(token)
    if not verify_data and code:
        verify_data = EmailVerificationToken.query.filter_by(code=code).first()

    if not verify_data or verify_data.expires < datetime.utcnow().timestamp():
        return jsonify({"status": "error", "message": "Verification token is invalid or expired."}), 400

    user = User.query.filter(db.func.lower(User.email) == verify_data.email.lower()).first()
    if not user:
        return jsonify({"status": "error", "message": "User not found."}), 404

    user.email_verified = True
    db.session.delete(verify_data)
    db.session.commit()

    return jsonify({"status": "success", "message": "Email verified successfully."}), 200


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

    # Store hashed password (do not save raw passwords)
    user.password = generate_password_hash(new_password)
    user.temp_password = None
    db.session.delete(reset_data)
    db.session.commit()

    return jsonify({"status": "success", "message": "Your password has been reset successfully."}), 200


@app.route("/api/listings")
def api_listings():
    visible_listings = []
    # Only return verified listings to the public
    for listing in Listing.query.filter_by(verified=True).order_by(Listing.created_at.desc()).all():
        if is_sample_listing(listing):
            continue
        visible_copy = listing.to_dict()
        for key in ("seller_name", "seller_email", "seller_phone", "seller_notes"):
            visible_copy.pop(key, None)
        visible_listings.append(visible_copy)
    return jsonify(visible_listings)


@app.route("/api/me")
@jwt_required
def api_me():
    payload = request.jwt_payload
    user_id = payload.get("sub")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found."}), 404
    return jsonify({"id": user.id, "name": user.name, "email": user.email, "role": user.role})


@app.route("/api/listing/<int:listing_id>")
def api_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"status": "error", "message": "Listing not found."}), 404
    return jsonify(listing.to_dict())


@app.route("/api/post-listing", methods=["POST"])
def api_post_listing():
    # Accept both JSON and multipart form
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        data = request.form
        files = request.files.getlist("photos")
    else:
        data = request.get_json() or {}
        files = []
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
    if not isinstance(coords, dict):
        coords = {}
    images = []
    # Handle file uploads
    upload_folder = os.path.join("public", "uploads")
    os.makedirs(upload_folder, exist_ok=True)
    for file in files:
        if file and file.filename:
            ext = os.path.splitext(file.filename)[1].lower()
            if ext in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
                unique_name = f"{uuid.uuid4().hex}{ext}"
                save_path = os.path.join(upload_folder, unique_name)
                file.save(save_path)
                url = f"/public/uploads/{unique_name}"
                images.append(url)

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
    # Coordinates are optional; default to 0.0 if missing
    listing.coords = {
        "lat": float(coords.get("lat", 0.0)) if coords.get("lat") else 0.0,
        "lng": float(coords.get("lng", 0.0)) if coords.get("lng") else 0.0,
    }
    if images:
        listing.images = images
    else:
        listing.images = [
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

    app.logger.debug(f"[REGISTER] Raw password: '{password}'")
    hashed = generate_password_hash(password)
    app.logger.debug(f"[REGISTER] Hashed password: '{hashed}'")
    user = User(
        name=name,
        email=email,
        password=hashed,
        role=role,
    )
    db.session.add(user)
    db.session.commit()
    # Issue tokens for the new user
    access_token = create_jwt(user.id)
    refresh_token = create_refresh_token(user.id)
    refresh_exp = datetime.utcnow() + timedelta(days=7)
    store_refresh_token(refresh_token, user.id, refresh_exp)

    session.permanent = True
    session["user_id"] = user.id
    session["last_active"] = datetime.utcnow().timestamp()
    session.modified = True
    notify_login(user.id, "New registration and login completed.")

    return jsonify({
        "status": "success",
        "message": "Account created successfully.",
        "token": access_token,
        "refresh_token": refresh_token,
    }), 201


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    if not check_csrf():
        return jsonify({"status": "error", "message": "Invalid CSRF token."}), 400
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    user = User.query.filter(db.func.lower(User.email) == email.lower()).first()
    app.logger.debug(f"[LOGIN] Raw password: '{password}'")
    if user:
        try:
            app.logger.debug(f"[LOGIN] Found user: {user.email} hash-prefix: {str(user.password)[:16]}")
        except Exception:
            app.logger.debug("[LOGIN] Found user but failed to read password field")
    # Check throttling
    throttle = LoginThrottle.query.get(email.lower())
    now_ts = datetime.utcnow().timestamp()
    if throttle and throttle.suspended_until and throttle.suspended_until > now_ts:
        return jsonify({"status": "error", "message": "Account temporarily suspended due to multiple failed login attempts. Try again later."}), 429

    # Evaluate password check and log result for debugging
    pw_ok = False
    try:
        pw_ok = check_password_hash(user.password, password) if user else False
    except Exception:
        pw_ok = False
    if not user or (not pw_ok and user.temp_password != password):
        app.logger.debug(f"[LOGIN] password match: {pw_ok}, temp_match: {user.temp_password == password if user else False}")
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

    # Email verification check removed; allow login without verification

    session.permanent = True
    session["user_id"] = user.id
    session["last_active"] = datetime.utcnow().timestamp()
    session.modified = True
    access_token = create_jwt(user.id)
    refresh_token = create_refresh_token(user.id)
    refresh_exp = datetime.utcnow() + timedelta(days=7)
    store_refresh_token(refresh_token, user.id, refresh_exp)
    notify_login(user.id, "Login successful from a recognized device.")

    message = f"Welcome back, {user.name}!"
    if user.temp_password == password:
        message = "Logged in with a temporary password. Please reset your password now."

    return jsonify({
        "status": "success",
        "message": message,
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "token": access_token,
        "refresh_token": refresh_token,
    }), 200


@app.route("/api/refresh-token", methods=["POST"])
def api_refresh_token():
    data = request.get_json() or {}
    refresh_token = data.get("refresh_token", "").strip()
    if not refresh_token:
        return jsonify({"status": "error", "message": "Refresh token required."}), 400

    payload = verify_jwt(refresh_token, expected_type="refresh")
    if not payload:
        return jsonify({"status": "error", "message": "Invalid or expired refresh token."}), 401

    refresh = RefreshToken.query.get(refresh_token)
    if not refresh or refresh.revoked or refresh.expires_at < datetime.utcnow():
        return jsonify({"status": "error", "message": "Refresh token invalid or revoked."}), 401

    new_access_token = create_jwt(int(payload.get("sub")))
    return jsonify({"status": "success", "token": new_access_token}), 200


@app.route("/api/revoke-token", methods=["POST"])
def api_revoke_token():
    data = request.get_json() or {}
    refresh_token = data.get("refresh_token", "").strip()
    if not refresh_token:
        return jsonify({"status": "error", "message": "Refresh token required."}), 400

    refresh = RefreshToken.query.get(refresh_token)
    if refresh:
        refresh.revoked = True
        db.session.commit()
        log_action(refresh.user_id, "revoke_refresh_token", f"token={refresh_token[:8]}..." )
    return jsonify({"status": "success", "message": "Refresh token revoked."}), 200


@app.route("/api/logout", methods=["POST"])
def api_logout():
    auth = request.headers.get("Authorization", "")
    refresh_token = request.get_json(silent=True) or {}.get("refresh_token", "").strip()
    if auth.startswith("Bearer "):
        access_token = auth.split(" ", 1)[1]
        payload = verify_jwt(access_token, expected_type="access")
        if payload:
            blocklist_token(payload.get("jti"), expires_at=datetime.utcfromtimestamp(payload.get("exp", 0)))
            log_action(int(payload.get("sub")), "logout", "API logout requested.")
    if refresh_token:
        refresh = RefreshToken.query.get(refresh_token)
        if refresh:
            refresh.revoked = True
            db.session.commit()
            log_action(refresh.user_id, "logout_refresh_token", f"token={refresh_token[:8]}..." )
    session.pop("user_id", None)
    session.modified = True
    return jsonify({"status": "success", "message": "Logged out."}), 200


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
    session.clear()
    session.modified = True
    return redirect(url_for("home"))


# Create database tables on app startup (needed for gunicorn/Render deployment)
# This runs for both 'python server.py' and 'gunicorn server:app'
with app.app_context():
    try:
        db.create_all()
        print("Database tables initialized")
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")


if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(debug=True)
