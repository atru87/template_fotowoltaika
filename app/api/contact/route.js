// app/api/contact/route.js
// Zapisuje wiadomość z formularza do KV/pliku
// Jeśli skonfigurowany SMTP (z smtp.json) → wysyła email via fetch do własnego SMTP helper
// Bez dodatkowych packages — nodemailer NIE jest potrzebny

import { NextResponse } from 'next/server';
import { getCompanyData, readJSON, writeJSON } from '@/lib/dataManager';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Brak wymaganych pól (imię, email, wiadomość)' }, { status: 400 });
    }

    // ── 1. Zapisz wiadomość do storage ──
    const company  = await getCompanyData();
    const store    = await readJSON('messages.json') || { items: [] };

    store.items.push({
      id:      Date.now(),
      name, email, phone, message,
      date:    new Date().toISOString(),
      read:    false,
      sent:    false,
    });

    await writeJSON('messages.json', store);

    // ── 2. Spróbuj wysłać email jeśli SMTP skonfigurowany ──
    const smtpConfig = await readJSON('smtp.json') || {};
    const { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass, configured } = smtpConfig;
    const toEmail  = company?.email;

    if (configured && smtpHost && smtpUser && smtpPass && toEmail) {
      try {
        // Dynamiczny import — tylko gdy SMTP jest skonfigurowany
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort || '587'),
          secure: smtpPort === '465',
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from:    `"${company?.name || 'Formularz'}" <${smtpUser}>`,
          to:      toEmail,
          replyTo: email,
          subject: `[${company?.name || 'Firma'}] Nowa wiadomość od ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
              <h2 style="color:#10b981;margin-top:0">Nowa wiadomość z formularza</h2>
              <hr style="border:none;border-top:1px solid #e5e7eb">
              <p><b>Imię:</b> ${name}</p>
              <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
              ${phone ? `<p><b>Telefon:</b> ${phone}</p>` : ''}
              <hr style="border:none;border-top:1px solid #e5e7eb">
              <p><b>Wiadomość:</b></p>
              <p style="background:#f3f4f6;padding:14px;border-radius:8px;white-space:pre-wrap">${message}</p>
              <hr style="border:none;border-top:1px solid #e5e7eb">
              <p style="color:#9ca3af;font-size:12px">
                Wysłane ${new Date().toLocaleString('pl-PL')}
              </p>
            </div>
          `,
        });

        // Oznacz jako wysłaną
        const last = store.items[store.items.length - 1];
        last.sent = true;
        await writeJSON('messages.json', store);

      } catch (emailErr) {
        // Email nie poszedł, ale wiadomość jest już zapisana — to wystarczy
        console.error('Email send failed (message still saved):', emailErr.message);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Błąd serwera. Spróbuj za chwilę lub zadzwoń.' }, { status: 500 });
  }
}
