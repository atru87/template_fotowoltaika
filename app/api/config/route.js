import { NextResponse } from 'next/server';
import {
  getCompanyData,  updateCompanyData,
  getBotConfig,    updateBotConfig,
  getTriggers,     updateTriggers,
  readJSON,        writeJSON,
} from '@/lib/dataManager';

export async function GET(request) {
  const type = new URL(request.url).searchParams.get('type');
  try {
    let data;
    switch (type) {
      case 'company':     data = await getCompanyData();                          break;
      case 'bot':         data = await getBotConfig();                            break;
      case 'triggers':    data = await getTriggers();                             break;
      case 'messages':    data = await readJSON('messages.json') || { items: [] }; break;
      case 'smtp':
      case 'smtp-check':
        data = await readJSON('smtp.json') || { host: '', port: '587', user: '', pass: '', configured: false };
        break;
      case 'theme':
        // Return current theme based on SELECTED_INDUSTRY
        // In production, this would read from a config file
        const fs = require('fs');
        const path = require('path');
        const SELECTED_INDUSTRY = 'fotowoltaika'; // TODO: make this configurable
        const templatePath = path.join(process.cwd(), 'data', 'templates', `${SELECTED_INDUSTRY}.json`);
        const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        data = { theme: templateData.theme, colors: templateData.colors };
        break;
      default:
        return NextResponse.json({ error: 'Nieprawidłowy typ' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('GET /api/config', e);
    return NextResponse.json({ error: 'Błąd pobierania' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    let ok;
    switch (type) {
      case 'company':  ok = await updateCompanyData(data); break;
      case 'bot':      ok = await updateBotConfig(data);   break;
      case 'triggers': ok = await updateTriggers(data);    break;
      case 'messages': ok = await writeJSON('messages.json', data); break;
      case 'smtp':     ok = await writeJSON('smtp.json', data); break;
      default:
        return NextResponse.json({ error: 'Nieprawidłowy typ' }, { status: 400 });
    }
    return ok
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: 'Błąd zapisu' }, { status: 500 });
  } catch (e) {
    console.error('POST /api/config', e);
    return NextResponse.json({ error: 'Błąd aktualizacji' }, { status: 500 });
  }
}
