import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
        const SELECTED_INDUSTRY = 'fotowoltaika'; // TODO: make this configurable
        const templateData = await readJSON(`templates/${SELECTED_INDUSTRY}.json`);
        if (templateData) {
          data = { theme: templateData.theme, colors: templateData.colors };
        } else {
          return NextResponse.json({ error: 'Szablon nie znaleziony' }, { status: 404 });
        }
        break;
      default:
        return NextResponse.json({ error: 'Nieprawidłowy typ' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('GET /api/config error:', e);
    console.error('Error details:', e.message);
    return NextResponse.json({ error: `Błąd pobierania: ${e.message}` }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    let ok;
    switch (type) {
      case 'company':  
        ok = await updateCompanyData(data); 
        // Rewaliduj strony które używają danych firmy
        if (ok) {
          revalidatePath('/');
          revalidatePath('/kontakt');
        }
        break;
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
    console.error('POST /api/config error:', e);
    console.error('Error details:', e.message);
    return NextResponse.json({ error: `Błąd aktualizacji: ${e.message}` }, { status: 500 });
  }
}
