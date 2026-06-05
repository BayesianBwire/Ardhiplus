import React from 'react';
import { ReactNode } from 'react';

export type HeroProps = {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  meta?: ReactNode;
};

export default function Hero({ title, subtitle, primaryLabel, onPrimary, secondaryLabel, onSecondary, meta }: HeroProps) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
      <div className="mt-4 flex gap-3">
        <button onClick={onPrimary} className="rounded-full bg-emerald-500 px-4 py-2 font-semibold">{primaryLabel}</button>
        {secondaryLabel && onSecondary && (
          <button onClick={onSecondary} className="rounded-full border px-4 py-2 text-slate-300">{secondaryLabel}</button>
        )}
      </div>
      {meta}
    </div>
  );
}
