# Resystem - Recommendation System Dashboard

A comprehensive dashboard for visualizing and managing recommendation system data, algorithms, and metrics. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **System Overview**: Real-time metrics and KPIs for the recommendation system
- **User Management**: View and manage user data, preferences, and interactions
- **Item Catalog**: Browse and manage items in the recommendation catalog
- **Interaction Tracking**: Monitor user-item interactions (views, clicks, purchases, ratings)
- **Recommendation Engine**: View generated recommendations with algorithm details and scores
- **Pipeline Visualization**: Track the recommendation pipeline stages from data collection to evaluation
- **Performance Metrics**: Monitor model performance (precision, recall, F1-score) and business metrics (CTR, conversion rate)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 16.1.1
- **React**: 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Font**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up Firebase environment variables:

   **Option A: Use the setup script (recommended)**
   ```bash
   npm run setup:env
   ```
   This will create `.env.local` with your Firebase credentials.

   **Option B: Manual setup**
   - Create a `.env.local` file in the project root
   - Add your Firebase configuration (see `lib/firebase/README.md`)

   ⚠️ **Important**: Never commit `.env.local` to version control! It's already in `.gitignore`.

   See `lib/firebase/README.md` for detailed instructions.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the file.

### Build

Build the production version:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
resystem/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles & Tailwind
├── components/                   # React UI components
│   ├── DataTable.tsx             # Generic data table component
│   ├── MetricsCard.tsx           # Metrics display card
│   ├── PipelineStage.tsx         # Pipeline visualization
│   ├── RecommendationCard.tsx    # Recommendation card
│   └── StatsBar.tsx              # Progress/statistics bar
├── lib/                          # Core libraries & utilities
│   ├── types.ts                  # TypeScript type definitions
│   └── firebase/                 # Firebase integration
│       ├── config.ts             # Firebase initialization
│       ├── collections.ts        # Collection name constants
│       ├── utils.ts              # Firebase utilities
│       ├── schema-types.ts       # Schema TypeScript types
│       ├── services/             # Data access layer (CRUD)
│       │   ├── users.ts
│       │   ├── items.ts
│       │   ├── interactions.ts
│       │   ├── recommendations.ts
│       │   └── metrics.ts
│       ├── README.md             # Firebase setup guide
│       ├── schema.md             # Complete schema documentation
│       ├── schema-visual.md      # Visual schema diagrams
│       └── QUICK_REFERENCE.md    # Quick reference guide
├── scripts/                      # Utility scripts
│   ├── check-env.mjs             # Environment variable checker
│   ├── generate-mock-data.mjs    # Mock data generator
│   └── seed-database.mjs         # Database seeding script
└── public/                       # Static assets
```

For a detailed project structure breakdown, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Data Structure

The system currently uses mock data to demonstrate the recommendation system workflow:

- **Users**: User profiles with preferences and interaction history
- **Items**: Product/item catalog with categories, tags, and ratings
- **Interactions**: User-item interactions (views, clicks, purchases, ratings)
- **Recommendations**: Generated recommendations with algorithm details and scores
- **System Metrics**: Performance and business metrics
- **Pipeline Stages**: Recommendation generation pipeline stages

## Firebase Database

The project uses Firebase Firestore for data storage. The database structure includes:

- **users**: User profiles and preferences
- **items**: Product/item catalog
- **interactions**: User-item interactions (views, clicks, purchases, ratings)
- **recommendations**: Generated recommendations with scores and algorithms
- **system_metrics**: System performance metrics
- **pipeline_stages**: Recommendation pipeline stage tracking
- **algorithms**: Algorithm configurations and performance metrics

### Database Schema Documentation

Comprehensive database schema documentation is available:

- **`lib/firebase/schema.md`** - Complete schema documentation with all fields, types, and examples
- **`lib/firebase/schema-visual.md`** - Visual diagrams and ERD
- **`lib/firebase/schema-types.ts`** - TypeScript type definitions matching the schema
- **`lib/firebase/QUICK_REFERENCE.md`** - Quick reference guide for common operations
- **`lib/firebase/schema.md`** - Complete database schema documentation

### Key Schema Features

- **7 Collections**: Users, Items, Interactions, Recommendations, System Metrics, Pipeline Stages, Algorithms
- **Type-Safe**: Full TypeScript support with schema types
- **Indexed**: Optimized indexes for common query patterns
- **Scalable**: Designed to handle small to large scale deployments
- **Real-time**: Supports real-time updates via Firestore listeners

## Data Access

The project includes a complete data access layer in `lib/firebase/services/`:

- `users.ts`: User CRUD operations
- `items.ts`: Item management and queries
- `interactions.ts`: Interaction tracking
- `recommendations.ts`: Recommendation management
- `metrics.ts`: System metrics updates

Example usage:

```typescript
import { getUser, getUsers, createUser } from '@/lib/firebase/services/users';
import { getUserRecommendations } from '@/lib/firebase/services/recommendations';

// Get a user
const user = await getUser('u1');

// Get all users
const users = await getUsers();

// Get recommendations for a user
const recommendations = await getUserRecommendations('u1', 20);
```

## Next Steps

1. **Set up Firebase**: Follow the instructions in `lib/firebase/README.md`
2. **Configure Security Rules**: Set up Firestore security rules (see `lib/firebase/schema.md`)
3. **Create Indexes**: Set up required Firestore indexes for optimal query performance
4. **Implement Backend Algorithms**: Connect recommendation algorithms via Cloud Functions
5. **Add Real-time Updates**: Use Firestore listeners for real-time data synchronization
6. **Add Data Visualization**: Integrate charts for better data insights
7. **Implement Authentication**: Add user authentication if needed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
