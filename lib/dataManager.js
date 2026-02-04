// lib/dataManager.js
// Pomocnicza biblioteka do odczytu i zapisu danych
// WERSJA DLA VERCEL - używa statycznych importów zamiast fs

import { redis } from './redis';

// Sprawdź czy Redis jest dostępny
const USE_REDIS = !!process.env.REDIS_URL;

// Statyczne importy danych z folderu data (webpack je zbuduje)
// Na Vercel nie możemy używać fs.readFileSync, więc importujemy bezpośrednio
const staticData = {
  'company': () => import('@/data/company.json').then(m => m.default),
  'gallery': () => import('@/data/gallery.json').then(m => m.default),
  'bot-config': () => import('@/data/bot-config.json').then(m => m.default),
  'triggers': () => import('@/data/triggers.json').then(m => m.default),
  'auth': () => import('@/data/auth.json').then(m => m.default),
  'messages': () => import('@/data/messages.json').then(m => m.default),
  'smtp': () => import('@/data/smtp.json').then(m => m.default),
  'templates:fotowoltaika': () => import('@/data/templates/fotowoltaika.json').then(m => m.default),
  'templates:fotowoltaika-v2': () => import('@/data/templates/fotowoltaika-v2.json').then(m => m.default),
  'templates:fotowoltaika-v3': () => import('@/data/templates/fotowoltaika-v3.json').then(m => m.default),
  'templates:fotowoltaika-v4': () => import('@/data/templates/fotowoltaika-v4.json').then(m => m.default),
  'templates:fotowoltaika-v5': () => import('@/data/templates/fotowoltaika-v5.json').then(m => m.default),
};

/**
 * Odczytuje dane (z Redis lub statycznych importów)
 * @param {string} filename - nazwa pliku (np. 'company.json' lub 'templates/fotowoltaika.json')
 * @returns {object} - sparsowany JSON
 */
export async function readJSON(filename) {
  // Zamień / na : dla kluczy w Redis
  const key = filename.replace('.json', '').replace(/\//g, ':');
  
  try {
    // Jeśli Redis jest dostępny - użyj Redis
    if (USE_REDIS) {
      console.log(`Attempting to read from Redis: ${key}`);
      const data = await redis.get(key);
      
      // Jeśli nie ma w Redis, załaduj ze statycznych danych jako fallback
      if (!data) {
        console.log(`⚠️ ${key} not in Redis, loading from static data...`);
        const staticLoader = staticData[key];
        if (staticLoader) {
          const fileData = await staticLoader();
          // Zapisz do Redis na przyszłość
          console.log(`Syncing ${key} to Redis...`);
          await redis.set(key, fileData);
          return fileData;
        } else {
          console.error(`No static loader for key: ${key}`);
          return null;
        }
      } else {
        console.log(`✅ Read from Redis: ${key}`);
      }
      
      return data;
    }
    
    // Bez Redis - użyj statycznych importów
    console.log(`Redis not available (USE_REDIS=${USE_REDIS}), using static imports`);
    const staticLoader = staticData[key];
    if (staticLoader) {
      return await staticLoader();
    } else {
      console.error(`No static loader for key: ${key}`);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error);
    console.error('Error details:', error.message);
    
    // Fallback do statycznych importów
    console.log('Falling back to static imports...');
    const staticLoader = staticData[key];
    if (staticLoader) {
      return await staticLoader();
    }
    return null;
  }
}

/**
 * Zapisuje dane (tylko do Redis, na Vercel nie możemy zapisywać do plików)
 * @param {string} filename - nazwa pliku
 * @param {object} data - dane do zapisu
 * @returns {boolean} - sukces operacji
 */
export async function writeJSON(filename, data) {
  // Zamień / na : dla kluczy w Redis
  const key = filename.replace('.json', '').replace(/\//g, ':');
  
  try {
    // Jeśli Redis jest dostępny - zapisz do Redis
    if (USE_REDIS) {
      console.log(`Attempting to save to Redis: ${key}`);
      await redis.set(key, data);
      console.log(`✅ Saved to Redis: ${key}`);
      return true;
    } else {
      // Bez Redis - nie możemy zapisać na Vercel (read-only filesystem)
      console.error(`❌ Cannot save ${key} - Redis not configured and filesystem is read-only on Vercel`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error writing ${filename} to Redis:`, error);
    console.error('Error details:', error.message);
    return false;
  }
}

/**
 * Odczytuje szablon branżowy
 * @param {string} industry - nazwa branży (np. 'fotowoltaika')
 * @returns {object} - dane szablonu
 */
export async function readTemplate(industry) {
  return await readJSON(`templates/${industry}.json`);
}

/**
 * Pobiera dane firmy
 */
export async function getCompanyData() {
  return await readJSON('company.json');
}

/**
 * Aktualizuje dane firmy
 */
export async function updateCompanyData(data) {
  return await writeJSON('company.json', data);
}

/**
 * Pobiera konfigurację bota
 */
export async function getBotConfig() {
  return await readJSON('bot-config.json');
}

/**
 * Aktualizuje konfigurację bota
 */
export async function updateBotConfig(data) {
  return await writeJSON('bot-config.json', data);
}

/**
 * Pobiera listę triggerów
 */
export async function getTriggers() {
  return await readJSON('triggers.json');
}

/**
 * Aktualizuje listę triggerów
 */
export async function updateTriggers(data) {
  return await writeJSON('triggers.json', data);
}

/**
 * Pobiera galerię realizacji
 */
export async function getGallery() {
  return await readJSON('gallery.json');
}

/**
 * Aktualizuje galerię realizacji
 */
export async function updateGallery(data) {
  return await writeJSON('gallery.json', data);
}

/**
 * Sprawdza dane logowania
 */
export async function checkAuth(username, password) {
  const authData = await readJSON('auth.json');
  if (!authData) return false;
  return authData.username === username && authData.password === password;
}

/**
 * Migracja danych ze statycznych importów do Redis (uruchom raz)
 */
export async function migrateToRedis() {
  if (!USE_REDIS) {
    console.log('Redis not available, skipping migration');
    return;
  }
  
  console.log('Starting migration to Redis from static imports...');
  
  // Użyj kluczy ze staticData
  for (const [key, loader] of Object.entries(staticData)) {
    try {
      const data = await loader();
      if (data) {
        await redis.set(key, data);
        console.log(`✅ Migrated ${key} to Redis`);
      } else {
        console.log(`⚠️ Skipped ${key} (no data)`);
      }
    } catch (error) {
      console.log(`❌ Failed to migrate ${key}:`, error.message);
    }
  }
  
  console.log('Migration complete!');
}

// Backward compatibility alias
export const migrateToKV = migrateToRedis;
