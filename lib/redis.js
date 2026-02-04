// lib/redis.js
// Helper dla połączenia z Redis używając node-redis

import { createClient } from 'redis';

let client = null;

export async function getRedisClient() {
  if (!client) {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL is not configured');
    }
    
    client = createClient({
      url: process.env.REDIS_URL,
    });
    
    client.on('error', (err) => console.error('Redis Client Error', err));
    
    await client.connect();
  }
  
  return client;
}

// Wrapper funkcje dla kompatybilności z @vercel/kv API
export const redis = {
  async get(key) {
    const client = await getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },
  
  async set(key, value) {
    const client = await getRedisClient();
    await client.set(key, JSON.stringify(value));
    return true;
  },
  
  async del(key) {
    const client = await getRedisClient();
    await client.del(key);
    return true;
  },
  
  async keys(pattern) {
    const client = await getRedisClient();
    return await client.keys(pattern);
  },
  
  async ping() {
    const client = await getRedisClient();
    return await client.ping();
  }
};
