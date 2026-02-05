'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function UstawieniaAdmin() {
  const [bot,      setBot]      = useState({ apiKey: '', systemPrompt: '' });
  const [smtp,     setSmtp]     = useState({ host: '', port: '587', user: '', pass: '', configured: false });
  const [messages, setMessages] = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [bR, sR, mR] = await Promise.all([
        fetch('/api/config?type=bot'),
        fetch('/api/config?type=smtp'),
        fetch('/api/config?type=messages'),
      ]);
      setBot(await bR.json());
      setSmtp(await sR.json());
      const mD = await mR.json();
      setMessages(mD?.items || []);
    } catch (e) { console.error(e); }
    finally { setLoaded(true); }
  };

  const clearCache = async () => {
    if (!confirm('Czy na pewno chcesz wyczyścić cache? Spowoduje to przeładowanie wszystkich danych ze statycznych plików.')) {
      return;
    }
    
    setClearingCache(true);
    try {
      const response = await fetch('/api/admin/clear-cache', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Cache wyczyszczony pomyślnie! ' + data.message);
        // Przeładuj dane
        await load();
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Błąd czyszczenia cache');
    } finally {
      setClearingCache(false);
    }
  };

  const saveBot = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bot', data: bot }),
      });
      if (r.ok) alert('Konfiguracja bota zapisana ✅');
      else alert('Błąd zapisu');
    } catch { alert('Błąd'); }
    finally { setSaving(false); }
  };

  const saveSmtp = async (e) => {
    e.preventDefault();
    setSavingSmtp(true);
    try {
      const smtpData = {
        ...smtp,
        configured: !!(smtp.host && smtp.user && smtp.pass)
      };
      const r = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'smtp', data: smtpData }),
      });
      if (r.ok) {
        setSmtp(smtpData);
        alert('Konfiguracja SMTP zapisana ✅');
      } else {
        alert('Błąd zapisu');
      }
    } catch { alert('Błąd'); }
    finally { setSavingSmtp(false); }
  };

  const saveMessages = async (updated) => {
    setMessages(updated);
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'messages', data: { items: updated } }),
    });
  };

  const markRead  = (id) => saveMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  const deleteMsg = (id) => saveMessages(messages.filter(m => m.id !== id));

  if (!loaded) return <div className="container mx-auto px-4 py-16 text-gray-500">Ładowanie…</div>;

  const unread = messages.filter(m => !m.read).length;

  /* ── shared input class ── */
  const inp = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm text-gray-900 bg-white";

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">⚙️ Ustawienia</h1>

        {/* ──── BOT AI ──── */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-1 text-gray-900">🤖 Bot AI</h2>
          <p className="text-gray-600 text-sm mb-4">
            Klucz API z <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">console.groq.com</a> · model: <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">llama-3.1-70b-versatile</code>
          </p>

          <form onSubmit={saveBot} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">API Key (Groq)</label>
              <input type="password" className={inp} placeholder="gsk_…"
                value={bot.apiKey} onChange={e => setBot({ ...bot, apiKey: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Prompt systemowy</label>
              <textarea className={`${inp} resize-none`} rows={3}
                placeholder="Jesteś pomocnym asystentem firmy…"
                value={bot.systemPrompt} onChange={e => setBot({ ...bot, systemPrompt: e.target.value })} />
            </div>
            <button type="submit" disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50">
              {saving ? 'Zapisywanie…' : 'Zapisz'}
            </button>
            <button type="button" onClick={clearCache} disabled={clearingCache}
              className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition text-sm disabled:opacity-50 ml-2">
              {clearingCache ? 'Czyszczenie…' : '🗑️ Wyczyść cache Redis'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            💡 Po zmianie konfiguracji w plikach, kliknij "Wyczyść cache" aby wymusić przeładowanie danych.
          </p>
        </div>

        {/* ──── SMTP KONFIGURACJA ──── */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-1 text-gray-900">📧 SMTP — wysyłanie emaili</h2>
          <p className="text-gray-600 text-sm mb-4">
            Konfiguracja serwera SMTP do wysyłania powiadomień email. Wiadomości z formularza zawsze są zapisywane — email jest dodatkowym powiadomieniem.
          </p>

          <div className={`rounded-lg p-3.5 text-sm font-medium mb-4 ${smtp.configured ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
            {smtp.configured
              ? '✅ SMTP skonfigurowane — emaile będą wysyłane na adres firmy'
              : '⚠️ SMTP nie skonfigurowane — wiadomości zapisywane tylko w panelu poniżej'}
          </div>

          <form onSubmit={saveSmtp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Host</label>
              <input type="text" className={inp} placeholder="np. smtp.gmail.com"
                value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Port</label>
              <input type="text" className={inp} placeholder="587 lub 465"
                value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">SMTP User (adres email)</label>
              <input type="email" className={inp} placeholder="twoj@email.com"
                value={smtp.user} onChange={e => setSmtp({ ...smtp, user: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Password</label>
              <input type="password" className={inp} placeholder="Hasło lub App Password dla Gmail"
                value={smtp.pass} onChange={e => setSmtp({ ...smtp, pass: e.target.value })} />
              <p className="text-xs text-gray-500 mt-1">Dla Gmail użyj App Password (hasła aplikacji)</p>
            </div>
            <button type="submit" disabled={savingSmtp}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50">
              {savingSmtp ? 'Zapisywanie…' : 'Zapisz konfigurację SMTP'}
            </button>
          </form>
        </div>

        {/* ──── WIADOMOŚCI ──── */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📨 Wiadomości z formularza</h2>
            {unread > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{unread} nowe</span>}
          </div>

          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">Brak wiadomości</p>
          ) : (
            <div className="space-y-3">
              {[...messages].reverse().map(m => (
                <div key={m.id} className={`border rounded-lg p-4 ${!m.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                        {!m.read && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">nowa</span>}
                        {m.sent  && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">email wysłany</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {m.email} {m.phone && `· ${m.phone}`} · {new Date(m.date).toLocaleString('pl-PL')}
                      </p>
                      <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {!m.read && (
                        <button onClick={() => markRead(m.id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded hover:bg-blue-200 transition">
                          ✓ Przeczytane
                        </button>
                      )}
                      <button onClick={() => deleteMsg(m.id)}
                        className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded hover:bg-red-200 transition">
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
