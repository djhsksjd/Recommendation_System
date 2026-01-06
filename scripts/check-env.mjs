#!/usr/bin/env node

/**
 * Check if environment variables are properly set
 */

import fs from 'fs';
import path from 'path';

const envFilePath = path.join(process.cwd(), '.env.local');

console.log('🔍 Checking environment variables...\n');

// Check if file exists
if (!fs.existsSync(envFilePath)) {
  console.error('❌ .env.local file not found!');
  console.log('\nPlease create .env.local file with your Firebase configuration.');
  process.exit(1);
}

console.log('✅ .env.local file exists\n');

// Read and parse file
const envContent = fs.readFileSync(envFilePath, 'utf8');
const lines = envContent.split('\n');

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const foundVars = {};
const missingVars = [];

lines.forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      const varName = key.trim();
      const varValue = valueParts.join('=').trim();
      foundVars[varName] = varValue;
    }
  }
});

console.log('📋 Environment Variables Status:\n');

requiredVars.forEach((varName) => {
  if (foundVars[varName]) {
    const value = foundVars[varName];
    const masked = value.length > 10 
      ? value.substring(0, 4) + '...' + value.substring(value.length - 4) 
      : '***';
    console.log(`  ✅ ${varName}: ${masked}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    missingVars.push(varName);
  }
});

console.log('\n' + '='.repeat(50));

if (missingVars.length === 0) {
  console.log('✅ All required environment variables are set!');
  console.log('\n💡 Next steps:');
  console.log('   1. Make sure your dev server is restarted');
  console.log('   2. Stop the server (Ctrl+C) and run: npm run dev');
  console.log('   3. Check the browser console for any errors');
} else {
  console.error(`❌ Missing ${missingVars.length} environment variable(s):`);
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.log('\nPlease add these to your .env.local file.');
  process.exit(1);
}

