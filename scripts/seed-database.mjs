#!/usr/bin/env node

/**
 * Seed Firestore database with mock data
 * Usage: node scripts/seed-database.mjs [--clear] [--dry-run]
 * 
 * Options:
 *   --clear    Clear existing data before seeding
 *   --dry-run  Show what would be created without actually creating it
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { join } from 'path';
import { generateMockData } from './generate-mock-data.mjs';

// Load environment variables
import { config } from 'dotenv';
config({ path: join(process.cwd(), '.env.local') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if required env vars are set
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

const missingVars = requiredVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these in .env.local file');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');
const isDryRun = args.includes('--dry-run');

// Configuration for data generation
// Total data: ~1000 records (interactions + recommendations)
const DATA_CONFIG = {
  USER_COUNT: 300,           // 300 users
  ITEM_COUNT: 150,          // 150 items
  INTERACTION_COUNT: 600,   // 600 interactions
  RECOMMENDATION_COUNT: 400, // 400 recommendations
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  ITEMS: 'items',
  INTERACTIONS: 'interactions',
  RECOMMENDATIONS: 'recommendations',
  SYSTEM_METRICS: 'system_metrics',
  PIPELINE_STAGES: 'pipeline_stages',
};

// Helper function to convert string date to Timestamp
function toTimestamp(dateString) {
  if (!dateString) return Timestamp.now();
  try {
    return Timestamp.fromDate(new Date(dateString));
  } catch {
    return Timestamp.now();
  }
}

// Load mock data
let mockUsers, mockItems, mockInteractions, mockRecommendations, mockSystemMetrics, mockPipeline;

try {
  console.log('📦 Generating mock data...');
  
  // Generate large dataset
  const mockData = generateMockData(DATA_CONFIG);
  mockUsers = mockData.users;
  mockItems = mockData.items;
  mockInteractions = mockData.interactions;
  mockRecommendations = mockData.recommendations;
  mockSystemMetrics = mockData.systemMetrics;
  mockPipeline = mockData.pipelineStages;
  
  console.log(`   ✓ Generated ${mockUsers.length} users`);
  console.log(`   ✓ Generated ${mockItems.length} items`);
  console.log(`   ✓ Generated ${mockInteractions.length} interactions`);
  console.log(`   ✓ Generated ${mockRecommendations.length} recommendations`);
} catch (error) {
  console.error('❌ Failed to generate mock data:', error.message);
  process.exit(1);
}

// Clear collection
async function clearCollection(collectionName) {
  if (isDryRun) {
    console.log(`  [DRY RUN] Would clear collection: ${collectionName}`);
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    let count = 0;

    snapshot.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
      count++;
    });

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Cleared ${count} documents from ${collectionName}`);
    } else {
      console.log(`  ℹ Collection ${collectionName} is already empty`);
    }
  } catch (error) {
    console.error(`  ✗ Error clearing ${collectionName}:`, error.message);
  }
}

// Seed users
async function seedUsers() {
  console.log('\n👥 Seeding users...');
  
  if (isDryRun) {
    console.log(`  [DRY RUN] Would create ${mockUsers.length} users`);
    return;
  }

  // Firestore batch limit is 500 operations
  const BATCH_SIZE = 500;
  let totalCount = 0;

  for (let i = 0; i < mockUsers.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = mockUsers.slice(i, i + BATCH_SIZE);
    
    for (const user of chunk) {
      const userRef = doc(db, COLLECTIONS.USERS, user.id);
      const userData = {
        ...user,
        registrationDate: toTimestamp(user.registrationDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      delete userData.id;
      batch.set(userRef, userData);
    }

    await batch.commit();
    totalCount += chunk.length;
    console.log(`  ✓ Created ${totalCount}/${mockUsers.length} users...`);
  }
  
  console.log(`  ✅ Created ${totalCount} users`);
}

// Seed items
async function seedItems() {
  console.log('\n📦 Seeding items...');
  
  if (isDryRun) {
    console.log(`  [DRY RUN] Would create ${mockItems.length} items`);
    return;
  }

  const BATCH_SIZE = 500;
  let totalCount = 0;

  for (let i = 0; i < mockItems.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = mockItems.slice(i, i + BATCH_SIZE);
    
    for (const item of chunk) {
      const itemRef = doc(db, COLLECTIONS.ITEMS, item.id);
      const itemData = {
        ...item,
        createdAt: toTimestamp(item.createdAt),
        updatedAt: Timestamp.now(),
        ratingCount: item.ratingCount || 0,
      };
      delete itemData.id;
      batch.set(itemRef, itemData);
    }

    await batch.commit();
    totalCount += chunk.length;
    console.log(`  ✓ Created ${totalCount}/${mockItems.length} items...`);
  }
  
  console.log(`  ✅ Created ${totalCount} items`);
}

// Seed interactions
async function seedInteractions() {
  console.log('\n🔄 Seeding interactions...');
  
  if (isDryRun) {
    console.log(`  [DRY RUN] Would create ${mockInteractions.length} interactions`);
    return;
  }

  const BATCH_SIZE = 500;
  let totalCount = 0;

  for (let i = 0; i < mockInteractions.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = mockInteractions.slice(i, i + BATCH_SIZE);
    
    for (const interaction of chunk) {
      const interactionRef = doc(db, COLLECTIONS.INTERACTIONS, interaction.id);
      const interactionData = {
        ...interaction,
        timestamp: toTimestamp(interaction.timestamp),
      };
      delete interactionData.id;
      batch.set(interactionRef, interactionData);
    }

    await batch.commit();
    totalCount += chunk.length;
    console.log(`  ✓ Created ${totalCount}/${mockInteractions.length} interactions...`);
  }
  
  console.log(`  ✅ Created ${totalCount} interactions`);
}

// Seed recommendations
async function seedRecommendations() {
  console.log('\n⭐ Seeding recommendations...');
  
  if (isDryRun) {
    console.log(`  [DRY RUN] Would create ${mockRecommendations.length} recommendations`);
    return;
  }

  const BATCH_SIZE = 500;
  let totalCount = 0;

  for (let i = 0; i < mockRecommendations.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = mockRecommendations.slice(i, i + BATCH_SIZE);
    
    for (const rec of chunk) {
      const recRef = doc(db, COLLECTIONS.RECOMMENDATIONS, rec.id);
      const recData = {
        ...rec,
        timestamp: toTimestamp(rec.timestamp),
        createdAt: Timestamp.now(),
        shown: rec.shown || false,
        clicked: rec.clicked || false,
        converted: rec.converted || false,
      };
      delete recData.id;
      batch.set(recRef, recData);
    }

    await batch.commit();
    totalCount += chunk.length;
    console.log(`  ✓ Created ${totalCount}/${mockRecommendations.length} recommendations...`);
  }
  
  console.log(`  ✅ Created ${totalCount} recommendations`);
}

// Seed system metrics
async function seedSystemMetrics() {
  console.log('\n📊 Seeding system metrics...');
  
  if (isDryRun) {
    console.log('  [DRY RUN] Would create system metrics document');
    return;
  }

  const metricsRef = doc(db, COLLECTIONS.SYSTEM_METRICS, 'current');
  await setDoc(metricsRef, {
    ...mockSystemMetrics,
    lastUpdated: Timestamp.now(),
  });
  console.log('  ✓ Created system metrics');
}

// Seed pipeline stages
async function seedPipelineStages() {
  console.log('\n🔧 Seeding pipeline stages...');
  
  if (isDryRun) {
    console.log(`  [DRY RUN] Would create ${mockPipeline.length} pipeline stages`);
    return;
  }

  const batch = writeBatch(db);
  let count = 0;

  for (const stage of mockPipeline) {
    const stageId = stage.stage.toLowerCase().replace(/\s+/g, '_');
    const stageRef = doc(db, COLLECTIONS.PIPELINE_STAGES, stageId);
    const stageData = {
      ...stage,
      startedAt: Timestamp.now(),
      completedAt: Timestamp.now(),
    };
    batch.set(stageRef, stageData);
    count++;
  }

  await batch.commit();
  console.log(`  ✓ Created ${count} pipeline stages`);
}

// Main function
async function main() {
  console.log('🌱 Starting database seeding...\n');
  console.log(`Project: ${firebaseConfig.projectId}`);
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
  
  if (shouldClear) {
    console.log('\n🗑️  Clearing existing data...');
    await clearCollection(COLLECTIONS.USERS);
    await clearCollection(COLLECTIONS.ITEMS);
    await clearCollection(COLLECTIONS.INTERACTIONS);
    await clearCollection(COLLECTIONS.RECOMMENDATIONS);
    await clearCollection(COLLECTIONS.PIPELINE_STAGES);
  }

  try {
    await seedUsers();
    await seedItems();
    await seedInteractions();
    await seedRecommendations();
    await seedSystemMetrics();
    await seedPipelineStages();

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Users: ${mockUsers.length}`);
    console.log(`   - Items: ${mockItems.length}`);
    console.log(`   - Interactions: ${mockInteractions.length}`);
    console.log(`   - Recommendations: ${mockRecommendations.length}`);
    console.log(`   - Pipeline Stages: ${mockPipeline.length}`);
    console.log(`   - System Metrics: 1 document`);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run
main().catch(console.error);
