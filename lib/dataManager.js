// lib/dataManager.js
// Pomocnicza biblioteka do odczytu i zapisu danych
// WERSJA Z VERCEL KV - działa na Vercel (serverless)

import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USE_KV = process.env.KV_REST_API_URL ? true : false; // Auto-detect Vercel KV

/**
 * Odczytuje dane (z KV lub pliku JSON)
 * @param {string} filename - nazwa pliku (np. 'company.json')
 * @returns {object} - sparsowany JSON
 */
export async function readJSON(filename) {
  const key = filename.replace('.json', '');
  
  try {
    // Jeśli Vercel KV jest dostępne - użyj KV
    if (USE_KV) {
      console.log(`Attempting to read from KV: ${key}`);
      const data = await kv.get(key);
      
      // Jeśli nie ma w KV, załaduj z pliku jako fallback
      if (!data) {
        console.log(`⚠️ ${key} not in KV, loading from file...`);
        const fileData = readJSONFromFile(filename);
        if (fileData) {
          // Zapisz do KV na przyszłość
          console.log(`Syncing ${key} to KV...`);
          await kv.set(key, fileData);
          return fileData;
        }
      } else {
        console.log(`✅ Read from KV: ${key}`);
      }
      
      return data;
    }
    
    // Lokalnie - użyj pliku
    console.log(`KV not available (USE_KV=${USE_KV}), using file system`);
    return readJSONFromFile(filename);
    
  } catch (error) {
    console.error(`❌ Error reading ${filename} from KV:`, error);
    console.error('Error details:', error.message);
    
    // Fallback do pliku
    console.log('Falling back to file system...');
    return readJSONFromFile(filename);
  }
}

/**
 * Odczytuje plik JSON z dysku (fallback/lokalnie)
 */
function readJSONFromFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return null;
  }
}

/**
 * Zapisuje dane (do KV lub pliku JSON)
 * @param {string} filename - nazwa pliku
 * @param {object} data - dane do zapisu
 * @returns {boolean} - sukces operacji
 */
export async function writeJSON(filename, data) {
  const key = filename.replace('.json', '');
  
  try {
    // Jeśli Vercel KV jest dostępne - użyj KV
    if (USE_KV) {
      console.log(`Attempting to save to KV: ${key}`);
      await kv.set(key, data);
      console.log(`✅ Saved to KV: ${key}`);
      
      // Dodatkowo zapisz do pliku jako backup
      writeJSONToFile(filename, data);
      return true;
    }
    
    // Lokalnie - zapisz do pliku
    console.log(`KV not available (USE_KV=${USE_KV}), using file system`);
    return writeJSONToFile(filename, data);
    
  } catch (error) {
    console.error(`❌ Error writing ${filename} to KV:`, error);
    console.error('Error details:', error.message);
    
    // Próbuj zapisać do pliku jako fallback
    console.log('Falling back to file system...');
    return writeJSONToFile(filename, data);
  }
}

/**
 * Zapisuje plik JSON na dysk (lokalnie)
 */
function writeJSONToFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    
    // Sprawdź uprawnienia
    if (!fs.existsSync(DATA_DIR)) {
      console.error(`Data directory does not exist: ${DATA_DIR}`);
      return false;
    }
    
    try {
      fs.accessSync(DATA_DIR, fs.constants.W_OK);
    } catch (err) {
      console.error(`No write permission for: ${DATA_DIR}`, err);
      return false;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Saved to file: ${filename}`);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
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
 * Migracja danych z plików do KV (uruchom raz)
 */
export async function migrateToKV() {
  if (!USE_KV) {
    console.log('KV not available, skipping migration');
    return;
  }
  
  console.log('Starting migration to KV...');
  
  const files = [
    'gallery.json',
    'company.json', 
    'bot-config.json',
    'triggers.json',
    'auth.json'
  ];
  
  for (const filename of files) {
    const data = readJSONFromFile(filename);
    if (data) {
      const key = filename.replace('.json', '');
      await kv.set(key, data);
      console.log(`✅ Migrated ${filename} to KV`);
    }
  }
  
  console.log('Migration complete!');
}
