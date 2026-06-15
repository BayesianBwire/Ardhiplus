#!/usr/bin/env python
"""Quick DB contents inspector for listings

prints counts and sample rows to help debugging admin vs deployed differences
"""
from server import app, db, Listing, is_sample_listing


def inspect():
    with app.app_context():
        total = Listing.query.count()
        verified = Listing.query.filter_by(verified=True).count()
        unverified = Listing.query.filter_by(verified=False).count()
        samples = 0
        sample_examples = []
        for l in Listing.query.order_by(Listing.created_at.desc()).limit(20).all():
            if is_sample_listing(l):
                samples += 1
            if len(sample_examples) < 5:
                sample_examples.append({
                    'id': l.id,
                    'title': l.title,
                    'seller_email': l.seller_email,
                    'verified': l.verified,
                    'badge': l.badge,
                })
        out = []
        out.append(f"Total listings: {total}")
        out.append(f"Verified: {verified}")
        out.append(f"Unverified: {unverified}")
        out.append(f"Sample-like entries in recent 20: {samples}")
        out.append('\nSample rows:')
        for s in sample_examples:
            out.append(str(s))
        # write to a file so the runner can read it reliably
        with open('check_db_output.txt', 'w', encoding='utf-8') as fh:
            fh.write('\n'.join(out))


if __name__ == '__main__':
    inspect()
