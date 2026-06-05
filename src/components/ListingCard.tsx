import React from 'react';
import { Listing } from './types';

export type ListingCardProps = {
  listing: Listing;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
};

export default function ListingCard({ listing, onEdit, onShare }: ListingCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
      <div className="font-semibold text-white">{listing.title}</div>
      <div className="text-sm text-slate-400">{listing.location}</div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-full bg-sky-500 px-3 py-1 text-sm" onClick={() => onEdit?.(listing.id)}>Edit</button>
        <button className="rounded-full border px-3 py-1 text-sm" onClick={() => onShare?.(listing.id)}>Share</button>
      </div>
    </div>
  );
}
