import React from 'react';
import { Agent } from './types';

export type AgentCardProps = {
  agent: Agent;
  onEmail?: (email?: string) => void;
  onCall?: (phone?: string) => void;
  onViewProfile?: (id: string) => void;
};

export default function AgentCard({ agent, onEmail, onCall, onViewProfile }: AgentCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <img src={agent.image} alt={agent.name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-white">{agent.name}</div>
          <div className="text-sm text-slate-400">{agent.agency}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-full bg-sky-500 px-3 py-2 text-sm" onClick={() => onEmail?.(agent.email)}>
          Email
        </button>
        <button className="flex-1 rounded-full border px-3 py-2 text-sm" onClick={() => onCall?.(agent.phone)}>
          Call
        </button>
      </div>
    </div>
  );
}
