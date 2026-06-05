import { useState } from 'react';
import { Link } from 'react-router-dom';

type Message = { id: string; from: string; text: string; time: string };
type Conversation = { id: string; name: string; last: string; unread?: boolean; messages: Message[] };

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    name: 'John Kamau',
    last: 'Interested in Naivasha plot',
    unread: true,
    messages: [
      { id: 'm1', from: 'John', text: 'Hello, is Naivasha plot still available?', time: '2026-06-01T09:15:00Z' },
      { id: 'm2', from: 'You', text: 'Yes — would you like a viewing?', time: '2026-06-01T09:20:00Z' },
    ],
  },
  {
    id: 'c2',
    name: 'Mary Achieng',
    last: 'Requested callback',
    unread: false,
    messages: [{ id: 'm3', from: 'Mary', text: 'Please call me tomorrow', time: '2026-05-28T14:40:00Z' }],
  },
];

export default function MessagesCenter() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [active, setActive] = useState<string | null>(conversations[0]?.id ?? null);
  const [input, setInput] = useState('');

  function sendMessage() {
    if (!active || !input.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === active ? { ...c, messages: [...c.messages, { id: Date.now().toString(), from: 'You', text: input.trim(), time: new Date().toISOString() }], last: input.trim(), unread: false } : c))
    );
    setInput('');
  }

  const activeConv = conversations.find((c) => c.id === active) ?? null;

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Messages</h3>
        <Link to="/messages" className="text-sm text-slate-400">Open full</Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-2">
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)} className={`w-full text-left rounded-lg p-3 ${c.id === active ? 'bg-slate-950' : 'bg-slate-950/40'}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">{c.name}</div>
                {c.unread && <span className="text-amber-300 text-xs">●</span>}
              </div>
              <div className="text-xs text-slate-400 truncate">{c.last}</div>
            </button>
          ))}
        </div>
        <div className="col-span-2 flex flex-col">
          {activeConv ? (
            <div className="flex h-64 flex-col overflow-y-auto rounded-lg bg-slate-950 p-3">
              {activeConv.messages.map((m) => (
                <div key={m.id} className={`mb-2 max-w-[80%] ${m.from === 'You' ? 'self-end bg-emerald-500/10' : 'self-start bg-slate-800/60'} rounded p-2`}> 
                  <div className="text-xs text-slate-400">{m.from} • {new Date(m.time).toLocaleString()}</div>
                  <div className="mt-1 text-sm text-slate-200">{m.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 rounded-lg bg-slate-950 p-4 text-slate-400">Select a conversation</div>
          )}

          <div className="mt-3 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message" className="flex-1 rounded bg-slate-950 px-3 py-2 text-sm text-slate-100" />
            <button onClick={sendMessage} className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
