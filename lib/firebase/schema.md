# Firebase Firestore Database Schema

Complete database schema design for the Recommendation System.

## Schema Overview

```
┌─────────────────┐
│     users       │
│  (Collection)   │
└────────┬────────┘
         │
         ├── interactions (subcollection)
         └── recommendations (subcollection)

┌─────────────────┐
│     items       │
│  (Collection)   │
└────────┬────────┘
         │
         └── interactions (subcollection)

┌─────────────────┐      ┌─────────────────┐
│  interactions   │──────│  recommendations │
│  (Collection)   │      │  (Collection)   │
└─────────────────┘      └─────────────────┘
         │                        │
         └────────────────────────┘
              (linked by userId/itemId)

┌─────────────────┐      ┌─────────────────┐
│ system_metrics  │      │ pipeline_stages │
│  (Document)     │      │  (Collection)   │
└─────────────────┘      └─────────────────┘

┌─────────────────┐
│   algorithms    │
│  (Collection)   │
└─────────────────┘
```

## Collection Schemas

### 1. `users` Collection

**Purpose**: Store user profiles and preferences

**Document Structure**:
```typescript
{
  // Identity
  id: string;                    // Document ID (auto-generated or custom)
  email: string;                 // Unique email address
  name: string;                  // User's display name
  
  // Demographics
  age?: number;                  // Optional age
  gender?: string;               // Optional: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  location?: {                   // Optional location data
    country?: string;
    city?: string;
    timezone?: string;
  };
  
  // Preferences & Behavior
  preferences: string[];         // Array of preference categories
  interests: string[];          // Array of interest tags
  behaviorProfile?: {           // Optional behavioral data
    avgSessionDuration?: number;
    preferredCategories?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
  
  // Statistics
  totalInteractions: number;    // Total count of interactions
  totalPurchases: number;       // Total purchases count
  totalSpent: number;           // Total amount spent
  averageRating: number;         // Average rating given by user
  
  // Metadata
  registrationDate: Timestamp;  // Account creation date
  lastActiveDate: Timestamp;     // Last activity timestamp
  isActive: boolean;             // Account status
  subscriptionTier?: string;     // Optional: 'free' | 'premium' | 'enterprise'
  
  // System fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;               // Schema version for migrations
}
```

**Indexes Required**:
- `registrationDate` (ascending)
- `totalInteractions` (descending)
- `isActive` + `lastActiveDate` (descending)
- `preferences` (array-contains)
- `interests` (array-contains)

**Subcollections**:
- `interactions` - User's interaction history
- `recommendations` - User's recommendation history
- `preferences_history` - Historical preference changes

**Example Document**:
```json
{
  "id": "u1",
  "email": "alice@example.com",
  "name": "Alice Johnson",
  "age": 28,
  "gender": "female",
  "location": {
    "country": "US",
    "city": "San Francisco",
    "timezone": "America/Los_Angeles"
  },
  "preferences": ["Technology", "Books", "Electronics"],
  "interests": ["AI", "Programming", "Science Fiction"],
  "behaviorProfile": {
    "avgSessionDuration": 1200,
    "preferredCategories": ["Electronics", "Books"],
    "priceRange": {
      "min": 10,
      "max": 500
    }
  },
  "totalInteractions": 45,
  "totalPurchases": 12,
  "totalSpent": 1250.50,
  "averageRating": 4.5,
  "registrationDate": "2024-01-15T00:00:00Z",
  "lastActiveDate": "2024-03-22T10:30:00Z",
  "isActive": true,
  "subscriptionTier": "premium",
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2024-03-22T10:30:00Z",
  "version": 1
}
```

---

### 2. `items` Collection

**Purpose**: Store product/item catalog information

**Document Structure**:
```typescript
{
  // Identity
  id: string;                    // Document ID
  title: string;                 // Item title/name
  description: string;           // Detailed description
  
  // Classification
  category: string;              // Primary category
  subcategory?: string;          // Optional subcategory
  tags: string[];                // Array of tags for filtering
  brand?: string;                // Optional brand name
  
  // Pricing
  price: number;                  // Current price
  originalPrice?: number;        // Original price (for discounts)
  currency: string;               // Currency code (e.g., 'USD', 'EUR')
  discount?: {                   // Optional discount info
    percentage: number;
    validUntil: Timestamp;
  };
  
  // Ratings & Reviews
  rating: number;                 // Average rating (0-5)
  ratingCount: number;           // Number of ratings
  reviewCount: number;            // Number of reviews
  
  // Inventory
  stock: number;                  // Available stock
  isAvailable: boolean;          // Availability status
  sku?: string;                  // Stock keeping unit
  
  // Media
  images: string[];              // Array of image URLs
  thumbnailUrl?: string;         // Thumbnail image URL
  videoUrl?: string;             // Optional video URL
  
  // Attributes
  attributes?: {                 // Flexible attributes object
    [key: string]: string | number | boolean | string[];
  };
  
  // SEO & Discovery
  keywords: string[];            // SEO keywords
  searchableText: string;        // Full-text search content
  
  // Statistics
  viewCount: number;            // Total views
  clickCount: number;            // Total clicks
  purchaseCount: number;        // Total purchases
  conversionRate: number;       // Purchase/View ratio
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;       // Publication date
  isPublished: boolean;         // Publication status
  version: number;
}
```

**Indexes Required**:
- `category` + `rating` (descending)
- `price` (ascending)
- `rating` + `ratingCount` (descending)
- `createdAt` (descending)
- `isPublished` + `isAvailable` + `rating` (descending)
- `tags` (array-contains)
- `viewCount` (descending)
- `purchaseCount` (descending)

**Subcollections**:
- `interactions` - Item interaction history
- `reviews` - User reviews for the item

**Example Document**:
```json
{
  "id": "i1",
  "title": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "category": "Electronics",
  "subcategory": "Audio",
  "tags": ["Audio", "Wireless", "Technology", "Bluetooth"],
  "brand": "TechBrand",
  "price": 99.99,
  "originalPrice": 129.99,
  "currency": "USD",
  "discount": {
    "percentage": 23,
    "validUntil": "2024-04-30T23:59:59Z"
  },
  "rating": 4.5,
  "ratingCount": 234,
  "reviewCount": 189,
  "stock": 150,
  "isAvailable": true,
  "sku": "TB-WBH-001",
  "images": [
    "https://example.com/images/headphones-1.jpg",
    "https://example.com/images/headphones-2.jpg"
  ],
  "thumbnailUrl": "https://example.com/images/headphones-thumb.jpg",
  "attributes": {
    "color": "Black",
    "batteryLife": "30 hours",
    "noiseCancellation": true,
    "connectivity": ["Bluetooth 5.0", "3.5mm Jack"]
  },
  "keywords": ["headphones", "wireless", "bluetooth", "audio"],
  "searchableText": "Wireless Bluetooth Headphones High-quality noise cancellation audio",
  "viewCount": 1250,
  "clickCount": 456,
  "purchaseCount": 89,
  "conversionRate": 0.0712,
  "createdAt": "2024-01-10T00:00:00Z",
  "updatedAt": "2024-03-15T12:00:00Z",
  "publishedAt": "2024-01-10T00:00:00Z",
  "isPublished": true,
  "version": 1
}
```

---

### 3. `interactions` Collection

**Purpose**: Track all user-item interactions

**Document Structure**:
```typescript
{
  // Identity
  id: string;                    // Document ID (auto-generated)
  userId: string;                // Reference to users collection
  itemId: string;                // Reference to items collection
  
  // Interaction Details
  type: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'rating' | 'review' | 'share' | 'wishlist';
  timestamp: Timestamp;          // When interaction occurred
  
  // Context
  sessionId?: string;            // Session identifier
  deviceType?: string;           // 'desktop' | 'mobile' | 'tablet'
  platform?: string;             // 'web' | 'ios' | 'android'
  referrer?: string;             // Where user came from
  
  // Interaction-specific Data
  duration?: number;             // Duration in seconds (for views/clicks)
  rating?: number;               // Rating value (1-5, only for rating type)
  reviewText?: string;           // Review text (only for review type)
  
  // Purchase-specific Data
  purchaseData?: {
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discountApplied: number;
    paymentMethod: string;
    transactionId: string;
  };
  
  // Recommendation Context
  recommendationId?: string;     // If interaction came from a recommendation
  algorithm?: string;            // Algorithm that generated the recommendation
  
  // Metadata
  metadata?: {                   // Flexible metadata object
    [key: string]: unknown;
  };
  
  // System fields
  createdAt: Timestamp;
}
```

**Indexes Required** (Composite):
- `userId` + `timestamp` (descending)
- `itemId` + `timestamp` (descending)
- `type` + `timestamp` (descending)
- `userId` + `itemId` + `timestamp` (descending)
- `userId` + `type` + `timestamp` (descending)
- `recommendationId` + `timestamp` (descending)
- `sessionId` + `timestamp` (descending)

**Query Patterns**:
```typescript
// Get user's recent interactions
query(collection(db, 'interactions'), 
  where('userId', '==', userId),
  orderBy('timestamp', 'desc'),
  limit(50)
)

// Get item interactions
query(collection(db, 'interactions'),
  where('itemId', '==', itemId),
  orderBy('timestamp', 'desc')
)

// Get purchase interactions
query(collection(db, 'interactions'),
  where('type', '==', 'purchase'),
  orderBy('timestamp', 'desc')
)
```

**Example Document**:
```json
{
  "id": "int1",
  "userId": "u1",
  "itemId": "i1",
  "type": "purchase",
  "timestamp": "2024-03-15T10:35:00Z",
  "sessionId": "sess_abc123",
  "deviceType": "desktop",
  "platform": "web",
  "referrer": "https://example.com/recommendations",
  "duration": 180,
  "recommendationId": "rec1",
  "algorithm": "Collaborative Filtering",
  "purchaseData": {
    "quantity": 1,
    "unitPrice": 99.99,
    "totalPrice": 99.99,
    "discountApplied": 0,
    "paymentMethod": "credit_card",
    "transactionId": "txn_xyz789"
  },
  "metadata": {
    "page": "/product/i1",
    "userAgent": "Mozilla/5.0..."
  },
  "createdAt": "2024-03-15T10:35:00Z"
}
```

---

### 4. `recommendations` Collection

**Purpose**: Store generated recommendations

**Document Structure**:
```typescript
{
  // Identity
  id: string;                    // Document ID (auto-generated)
  userId: string;               // Reference to users collection
  itemId: string;               // Reference to items collection
  
  // Recommendation Details
  score: number;                // Recommendation score (0-1)
  algorithm: string;            // Algorithm name
  algorithmVersion?: string;    // Algorithm version
  reason: string;              // Human-readable explanation
  
  // Ranking
  rank: number;                 // Position in recommendation list
  batchId?: string;             // Batch identifier for group processing
  
  // Performance Tracking
  shown: boolean;               // Whether recommendation was shown to user
  shownAt?: Timestamp;         // When recommendation was shown
  clicked: boolean;             // Whether user clicked on recommendation
  clickedAt?: Timestamp;       // When user clicked
  converted: boolean;           // Whether user converted (purchased)
  convertedAt?: Timestamp;     // When conversion occurred
  
  // Context
  context?: {                   // Context when recommendation was generated
    userPreferences?: string[];
    recentInteractions?: string[];
    sessionData?: Record<string, unknown>;
  };
  
  // A/B Testing
  experimentId?: string;        // A/B test identifier
  variant?: string;             // Test variant
  
  // Metadata
  timestamp: Timestamp;         // When recommendation was generated
  expiresAt?: Timestamp;       // Optional expiration
  createdAt: Timestamp;
}
```

**Indexes Required** (Composite):
- `userId` + `score` (descending)
- `userId` + `timestamp` (descending)
- `userId` + `shown` + `score` (descending)
- `algorithm` + `timestamp` (descending)
- `userId` + `algorithm` + `score` (descending)
- `batchId` + `timestamp` (descending)
- `experimentId` + `score` (descending)

**Query Patterns**:
```typescript
// Get top recommendations for user
query(collection(db, 'recommendations'),
  where('userId', '==', userId),
  where('shown', '==', false),
  orderBy('score', 'desc'),
  limit(20)
)

// Get recommendations by algorithm
query(collection(db, 'recommendations'),
  where('algorithm', '==', 'Collaborative Filtering'),
  orderBy('timestamp', 'desc')
)
```

**Example Document**:
```json
{
  "id": "rec1",
  "userId": "u1",
  "itemId": "i6",
  "score": 0.92,
  "algorithm": "Collaborative Filtering",
  "algorithmVersion": "v2.1",
  "reason": "Users with similar preferences also liked this item",
  "rank": 1,
  "batchId": "batch_20240322",
  "shown": true,
  "shownAt": "2024-03-22T08:00:00Z",
  "clicked": true,
  "clickedAt": "2024-03-22T08:05:00Z",
  "converted": false,
  "context": {
    "userPreferences": ["Technology", "Electronics"],
    "recentInteractions": ["i1", "i2"]
  },
  "experimentId": "exp_ab_test_1",
  "variant": "variant_a",
  "timestamp": "2024-03-22T08:00:00Z",
  "expiresAt": "2024-03-29T08:00:00Z",
  "createdAt": "2024-03-22T08:00:00Z"
}
```

---

### 5. `system_metrics` Collection

**Purpose**: Store aggregated system performance metrics

**Document Structure**:
```typescript
{
  // Document ID: 'current' (single document)
  id: 'current';
  
  // User Metrics
  totalUsers: number;
  activeUsers: number;           // Users active in last 30 days
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  
  // Item Metrics
  totalItems: number;
  availableItems: number;
  newItemsToday: number;
  newItemsThisWeek: number;
  
  // Interaction Metrics
  totalInteractions: number;
  interactionsToday: number;
  interactionsThisWeek: number;
  averageInteractionsPerUser: number;
  
  // Recommendation Metrics
  totalRecommendations: number;
  recommendationsGeneratedToday: number;
  averageRecommendationsPerUser: number;
  
  // Performance Metrics
  averageRating: number;
  clickThroughRate: number;     // CTR = clicks / shown
  conversionRate: number;        // Conversion = purchases / clicks
  averageOrderValue: number;
  
  // Model Performance
  precision: number;
  recall: number;
  f1Score: number;
  meanReciprocalRank: number;   // MRR
  normalizedDiscountedCumulativeGain: number; // NDCG
  
  // Business Metrics
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  
  // Timestamps
  lastUpdated: Timestamp;
  calculatedAt: Timestamp;
  periodStart: Timestamp;       // Period start for time-based metrics
  periodEnd: Timestamp;         // Period end for time-based metrics
}
```

**Update Strategy**: 
- Single document updated periodically (via Cloud Function or scheduled job)
- Consider using subcollections for historical data if needed

**Example Document**:
```json
{
  "id": "current",
  "totalUsers": 1250,
  "activeUsers": 856,
  "newUsersToday": 12,
  "newUsersThisWeek": 89,
  "newUsersThisMonth": 342,
  "totalItems": 1250,
  "availableItems": 1180,
  "newItemsToday": 5,
  "newItemsThisWeek": 34,
  "totalInteractions": 45678,
  "interactionsToday": 1234,
  "interactionsThisWeek": 8765,
  "averageInteractionsPerUser": 36.5,
  "totalRecommendations": 125000,
  "recommendationsGeneratedToday": 3456,
  "averageRecommendationsPerUser": 100,
  "averageRating": 4.6,
  "clickThroughRate": 0.42,
  "conversionRate": 0.21,
  "averageOrderValue": 89.50,
  "precision": 0.75,
  "recall": 0.68,
  "f1Score": 0.71,
  "meanReciprocalRank": 0.82,
  "normalizedDiscountedCumulativeGain": 0.78,
  "totalRevenue": 125000.50,
  "revenueToday": 1234.56,
  "revenueThisWeek": 8765.43,
  "revenueThisMonth": 34567.89,
  "lastUpdated": "2024-03-22T12:00:00Z",
  "calculatedAt": "2024-03-22T12:00:00Z",
  "periodStart": "2024-03-01T00:00:00Z",
  "periodEnd": "2024-03-22T23:59:59Z"
}
```

---

### 6. `pipeline_stages` Collection

**Purpose**: Track recommendation pipeline execution stages

**Document Structure**:
```typescript
{
  // Identity
  id: string;                    // Stage identifier (e.g., 'data_collection')
  stage: string;                // Stage name
  description: string;           // Stage description
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  
  // Execution Details
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  duration?: number;             // Duration in milliseconds
  
  // Data Processing
  dataCount: number;            // Number of records processed
  inputCount?: number;           // Input records
  outputCount?: number;          // Output records
  
  // Error Handling
  error?: string;               // Error message if failed
  errorDetails?: {              // Detailed error information
    code?: string;
    message: string;
    stack?: string;
  };
  
  // Dependencies
  dependsOn?: string[];         // Array of stage IDs this depends on
  nextStages?: string[];        // Array of stage IDs that depend on this
  
  // Configuration
  config?: Record<string, unknown>; // Stage-specific configuration
  
  // Metadata
  runId: string;                // Execution run identifier
  version: string;              // Pipeline version
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes Required**:
- `runId` + `status` + `startedAt` (descending)
- `status` + `startedAt` (descending)
- `stage` + `startedAt` (descending)

**Example Document**:
```json
{
  "id": "data_collection_20240322",
  "stage": "Data Collection",
  "description": "Collecting user interactions and item data",
  "status": "completed",
  "startedAt": "2024-03-22T08:00:00Z",
  "completedAt": "2024-03-22T08:00:20Z",
  "duration": 20000,
  "dataCount": 19,
  "inputCount": 0,
  "outputCount": 19,
  "dependsOn": [],
  "nextStages": ["data_preprocessing_20240322"],
  "config": {
    "batchSize": 1000,
    "timeout": 30000
  },
  "runId": "run_20240322_080000",
  "version": "1.0",
  "createdAt": "2024-03-22T08:00:00Z",
  "updatedAt": "2024-03-22T08:00:20Z"
}
```

---

### 7. `algorithms` Collection

**Purpose**: Store algorithm configurations and performance

**Document Structure**:
```typescript
{
  // Identity
  id: string;                    // Algorithm identifier
  name: string;                  // Algorithm display name
  description: string;           // Algorithm description
  
  // Status
  enabled: boolean;              // Whether algorithm is active
  isDefault: boolean;            // Whether this is the default algorithm
  
  // Configuration
  parameters: {                  // Algorithm-specific parameters
    [key: string]: unknown;
  };
  
  // Performance Metrics
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    accuracy?: number;
    meanReciprocalRank?: number;
    normalizedDiscountedCumulativeGain?: number;
  };
  
  // Usage Statistics
  usageCount: number;            // Number of times used
  lastUsedAt?: Timestamp;       // Last usage timestamp
  
  // Training Information
  lastTrained?: Timestamp;       // Last training timestamp
  trainingDuration?: number;     // Training duration in seconds
  trainingDataSize?: number;     // Size of training data
  
  // Versioning
  version: string;               // Algorithm version
  changelog?: string[];         // Version changelog
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Example Document**:
```json
{
  "id": "collaborative_filtering_v2",
  "name": "Collaborative Filtering",
  "description": "User-based collaborative filtering algorithm",
  "enabled": true,
  "isDefault": true,
  "parameters": {
    "similarityMetric": "cosine",
    "neighborhoodSize": 50,
    "minCommonItems": 5,
    "weightDecay": 0.9
  },
  "performance": {
    "precision": 0.75,
    "recall": 0.68,
    "f1Score": 0.71,
    "meanReciprocalRank": 0.82,
    "normalizedDiscountedCumulativeGain": 0.78
  },
  "usageCount": 12500,
  "lastUsedAt": "2024-03-22T12:00:00Z",
  "lastTrained": "2024-03-20T02:00:00Z",
  "trainingDuration": 3500,
  "trainingDataSize": 50000,
  "version": "2.1",
  "changelog": [
    "v2.1: Improved similarity calculation",
    "v2.0: Initial release"
  ],
  "createdAt": "2024-03-15T00:00:00Z",
  "updatedAt": "2024-03-20T02:00:00Z"
}
```

---

## Data Relationships

### Primary Relationships

1. **User ↔ Interactions**: One-to-Many
   - User can have many interactions
   - Query: `interactions` collection filtered by `userId`

2. **Item ↔ Interactions**: One-to-Many
   - Item can have many interactions
   - Query: `interactions` collection filtered by `itemId`

3. **User ↔ Recommendations**: One-to-Many
   - User can have many recommendations
   - Query: `recommendations` collection filtered by `userId`

4. **Item ↔ Recommendations**: One-to-Many
   - Item can appear in many recommendations
   - Query: `recommendations` collection filtered by `itemId`

5. **Interaction ↔ Recommendation**: Many-to-One (optional)
   - Interaction can reference a recommendation
   - Used for tracking recommendation effectiveness

### Denormalization Strategy

For better query performance, consider denormalizing:

1. **User Statistics in User Document**:
   - `totalInteractions`, `totalPurchases`, `averageRating`
   - Updated via Cloud Functions on interaction creation

2. **Item Statistics in Item Document**:
   - `viewCount`, `clickCount`, `purchaseCount`, `rating`, `ratingCount`
   - Updated via Cloud Functions on interaction creation

3. **Recommendation Performance in Recommendation Document**:
   - `shown`, `clicked`, `converted` flags
   - Updated in real-time when user interacts

---

## Indexing Strategy

### Required Composite Indexes

1. **Interactions**:
   - `userId` + `timestamp` (descending)
   - `itemId` + `timestamp` (descending)
   - `type` + `timestamp` (descending)
   - `userId` + `itemId` + `timestamp` (descending)
   - `userId` + `type` + `timestamp` (descending)

2. **Recommendations**:
   - `userId` + `score` (descending)
   - `userId` + `timestamp` (descending)
   - `userId` + `shown` + `score` (descending)
   - `algorithm` + `timestamp` (descending)

3. **Items**:
   - `category` + `rating` (descending)
   - `rating` + `ratingCount` (descending)
   - `isPublished` + `isAvailable` + `rating` (descending)

### Single-Field Indexes

- `users.registrationDate`
- `users.totalInteractions`
- `items.price`
- `items.createdAt`
- `interactions.type`
- `recommendations.algorithm`

---

## Security Rules Example

## Security Rules

Key points for Firestore security rules:

1. **Users**: Users can read/write their own data
2. **Items**: Readable by all authenticated users, writable only by admins
3. **Interactions**: Users can create their own interactions
4. **Recommendations**: Readable by the user, writable by system
5. **Metrics**: Read-only for authenticated users

---

## Best Practices

1. **Document Size**: Keep documents under 1MB
2. **Subcollections**: Use for hierarchical data (user interactions, item reviews)
3. **Batch Operations**: Use batch writes for multiple updates
4. **Real-time Listeners**: Use `onSnapshot` for real-time updates
5. **Pagination**: Always use `limit()` for large queries
6. **Error Handling**: Implement retry logic for failed operations
7. **Data Validation**: Validate data before writing to Firestore
8. **Versioning**: Include version fields for schema migrations

---

## Migration Strategy

When schema changes are needed:

1. Add new fields as optional
2. Update application code to handle both old and new formats
3. Use Cloud Functions to migrate existing documents
4. Update version field in documents
5. Remove old fields after migration is complete

---

## Performance Considerations

1. **Query Limits**: 
   - Use `limit()` to restrict result size
   - Use pagination with `startAfter()` for large datasets

2. **Composite Indexes**:
   - Create indexes before deploying queries that need them
   - Monitor index usage in Firebase Console

3. **Caching**:
   - Cache frequently accessed data (items, user profiles)
   - Use Firestore offline persistence for mobile apps

4. **Denormalization**:
   - Denormalize frequently queried data
   - Update denormalized fields via Cloud Functions

5. **Batch Operations**:
   - Use batch writes for multiple document updates
   - Limit batch size to 500 operations

