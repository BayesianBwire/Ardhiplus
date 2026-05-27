#!/usr/bin/env python
"""
Comprehensive email diagnostic script for Render deployment.
Run this in the Render shell to diagnose SMTP and email verification issues.
"""
import os
import sys
from dotenv import load_dotenv

# Load .env first
load_dotenv()

print("=" * 70)
print("ARDHI PLUS EMAIL DIAGNOSTIC REPORT")
print("=" * 70)

# Check 1: Environment variables
print("\n[1] SMTP Environment Variables")
print("-" * 70)
smtp_host = os.environ.get("SMTP_HOST")
smtp_port = os.environ.get("SMTP_PORT")
smtp_user = os.environ.get("SMTP_USER")
smtp_pass = os.environ.get("SMTP_PASS")
email_sender = os.environ.get("EMAIL_SENDER")

print(f"SMTP_HOST: {smtp_host}")
print(f"SMTP_PORT: {smtp_port}")
print(f"SMTP_USER: {smtp_user}")
print(f"SMTP_PASS: {'*' * len(smtp_pass) if smtp_pass else 'NOT SET'}")
print(f"EMAIL_SENDER: {email_sender}")

if not smtp_host or not smtp_user or not smtp_pass:
    print("\n❌ ERROR: SMTP configuration incomplete!")
    print("   Missing: ", end="")
    missing = []
    if not smtp_host:
        missing.append("SMTP_HOST")
    if not smtp_user:
        missing.append("SMTP_USER")
    if not smtp_pass:
        missing.append("SMTP_PASS")
    print(", ".join(missing))
    sys.exit(1)

print("\n✓ SMTP environment variables found")

# Check 2: Test SMTP connection and authentication
print("\n[2] SMTP Connection Test")
print("-" * 70)

import smtplib
import ssl

try:
    print(f"Connecting to {smtp_host}:{smtp_port}...")
    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_host, int(smtp_port), timeout=10) as server:
        print(f"✓ Connected to SMTP server")
        
        print(f"Starting TLS...")
        server.starttls(context=context)
        print(f"✓ TLS handshake successful")
        
        print(f"Authenticating as {smtp_user}...")
        server.login(smtp_user, smtp_pass)
        print(f"✓ Authentication successful")
        
    print("\n✓ SMTP configuration is valid and working!")
    
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ AUTHENTICATION FAILED")
    print(f"   Error: {e}")
    print(f"   Check your SMTP_USER and SMTP_PASS credentials")
    sys.exit(1)
    
except smtplib.SMTPException as e:
    print(f"\n❌ SMTP ERROR")
    print(f"   Error: {e}")
    print(f"   Check SMTP_HOST and SMTP_PORT")
    sys.exit(1)
    
except Exception as e:
    print(f"\n❌ CONNECTION ERROR")
    print(f"   Error: {e}")
    print(f"   Check network connectivity and firewall rules")
    sys.exit(1)

# Check 3: Test email send
print("\n[3] Test Email Send")
print("-" * 70)

from server import app, send_email

test_recipient = os.environ.get("TEST_EMAIL_TO", "bilfordderick@gmail.com")
print(f"Sending test email to: {test_recipient}")

with app.app_context():
    success = send_email(
        test_recipient,
        "Ardhi Plus Test Email",
        "This is a test email from the diagnostic script. If you received this, SMTP is working!",
        "<p>This is a test email from the diagnostic script.</p><p>If you received this, SMTP is working!</p>"
    )
    
    if success:
        print(f"✓ Test email sent successfully!")
    else:
        print(f"❌ Test email send failed")
        print(f"   Check logs above for details")
        sys.exit(1)

# Check 4: Test database and email verification token creation
print("\n[4] Database and Email Verification")
print("-" * 70)

with app.app_context():
    from server import db, User, EmailVerificationToken
    from datetime import datetime
    import secrets
    
    # Create a test user
    test_email = f"diagnostic-test-{secrets.token_hex(4)}@example.com"
    print(f"Creating test user: {test_email}")
    
    try:
        test_user = User(
            name="Diagnostic Test",
            email=test_email,
            password="test_hash",
            role="broker",
        )
        db.session.add(test_user)
        db.session.commit()
        print(f"✓ Test user created (ID: {test_user.id})")
        
        # Create verification token
        verification_token = secrets.token_urlsafe(24)
        verification_code = secrets.token_hex(3).upper()
        email_verification = EmailVerificationToken(
            token=verification_token,
            email=test_user.email,
            code=verification_code,
            expires=datetime.utcnow().timestamp() + 3600,
        )
        db.session.add(email_verification)
        db.session.commit()
        print(f"✓ Email verification token created")
        
        # Clean up
        db.session.delete(email_verification)
        db.session.delete(test_user)
        db.session.commit()
        print(f"✓ Test data cleaned up")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        sys.exit(1)

# Summary
print("\n" + "=" * 70)
print("DIAGNOSTIC COMPLETE: All systems operational! ✓")
print("=" * 70)
print("\nSummary:")
print("  • SMTP configuration is valid")
print("  • SMTP connection and authentication successful")
print("  • Test email sent successfully")
print("  • Database and verification tokens working")
print("\nIf users are not receiving emails:")
print("  1. Check the email provider's spam/filter settings")
print("  2. Verify SPF/DKIM/DMARC records for your domain")
print("  3. Check email provider's sending limits")
print("  4. Review Render logs for any related errors")
