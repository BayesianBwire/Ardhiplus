import { ReactNode } from 'react';

export type Badge = { id?: string; label: string; variant?: string };

export type Action = { id: string; label: string; icon?: ReactNode; onClick?: () => void };

export interface Agent {
  id: string;
  name: string;
  agency?: string;
  phone?: string;
  email?: string;
  image?: string;
  rating?: number;
  verified?: boolean;
  specialization?: string[];
  bio?: string;
  listings?: number;
  reviews?: number;
}

export interface Listing {
  id: string;
  title: string;
  location?: string;
  coords?: { lat: number; lng: number } | null;
  type?: string;
  size?: string;
  price?: string | number;
  status?: string;
  images?: string[];
  ownerId?: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  listingId?: string;
  propertyTitle?: string;
  message?: string;
  unread?: boolean;
}

export interface ListingFormData {
  title: string;
  location?: string;
  coords?: { lat: number; lng: number } | null;
  type?: string;
  size?: string;
  price?: string | number;
  description?: string;
  sellerName?: string;
  sellerPhone?: string;
  images?: File[] | string[];
}

export interface UploadResult { id: string; url: string; name?: string }

export interface Doc { id: string; title: string; url: string; uploadedAt?: string }

export interface Event { id: string; type: string; message: string; date: string }

export interface ValidationResult { valid: boolean; errors?: Record<string, string> }
