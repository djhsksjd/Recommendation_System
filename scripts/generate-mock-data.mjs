#!/usr/bin/env node

/**
 * Generate large amounts of mock data for database seeding
 */

// Configuration
const CONFIG = {
  USER_COUNT: 200,           // 200 users
  ITEM_COUNT: 100,          // 100 items
  INTERACTION_COUNT: 600,   // 600 interactions
  RECOMMENDATION_COUNT: 400, // 400 recommendations
};

// Categories and tags for items
const CATEGORIES = ['Electronics', 'Books', 'Sports', 'Fashion', 'Home', 'Gaming', 'Music', 'Movies'];
const TAGS_BY_CATEGORY = {
  Electronics: ['Audio', 'Wireless', 'Technology', 'Smart', 'Portable'],
  Books: ['Fiction', 'Non-Fiction', 'Literature', 'Bestseller', 'Educational'],
  Sports: ['Fitness', 'Outdoor', 'Exercise', 'Athletic', 'Training'],
  Fashion: ['Luxury', 'Accessories', 'Clothing', 'Designer', 'Trendy'],
  Home: ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Organization'],
  Gaming: ['Console', 'PC', 'Accessories', 'Peripherals', 'VR'],
  Music: ['Instruments', 'Audio', 'Accessories', 'Recording', 'Live'],
  Movies: ['Blu-ray', 'Digital', 'Collectibles', 'Merchandise', 'Streaming'],
};

const PREFERENCES = ['Technology', 'Books', 'Electronics', 'Sports', 'Outdoor', 'Fitness', 'Fashion', 'Beauty', 'Home', 'Gaming', 'Entertainment', 'Music', 'Movies'];
const GENDERS = ['Male', 'Female', 'Other'];
const ALGORITHMS = ['Collaborative Filtering', 'Content-Based', 'Hybrid', 'Matrix Factorization', 'Deep Learning'];

// Generate random data
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function randomDate(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime).toISOString();
}

// Generate users
function generateUsers(count) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    const gender = randomChoice(GENDERS);
    const name = `User${i} ${randomChoice(['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'])}`;
    users.push({
      id: `u${i}`,
      name,
      email: `user${i}@example.com`,
      age: randomInt(18, 65),
      gender,
      preferences: randomChoices(PREFERENCES, randomInt(2, 5)),
      registrationDate: randomDate('2024-01-01', '2024-03-20'),
      totalInteractions: randomInt(0, 200),
    });
  }
  return users;
}

// Generate items
function generateItems(count) {
  const items = [];
  const itemTitles = {
    Electronics: ['Wireless Headphones', 'Smart Watch', 'Tablet', 'Laptop', 'Smartphone', 'Camera', 'Speaker', 'Monitor'],
    Books: ['Novel', 'Biography', 'Cookbook', 'Textbook', 'Comic', 'Poetry', 'History', 'Science'],
    Sports: ['Yoga Mat', 'Running Shoes', 'Dumbbells', 'Bicycle', 'Tennis Racket', 'Basketball', 'Soccer Ball', 'Gym Bag'],
    Fashion: ['Handbag', 'Watch', 'Sunglasses', 'Jewelry', 'Shoes', 'Jacket', 'Dress', 'Accessories'],
    Home: ['Lamp', 'Chair', 'Table', 'Vase', 'Rug', 'Curtains', 'Pillow', 'Mirror'],
    Gaming: ['Gaming Mouse', 'Keyboard', 'Controller', 'Headset', 'Monitor', 'Chair', 'Desk', 'Console'],
    Music: ['Guitar', 'Piano', 'Drums', 'Microphone', 'Amplifier', 'Headphones', 'Speaker', 'Mixer'],
    Movies: ['Blu-ray Collection', 'Poster', 'Action Figure', 'Soundtrack', 'Book', 'Merchandise', 'Collectible', 'Box Set'],
  };

  for (let i = 1; i <= count; i++) {
    const category = randomChoice(CATEGORIES);
    const titleBase = randomChoice(itemTitles[category] || ['Item']);
    const title = `${titleBase} ${randomChoice(['Pro', 'Premium', 'Deluxe', 'Standard', 'Elite', 'Classic'])}`;
    const tags = randomChoices(TAGS_BY_CATEGORY[category] || ['General'], randomInt(2, 4));
    
    items.push({
      id: `i${i}`,
      title,
      category,
      tags,
      price: randomFloat(10, 500),
      rating: randomFloat(3.5, 5.0),
      ratingCount: randomInt(0, 500),
      description: `High-quality ${title.toLowerCase()} with excellent features and great value`,
      createdAt: randomDate('2024-01-01', '2024-03-20'),
    });
  }
  return items;
}

// Generate interactions
function generateInteractions(count, users, items) {
  const interactions = [];
  const types = ['view', 'click', 'purchase', 'rating'];
  
  for (let i = 1; i <= count; i++) {
    const user = randomChoice(users);
    const item = randomChoice(items);
    const type = randomChoice(types);
    const timestamp = randomDate('2024-03-01', '2024-03-22');
    
    const interaction = {
      id: `int${i}`,
      userId: user.id,
      itemId: item.id,
      type,
      timestamp,
    };

    if (type === 'view' || type === 'click') {
      interaction.duration = randomInt(10, 300);
    }
    
    if (type === 'rating') {
      interaction.rating = randomInt(1, 5);
    }

    interactions.push(interaction);
  }
  return interactions;
}

// Generate recommendations
function generateRecommendations(count, users, items) {
  const recommendations = [];
  
  for (let i = 1; i <= count; i++) {
    const user = randomChoice(users);
    const item = randomChoice(items);
    const algorithm = randomChoice(ALGORITHMS);
    
    const reasons = [
      'Users with similar preferences also liked this item',
      'Matches your interest in this category',
      'Based on your recent interactions',
      'Popular among users like you',
      'Frequently purchased together',
      'Highly rated by similar users',
      'Trending in your preferred categories',
    ];

    recommendations.push({
      id: `rec${i}`,
      userId: user.id,
      itemId: item.id,
      score: randomFloat(0.7, 0.99),
      algorithm,
      timestamp: randomDate('2024-03-20', '2024-03-22'),
      reason: randomChoice(reasons),
      shown: Math.random() > 0.3, // 70% shown
      clicked: Math.random() > 0.5, // 50% clicked (of shown)
      converted: Math.random() > 0.7, // 30% converted (of clicked)
    });
  }
  return recommendations;
}

// Generate system metrics
function generateSystemMetrics(users, items, interactions, recommendations) {
  const totalRatings = interactions.filter(i => i.rating).length;
  const avgRating = totalRatings > 0
    ? interactions.filter(i => i.rating).reduce((sum, i) => sum + i.rating, 0) / totalRatings
    : 4.5;

  const shownRecs = recommendations.filter(r => r.shown).length;
  const clickedRecs = recommendations.filter(r => r.clicked).length;
  const convertedRecs = recommendations.filter(r => r.converted).length;

  return {
    totalUsers: users.length,
    totalItems: items.length,
    totalInteractions: interactions.length,
    totalRecommendations: recommendations.length,
    averageRating: Math.round(avgRating * 10) / 10,
    clickThroughRate: shownRecs > 0 ? Math.round((clickedRecs / shownRecs) * 100) / 100 : 0,
    conversionRate: clickedRecs > 0 ? Math.round((convertedRecs / clickedRecs) * 100) / 100 : 0,
    precision: randomFloat(0.7, 0.85),
    recall: randomFloat(0.65, 0.8),
    f1Score: randomFloat(0.68, 0.82),
  };
}

// Generate pipeline stages
function generatePipelineStages() {
  const stages = [
    {
      stage: 'Data Collection',
      description: 'Collecting user interactions and item data',
      status: 'completed',
      dataCount: 600,
      duration: 2500,
    },
    {
      stage: 'Data Preprocessing',
      description: 'Cleaning and normalizing collected data',
      status: 'completed',
      dataCount: 600,
      duration: 1500,
    },
    {
      stage: 'Feature Engineering',
      description: 'Extracting features from user and item data',
      status: 'completed',
      dataCount: 800,
      duration: 3000,
    },
    {
      stage: 'Model Training',
      description: 'Training recommendation algorithms',
      status: 'completed',
      dataCount: 5,
      duration: 5000,
    },
    {
      stage: 'Recommendation Generation',
      description: 'Generating personalized recommendations',
      status: 'completed',
      dataCount: 400,
      duration: 1200,
    },
    {
      stage: 'Evaluation',
      description: 'Evaluating recommendation quality',
      status: 'completed',
      dataCount: 400,
      duration: 800,
    },
  ];
  return stages;
}

// Main export
export function generateMockData(config = CONFIG) {
  console.log('🎲 Generating mock data...');
  console.log(`   Users: ${config.USER_COUNT}`);
  console.log(`   Items: ${config.ITEM_COUNT}`);
  console.log(`   Interactions: ${config.INTERACTION_COUNT}`);
  console.log(`   Recommendations: ${config.RECOMMENDATION_COUNT}`);

  const users = generateUsers(config.USER_COUNT);
  const items = generateItems(config.ITEM_COUNT);
  const interactions = generateInteractions(config.INTERACTION_COUNT, users, items);
  const recommendations = generateRecommendations(config.RECOMMENDATION_COUNT, users, items);
  const systemMetrics = generateSystemMetrics(users, items, interactions, recommendations);
  const pipelineStages = generatePipelineStages();

  return {
    users,
    items,
    interactions,
    recommendations,
    systemMetrics,
    pipelineStages,
  };
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const data = generateMockData();
  console.log('\n✅ Data generation complete!');
  console.log(`   Generated ${data.users.length} users`);
  console.log(`   Generated ${data.items.length} items`);
  console.log(`   Generated ${data.interactions.length} interactions`);
  console.log(`   Generated ${data.recommendations.length} recommendations`);
}

