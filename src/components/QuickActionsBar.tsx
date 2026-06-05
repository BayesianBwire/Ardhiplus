import React from 'react';
import { Action } from './types';

export type QuickActionsBarProps = { actions: Action[]; sticky?: boolean };

export default function QuickActionsBar({ actions, sticky = false }: QuickActionsBarProps) {
  return (
    <div className={`${sticky ? 'fixed bottom-4 left-4 right-4' : ''} flex gap-3`}>
      {actions.map((a) => (
        <button key={a.id} onClick={a.onClick} className="rounded-full bg-emerald-500 px-4 py-2 font-semibold">{a.label}</button>
      ))}
    </div>
  );
}
