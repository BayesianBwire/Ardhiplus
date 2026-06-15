export interface Listing {
  id: number;
  title: string;
  location: string;
  county: string;
  size: string;
  priceNum: number; // numeric price for filtering
  price: string;
  description: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
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
  postedDate?: string;
  views?: number;
}

export const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Prime Residential Plot',
    location: 'Kileleshwa, Nairobi',
    county: 'Nairobi',
    size: '500 sqm',
    priceNum: 12500000,
    price: 'KES 12,500,000',
    type: 'Residential',
    bedrooms: 4,
    bathrooms: 3,
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
    postedDate: '2 days ago',
    views: 321,
  },
  {
    id: 2,
    title: 'Commercial Land Parcel',
    location: 'Mombasa Road, Nairobi',
    county: 'Nairobi',
    size: '1.2 acres',
    priceNum: 25750000,
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
    postedDate: '3 days ago',
    views: 198,
  },
  {
    id: 3,
    title: 'Greenfield Acreage',
    location: 'Naivasha',
    county: 'Nakuru',
    size: '3 acres',
    priceNum: 18000000,
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
    postedDate: '1 day ago',
    views: 88,
  },
  {
    id: 4,
    title: 'Beachfront Apartment',
    location: 'Nyali, Mombasa',
    county: 'Mombasa',
    size: '250 sqm',
    priceNum: 8500000,
    price: 'KES 8,500,000',
    type: 'Residential',
    bedrooms: 3,
    bathrooms: 2,
    description: 'Luxury beachfront property with verified title and survey documents.',
    verified: true,
    badge: 'Verified Survey',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 4.0833, lng: 39.3333 },
    sellerName: 'Mombasa Luxury Homes',
    sellerPhone: '+254745678901',
    sellerEmail: 'seller4@ardhiplus.co.ke',
    sellerNotes: 'Prime beachfront location with pristine title.',
    postedDate: '5 days ago',
    views: 440,
  },
  {
    id: 5,
    title: 'Family Home',
    location: 'Karen, Nairobi',
    county: 'Nairobi',
    size: '1200 sqm',
    priceNum: 35000000,
    price: 'KES 35,000,000',
    type: 'Residential',
    bedrooms: 5,
    bathrooms: 4,
    description: 'Spacious family home in gated community with verified survey.',
    verified: true,
    badge: 'Verified Survey',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45a003537e1f?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 1.2921, lng: 36.8219 },
    sellerName: 'Karen Properties',
    sellerPhone: '+254756789012',
    sellerEmail: 'seller5@ardhiplus.co.ke',
    sellerNotes: 'Excellent family home with all amenities.',
    postedDate: '6 days ago',
    views: 520,
  },
  {
    id: 6,
    title: 'Investment Plot',
    location: 'Limuru, Kiambu',
    county: 'Kiambu',
    size: '2 acres',
    priceNum: 9500000,
    price: 'KES 9,500,000',
    type: 'Land',
    description: 'Affordable investment plot in fast-developing area.',
    verified: false,
    badge: 'Survey Pending',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 1.0331, lng: 36.6473 },
    sellerName: 'Limuru Land Co.',
    sellerPhone: '+254767890123',
    sellerEmail: 'seller6@ardhiplus.co.ke',
    sellerNotes: 'Good value for money investment.',
    postedDate: '2 days ago',
    views: 134,
  },
  {
    id: 7,
    title: 'Shopping Mall Space',
    location: 'Westlands, Nairobi',
    county: 'Nairobi',
    size: '800 sqm',
    priceNum: 45000000,
    price: 'KES 45,000,000',
    type: 'Commercial',
    description: 'Prime commercial space in bustling shopping district.',
    verified: true,
    badge: 'Verified Survey',
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 1.2726, lng: 36.8062 },
    sellerName: 'Westlands Commerce Ltd',
    sellerPhone: '+254778901234',
    sellerEmail: 'seller7@ardhiplus.co.ke',
    sellerNotes: 'High foot traffic location, perfect for retail.',
    postedDate: '4 days ago',
    views: 289,
  },
  {
    id: 8,
    title: 'Farm in Kisumu',
    location: 'Kisumu',
    county: 'Kisumu',
    size: '5 acres',
    priceNum: 6000000,
    price: 'KES 6,000,000',
    type: 'Agricultural',
    description: 'Productive farm with irrigation potential.',
    verified: false,
    badge: 'Survey Pending',
    images: [
      'https://images.unsplash.com/photo-1500382017468-f049863256f0?auto=format&fit=crop&w=1200&q=80',
    ],
    coords: { lat: 0.1019, lng: 34.7617 },
    sellerName: 'Kisumu Farmers Co-op',
    sellerPhone: '+254789012345',
    sellerEmail: 'seller8@ardhiplus.co.ke',
    sellerNotes: 'Excellent agricultural land.',
    postedDate: '1 week ago',
    views: 98,
  },
];
