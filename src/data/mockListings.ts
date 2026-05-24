export interface Listing {
  id: number;
  title: string;
  location: string;
  size: string;
  price: string;
  description: string;
  type: string;
  verified: boolean;
  badge: string;
  images: string[];
  coords: {
    lat: number;
    lng: number;
  };
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  sellerNotes?: string;
}

export const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Prime Residential Plot',
    location: 'Nairobi, Kenya',
    size: '500 sqm',
    price: 'KES 12,500,000',
    type: 'Residential',
    description: 'Verified by our survey team with full boundary mapping and title review.',
    verified: true,
    badge: 'Verified Survey',
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 1.2921, lng: 36.8219 },
    sellerName: 'Ardhi Plus Agency',
    sellerPhone: '+254712345678',
    sellerEmail: 'seller1@ardhiplus.co.ke',
    sellerNotes: 'Seller is an accredited land broker with verified title documents.',
  },
  {
    id: 2,
    title: 'Commercial Land Parcel',
    location: 'Mombasa Road, Nairobi',
    size: '1.2 acres',
    price: 'KES 25,750,000',
    type: 'Commercial',
    description: 'Ideal for construction with pre-approved survey reports.',
    verified: true,
    badge: 'Trust Badge',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 1.316, lng: 36.84 },
    sellerName: 'Nairobi Trading Estate',
    sellerPhone: '+254723456789',
    sellerEmail: 'seller2@ardhiplus.co.ke',
    sellerNotes: 'Seller has completed the initial survey and boundary review.',
  },
  {
    id: 3,
    title: 'Greenfield Acreage',
    location: 'Naivasha, Kenya',
    size: '3 acres',
    price: 'KES 18,000,000',
    type: 'Agricultural',
    description: 'Survey request services available; contact a surveyor before purchase.',
    verified: false,
    badge: 'Survey Pending',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 0.7667, lng: 36.4333 },
    sellerName: 'Lakeview Farms Ltd',
    sellerPhone: '+254734567890',
    sellerEmail: 'seller3@ardhiplus.co.ke',
    sellerNotes: 'Pending survey verification and title clearance.',
  },
];
