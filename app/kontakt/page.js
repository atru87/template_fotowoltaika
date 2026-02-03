'use client';
import { useState } from 'react';
import Header from '@/components/ui/Header';

export default function KontaktPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | err
  const [errMsg, setErrMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');
    try {
      const r  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d  = await r.json();
      if (r.ok) {
        setStatus('ok');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setErrMsg(d.error || 'Coś poszło nie tak');
        setStatus('err');
      }
    } catch {
      setErrMsg('Błąd połączenia. Spróbuj za chwilę.');
      setStatus('err');
    }
  };

  const input = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition text-sm";

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-start justify-center py-24 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-2">Skontaktuj się</h1>
            <p className="text-gray-400">Masz pytanie? Chętnie pomożemy.</p>
          </div>

          {status === 'ok' ? (
            <div className="glass p-10 text-center">
              <div className="text-5xl mb-5">✉️</div>
              <h2 className="text-2xl font-bold text-white mb-2">Wiadomość wysłana!</h2>
              <p className="text-gray-400 mb-6">Odezwiemy się do Ciebie jak najszybciej.</p>
              <button onClick={() => setStatus('idle')} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition">
                Wyślij kolejną
              </button>
            </div>
          ) : (
            <div className="glass p-7 md:p-10">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Imię i nazwisko *</label>
                    <input className={input} type="text" required placeholder="Jan Kowalski"
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Telefon</label>
                    <input className={input} type="tel" placeholder="+48 …"
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">E-mail *</label>
                  <input className={input} type="email" required placeholder="jan@przykład.pl"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Wiadomość *</label>
                  <textarea className={`${input} resize-none`} required rows={5} placeholder="Jak mogę Ci pomóc?"
                    value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>

                {status === 'err' && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-xl text-sm">{errMsg}</div>
                )}

                <button type="submit" disabled={status === 'sending'}
                  className="w-full px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition disabled:opacity-50">
                  {status === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
