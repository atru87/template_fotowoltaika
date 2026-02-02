// lib/dataManager.js
// Pomocnicza biblioteka do odczytu i zapisu plików JSON
// Używana zarówno w API routes jak i server components

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Odczytuje plik JSON
 * @param {string} filename - nazwa pliku (np. 'company.json')
 * @returns {object} - sparsowany JSON
 */
export function readJSON(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

/**
 * Zapisuje dane do pliku JSON
 * @param {string} filename - nazwa pliku
 * @param {object} data - dane do zapisu
 * @returns {boolean} - sukces operacji
 */
export function writeJSON(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

/**
 * Odczytuje szablon branżowy
 * @param {string} industry - nazwa branży (np. 'fotowoltaika')
 * @returns {object} - dane szablonu
 */
export function readTemplate(industry) {
  return readJSON(`templates/${industry}.json`);
}

/**
 * Pobiera dane firmy
 */
export function getCompanyData() {
  return readJSON('company.json');
}

/**
 * Aktualizuje dane firmy
 */
export function updateCompanyData(data) {
  return writeJSON('company.json', data);
}

/**
 * Pobiera konfigurację bota
 */
export function getBotConfig() {
  return readJSON('bot-config.json');
}

/**
 * Aktualizuje konfigurację bota
 */
export function updateBotConfig(data) {
  return writeJSON('bot-config.json', data);
}

/**
 * Pobiera listę triggerów
 */
export function getTriggers() {
  return readJSON('triggers.json');
}

/**
 * Aktualizuje listę triggerów
 */
export function updateTriggers(data) {
  return writeJSON('triggers.json', data);
}

/**
 * Pobiera galerię realizacji
 */
export function getGallery() {
  return readJSON('gallery.json');
}

/**
 * Aktualizuje galerię realizacji
 */
export function updateGallery(data) {
  return writeJSON('gallery.json', data);
}

/**
 * Sprawdza dane logowania
 */
export function checkAuth(username, password) {
  const authData = readJSON('auth.json');
  if (!authData) return false;
  return authData.username === username && authData.password === password;
}
