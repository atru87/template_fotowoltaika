// lib/dataManager.js
// Pomocnicza biblioteka do odczytu i zapisu plików JSON
// Używana zarówno w API routes jak i server components

import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Odczytuje plik JSON
 * @param {string} filename - nazwa pliku (np. 'company.json')
 * @returns {object} - sparsowany JSON
 */
export async function readJSON(filename) {
  return await kv.get(filename.replace('.json', ''));
}

/**
 * Zapisuje dane do pliku JSON
 * @param {string} filename - nazwa pliku
 * @param {object} data - dane do zapisu
 * @returns {boolean} - sukces operacji
 */
export async function writeJSON(filename, data) {
  await kv.set(filename.replace('.json', ''), data);
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
