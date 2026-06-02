export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  agency: string;
  verified: boolean;
  rating: number;
  reviews: number;
  listings: number;
  specialization: string[];
  image: string;
  bio: string;
  joinDate: string;
  website?: string;
  testimonials?: string[];
}

export const mockAgents: Agent[] = [
  {
    id: 1,
    name: 'Samuel Kipchoge',
    email: 'samuel.kipchoge@ardhiplus.co.ke',
    phone: '+254712345678',
    agency: 'Ardhi Plus Agency',
    verified: true,
    rating: 4.9,
    reviews: 48,
    listings: 12,
    specialization: ['Residential', 'Land'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    bio: 'Licensed agent with 8+ years experience in residential and land sales. Expert in Nairobi market.',
    joinDate: '2016',
    website: 'https://ardhiplus.co.ke/agents/samuel',
    testimonials: ['Helped sell my 2-acre plot in 2 weeks — reliable and transparent.']
  },
  {
    id: 2,
    name: 'Grace Muthoni',
    email: 'grace.muthoni@ardhiplus.co.ke',
    phone: '+254723456789',
    agency: 'Nairobi Trading Estate',
    verified: true,
    rating: 4.8,
    reviews: 36,
    listings: 8,
    specialization: ['Commercial', 'Industrial'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    bio: 'Commercial property specialist. Trusted by major corporations for office and retail spaces.',
    joinDate: '2018',
    website: 'https://nairobi-trading.example.com/grace',
    testimonials: ['Great at matching commercial buyers to the right properties.']
  },
  {
    id: 3,
    name: 'David Kimani',
    email: 'david.kimani@ardhiplus.co.ke',
    phone: '+254734567890',
    agency: 'Nairobi Ventures Ltd',
    verified: true,
    rating: 4.7,
    reviews: 42,
    listings: 15,
    specialization: ['Residential', 'Commercial', 'Land'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    bio: 'Multi-specialized agent covering all property types. Known for fair deals and excellent customer service.',
    joinDate: '2017',
    website: 'https://nairobiventures.example.com/david',
    testimonials: ['Excellent communication and fair pricing guidance.']
  },
  {
    id: 4,
    name: 'Rose Omondi',
    email: 'rose.omondi@ardhiplus.co.ke',
    phone: '+254745678901',
    agency: 'Mombasa Luxury Homes',
    verified: true,
    rating: 4.9,
    reviews: 31,
    listings: 7,
    specialization: ['Luxury', 'Beachfront', 'Residential'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    bio: 'Luxury property expert in Mombasa. Specializes in high-end beachfront and residential properties.',
    joinDate: '2019',
    website: 'https://mombasalux.example.com/rose',
    testimonials: ['Professional and attentive for luxury listings.']
  },
  {
    id: 5,
    name: 'James Kiplagat',
    email: 'james.kiplagat@ardhiplus.co.ke',
    phone: '+254756789012',
    agency: 'Karen Properties',
    verified: true,
    rating: 4.6,
    reviews: 28,
    listings: 11,
    specialization: ['Residential', 'Land', 'Investment'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    bio: 'Investment property specialist with focus on Karen and surrounding estates.',
    joinDate: '2015',
    website: 'https://karenprops.example.com/james',
    testimonials: ['Strong network for high-value buyers in Karen.']
  },
  {
    id: 6,
    name: 'Amina Hassan',
    email: 'amina.hassan@ardhiplus.co.ke',
    phone: '+254767890123',
    agency: 'Limuru Land Co.',
    verified: false,
    rating: 4.5,
    reviews: 19,
    listings: 6,
    specialization: ['Land', 'Agricultural', 'Investment'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    bio: 'Agricultural land specialist. Expert in Limuru and upcountry properties.',
    joinDate: '2020',
    website: 'https://limuruland.example.com/amina',
    testimonials: ['Knowledgeable about agricultural land and farming communities.']
  },
];
