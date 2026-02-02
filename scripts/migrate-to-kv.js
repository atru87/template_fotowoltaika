// scripts/migrate-to-kv.js
// Jednorazowy skrypt migracji danych z plików JSON do Vercel KV
// Uruchom: node scripts/migrate-to-kv.js

import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

async function migrate() {
  console.log('🚀 Starting migration to Vercel KV...\n');
  
  const files = [
    'gallery.json',
    'company.json',
    'bot-config.json',
    'triggers.json',
    'auth.json'
  ];
  
  for (const filename of files) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping...`);
        continue;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      const key = filename.replace('.json', '');
      
      await kv.set(key, data);
      console.log(`✅ Migrated ${filename} → KV key: "${key}"`);
      console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
      
    } catch (error) {
      console.error(`❌ Error migrating ${filename}:`, error.message);
    }
  }
  
  console.log('\n🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Rename lib/dataManager.js → lib/dataManager-old.js');
  console.log('2. Rename lib/dataManager-kv.js → lib/dataManager.js');
  console.log('3. Run: npm install @vercel/kv');
  console.log('4. Deploy to Vercel');
  console.log('\nYour data is now in Vercel KV and will persist across deployments! 🚀');
}

migrate().catch(console.error);
