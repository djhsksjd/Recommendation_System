# Database Schema Visual Guide

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
├─────────────────────────────────────────────────────────────┤
│ id (PK)              │ string                                │
│ email                │ string (unique)                      │
│ name                 │ string                               │
│ age                  │ number?                              │
│ gender               │ string?                               │
│ preferences          │ string[]                             │
│ interests            │ string[]                              │
│ totalInteractions    │ number                               │
│ totalPurchases       │ number                               │
│ registrationDate     │ Timestamp                             │
│ lastActiveDate       │ Timestamp                             │
│ isActive             │ boolean                               │
│ createdAt            │ Timestamp                             │
│ updatedAt            │ Timestamp                             │
└──────────────────────┼───────────────────────────────────────┘
                       │
                       │ 1:N
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│  INTERACTIONS    │         │ RECOMMENDATIONS  │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)           │
│ userId (FK)      │─────────│ userId (FK)      │
│ itemId (FK)      │         │ itemId (FK)      │
│ type             │         │ score             │
│ timestamp        │         │ algorithm         │
│ duration         │         │ reason            │
│ rating           │         │ shown             │
│ purchaseData     │         │ clicked           │
│ recommendationId │─────────│ converted        │
│ createdAt        │         │ timestamp         │
└──────────────────┘         └──────────────────┘
        │                             │
        │ N:1                         │ N:1
        │                             │
        └──────────────┬──────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │      ITEMS        │
              ├──────────────────┤
              │ id (PK)          │
              │ title            │
              │ description      │
              │ category         │
              │ tags             │
              │ price            │
              │ rating           │
              │ ratingCount      │
              │ stock            │
              │ isAvailable      │
              │ viewCount        │
              │ clickCount       │
              │ purchaseCount    │
              │ createdAt        │
              │ updatedAt        │
              └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM_METRICS                            │
│                    (Single Document)                        │
├─────────────────────────────────────────────────────────────┤
│ id: 'current'                                               │
│ totalUsers                                                   │
│ totalItems                                                   │
│ totalInteractions                                            │
│ totalRecommendations                                         │
│ averageRating                                                │
│ clickThroughRate                                             │
│ conversionRate                                               │
│ precision                                                    │
│ recall                                                       │
│ f1Score                                                      │
│ totalRevenue                                                 │
│ lastUpdated                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PIPELINE_STAGES                           │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                      │
│ stage                                                        │
│ description                                                  │
│ status                                                       │
│ startedAt                                                    │
│ completedAt                                                  │
│ duration                                                     │
│ dataCount                                                    │
│ error                                                        │
│ runId                                                        │
│ createdAt                                                    │
│ updatedAt                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     ALGORITHMS                               │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                      │
│ name                                                         │
│ description                                                  │
│ enabled                                                      │
│ isDefault                                                    │
│ parameters                                                   │
│ performance                                                  │
│ usageCount                                                   │
│ lastTrained                                                  │
│ version                                                      │
│ createdAt                                                    │
│ updatedAt                                                    │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   Users     │
│  Register   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│   Users     │─────▶│  Items      │
│  Browse     │      │  Catalog    │
└──────┬──────┘      └─────────────┘
       │
       │ Create
       ▼
┌─────────────┐
│Interactions │
│ (view/click)│
└──────┬──────┘
       │
       │ Trigger
       ▼
┌─────────────┐
│  Algorithm  │
│  Processing │
└──────┬──────┘
       │
       │ Generate
       ▼
┌─────────────┐
│Recommendations│
└──────┬──────┘
       │
       │ Show to User
       ▼
┌─────────────┐
│Interactions │
│ (click/buy) │
└──────┬──────┘
       │
       │ Update
       ▼
┌─────────────┐
│   Metrics   │
│  (System)   │
└─────────────┘
```

## Collection Size Estimates

### Small Scale (< 10K users)
- Users: ~10K documents
- Items: ~1K-5K documents
- Interactions: ~100K-500K documents
- Recommendations: ~50K-200K documents

### Medium Scale (10K-100K users)
- Users: ~100K documents
- Items: ~10K-50K documents
- Interactions: ~1M-10M documents
- Recommendations: ~500K-5M documents

### Large Scale (> 100K users)
- Users: ~1M+ documents
- Items: ~100K+ documents
- Interactions: ~100M+ documents
- Recommendations: ~50M+ documents

**Note**: For large scale, consider:
- Sharding strategies
- Archival of old data
- Separate collections for different time periods
- Cloud Functions for aggregation

## Query Patterns Summary

### Common Queries

1. **Get User Recommendations**
   ```
   recommendations
   WHERE userId == 'u1'
   ORDER BY score DESC
   LIMIT 20
   ```

2. **Get User Interactions**
   ```
   interactions
   WHERE userId == 'u1'
   ORDER BY timestamp DESC
   LIMIT 50
   ```

3. **Get Popular Items**
   ```
   items
   WHERE isPublished == true
   ORDER BY rating DESC, ratingCount DESC
   LIMIT 10
   ```

4. **Get Item Interactions**
   ```
   interactions
   WHERE itemId == 'i1'
   ORDER BY timestamp DESC
   ```

5. **Get Recommendations by Algorithm**
   ```
   recommendations
   WHERE algorithm == 'Collaborative Filtering'
   ORDER BY timestamp DESC
   ```

## Index Requirements Summary

### Single Field Indexes
- `users.registrationDate`
- `users.totalInteractions`
- `users.isActive`
- `items.category`
- `items.price`
- `items.rating`
- `items.isPublished`
- `interactions.type`
- `recommendations.algorithm`

### Composite Indexes
- `interactions`: `userId + timestamp`
- `interactions`: `itemId + timestamp`
- `interactions`: `type + timestamp`
- `recommendations`: `userId + score`
- `recommendations`: `userId + timestamp`
- `items`: `category + rating`
- `items`: `isPublished + isAvailable + rating`

