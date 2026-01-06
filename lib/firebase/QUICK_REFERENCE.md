# Firebase Schema Quick Reference

## Collection Summary

| Collection | Document Count | Primary Use | Update Frequency |
|------------|---------------|-------------|-------------------|
| `users` | ~1K-1M+ | User profiles | Low (on registration/update) |
| `items` | ~1K-100K+ | Product catalog | Medium (on item add/update) |
| `interactions` | ~100K-100M+ | User behavior tracking | High (real-time) |
| `recommendations` | ~50K-50M+ | Generated recommendations | Medium (batch) |
| `system_metrics` | 1 | System statistics | Low (periodic) |
| `pipeline_stages` | ~10-100 | Pipeline tracking | Low (on stage completion) |
| `algorithms` | ~5-20 | Algorithm configs | Low (on algorithm update) |

## Field Naming Conventions

### Timestamps
- `createdAt` - Document creation time
- `updatedAt` - Last update time
- `timestamp` - Event occurrence time
- `*At` - Specific event time (e.g., `shownAt`, `clickedAt`)

### Counters
- `*Count` - Total count (e.g., `ratingCount`, `viewCount`)
- `total*` - Aggregated totals (e.g., `totalInteractions`, `totalRevenue`)

### Status Fields
- `is*` - Boolean status (e.g., `isActive`, `isPublished`)
- `status` - Enum status (e.g., `status: 'completed'`)

### IDs
- `id` - Document ID
- `*Id` - Foreign key references (e.g., `userId`, `itemId`)

## Common Query Patterns

### Get User's Recent Interactions
```typescript
import { query, collection, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';

const q = query(
  collection(db, COLLECTIONS.INTERACTIONS),
  where('userId', '==', userId),
  orderBy('timestamp', 'desc'),
  limit(50)
);
```

### Get Top Recommendations for User
```typescript
const q = query(
  collection(db, COLLECTIONS.RECOMMENDATIONS),
  where('userId', '==', userId),
  where('shown', '==', false),
  orderBy('score', 'desc'),
  limit(20)
);
```

### Get Popular Items
```typescript
const q = query(
  collection(db, COLLECTIONS.ITEMS),
  where('isPublished', '==', true),
  where('isAvailable', '==', true),
  orderBy('rating', 'desc'),
  orderBy('ratingCount', 'desc'),
  limit(10)
);
```

### Get Items by Category
```typescript
const q = query(
  collection(db, COLLECTIONS.ITEMS),
  where('category', '==', category),
  orderBy('rating', 'desc'),
  limit(20)
);
```

## Index Requirements Checklist

### Single Field Indexes
- [ ] `users.registrationDate`
- [ ] `users.totalInteractions`
- [ ] `users.isActive`
- [ ] `items.category`
- [ ] `items.price`
- [ ] `items.rating`
- [ ] `items.isPublished`
- [ ] `interactions.type`
- [ ] `recommendations.algorithm`

### Composite Indexes
- [ ] `interactions`: `userId` + `timestamp` (descending)
- [ ] `interactions`: `itemId` + `timestamp` (descending)
- [ ] `interactions`: `type` + `timestamp` (descending)
- [ ] `interactions`: `userId` + `itemId` + `timestamp` (descending)
- [ ] `recommendations`: `userId` + `score` (descending)
- [ ] `recommendations`: `userId` + `timestamp` (descending)
- [ ] `recommendations`: `userId` + `shown` + `score` (descending)
- [ ] `items`: `category` + `rating` (descending)
- [ ] `items`: `isPublished` + `isAvailable` + `rating` (descending)

## Data Validation Rules

### User Document
- `email` must be unique and valid format
- `preferences` must be non-empty array
- `totalInteractions` >= 0
- `registrationDate` <= `lastActiveDate`

### Item Document
- `price` > 0
- `rating` between 0 and 5
- `ratingCount` >= 0
- `stock` >= 0
- `tags` must be non-empty array

### Interaction Document
- `userId` must exist in users collection
- `itemId` must exist in items collection
- `type` must be valid InteractionType
- `rating` required if type is 'rating', between 1-5
- `timestamp` <= current time

### Recommendation Document
- `userId` must exist in users collection
- `itemId` must exist in items collection
- `score` between 0 and 1
- `shown` must be true before `clicked` can be true
- `clicked` must be true before `converted` can be true

## Common Operations

### Create User
```typescript
import { createUser } from '@/lib/firebase/services/users';
import { Timestamp } from 'firebase/firestore';

const userId = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  preferences: ['Technology'],
  interests: ['AI'],
  totalInteractions: 0,
  totalPurchases: 0,
  totalSpent: 0,
  averageRating: 0,
  registrationDate: Timestamp.now(),
  lastActiveDate: Timestamp.now(),
  isActive: true,
  version: 1,
});
```

### Track Interaction
```typescript
import { createInteraction } from '@/lib/firebase/services/interactions';

await createInteraction({
  userId: 'u1',
  itemId: 'i1',
  type: 'view',
  timestamp: Timestamp.now(),
  duration: 45,
  createdAt: Timestamp.now(),
});
```

### Generate Recommendation
```typescript
import { createRecommendation } from '@/lib/firebase/services/recommendations';

await createRecommendation({
  userId: 'u1',
  itemId: 'i2',
  score: 0.92,
  algorithm: 'Collaborative Filtering',
  reason: 'Users with similar preferences also liked this',
  rank: 1,
  shown: false,
  clicked: false,
  converted: false,
  timestamp: Timestamp.now(),
  createdAt: Timestamp.now(),
});
```

## Performance Tips

1. **Use Indexes**: Always create required indexes before deploying
2. **Limit Queries**: Always use `limit()` for large collections
3. **Batch Writes**: Use batch writes for multiple updates
4. **Denormalize**: Store frequently accessed data in parent documents
5. **Pagination**: Use `startAfter()` for pagination
6. **Cache**: Cache frequently accessed data (items, user profiles)
7. **Monitor**: Use Firebase Console to monitor query performance

## Security Checklist

- [ ] Users can only read/write their own data
- [ ] Items are readable by all authenticated users
- [ ] Interactions can only be created by the user
- [ ] Recommendations are readable by the user only
- [ ] System metrics are read-only for users
- [ ] Admin operations require authentication
- [ ] Validate all input data before writing

## Migration Checklist

When updating schema:
- [ ] Add new fields as optional
- [ ] Update TypeScript types
- [ ] Update service functions
- [ ] Create migration script if needed
- [ ] Update version field in documents
- [ ] Test with existing data
- [ ] Deploy gradually

