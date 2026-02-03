'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ThemeStyles from '@/components/ui/ThemeStyles';
import { getTemplateId } from '@/config/template';

export default function KontaktPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | ok | err
  const [errMsg, setErrMsg] = useState('');
  const [theme, setTheme] = useState(null);
  const [colors, setColors] = useState(null);
  const [company, setCompany] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get template based on TEMPLATE_MODE config
    const templateId = getTemplateId(searchParams);
    
    // Load template data
    Promise.all([
      fetch(`/data/templates/${templateId}.json`).then(r => r.json()),
      fetch('/api/config?type=company').then(r => r.json())
    ])
      .then(([templateData, companyData]) => {
        setTheme(templateData.theme || {});
        setColors(templateData.colors || {});
        setCompany(companyData);
      })
      .catch(console.error);
  }, [searchParams]);

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

  const primaryColor = colors?.primary || '#10b981';
  const isLightTheme = theme?.textPrimary === '#111827';
  const templateId = getTemplateId(searchParams);
  
  const input = `w-full px-4 py-3 rounded-xl ${
    isLightTheme 
      ? 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500' 
      : 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
  } focus:outline-none transition text-sm`;

  return (
    <>
      {theme && colors && <ThemeStyles theme={theme} colors={colors} />}
      
      <Header companyName={company?.name} theme={theme} templateId={templateId} />
      <main className="min-h-screen flex items-start justify-center py-24 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className={`text-5xl font-bold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              Skontaktuj się
            </h1>
            <p className={isLightTheme ? 'text-gray-600' : 'text-gray-400'}>
              Masz pytanie? Chętnie pomożemy.
            </p>
          </div>

          {status === 'ok' ? (
            <div className={`p-10 text-center rounded-2xl ${
              isLightTheme 
                ? 'bg-white border border-gray-200' 
                : 'bg-white/5 border border-white/10'
            }`}>
              <div className="text-5xl mb-5">✉️</div>
              <h2 className={`text-2xl font-bold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                Wiadomość wysłana!
              </h2>
              <p className={`mb-6 ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                Odezwiemy się do Ciebie jak najszybciej.
              </p>
              <button 
                onClick={() => setStatus('idle')} 
                className="px-6 py-2.5 rounded-xl text-white font-medium hover:opacity-90 transition"
                style={{ backgroundColor: primaryColor }}
              >
                Wyślij kolejną
              </button>
            </div>
          ) : (
            <div className={`p-7 md:p-10 rounded-2xl ${
              isLightTheme 
                ? 'bg-white border border-gray-200' 
                : 'bg-white/5 border border-white/10'
            }`}>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLightTheme ? 'text-gray-700' : 'text-gray-400'}`}>
                      Imię i nazwisko *
                    </label>
                    <input className={input} type="text" required placeholder="Jan Kowalski"
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLightTheme ? 'text-gray-700' : 'text-gray-400'}`}>
                      Telefon
                    </label>
                    <input className={input} type="tel" placeholder="+48 …"
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLightTheme ? 'text-gray-700' : 'text-gray-400'}`}>
                    E-mail *
                  </label>
                  <input className={input} type="email" required placeholder="jan@przykład.pl"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLightTheme ? 'text-gray-700' : 'text-gray-400'}`}>
                    Wiadomość *
                  </label>
                  <textarea className={`${input} resize-none`} required rows={5} placeholder="Jak mogę Ci pomóc?"
                    value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>

                {status === 'err' && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-xl text-sm">
                    {errMsg}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="w-full px-8 py-3.5 rounded-xl text-white font-semibold transition disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {status === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer company={company} theme={theme} />
    </>
  );
}
