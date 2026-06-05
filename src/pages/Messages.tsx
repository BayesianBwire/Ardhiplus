import MessagesCenter from '../components/MessagesCenter';

export default function Messages() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Messages</h1>
        <p className="mt-3 text-slate-400">Keep the conversation going with buyers, agents, and your internal team.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <MessagesCenter />
      </div>
    </section>
  );
}
