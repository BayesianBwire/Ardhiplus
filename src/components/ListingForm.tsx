import React, { useState } from 'react';
import { ListingFormData, ValidationResult, UploadResult } from './types';

export type ListingFormProps = {
  initial?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData) => Promise<void>;
  onSaveDraft?: (data: Partial<ListingFormData>) => void;
  validate?: (data: Partial<ListingFormData>) => ValidationResult;
};

export default function ListingForm({ initial = {}, onSubmit }: ListingFormProps) {
  const [title, setTitle] = useState(initial.title || '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ title } as ListingFormData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full" />
      </label>
      <div>
        <button type="submit" className="rounded-full bg-sky-500 px-4 py-2">Save</button>
      </div>
    </form>
  );
}
