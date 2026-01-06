# Firebase Setup Guide

This guide will help you set up Firebase for the recommendation system.

## Prerequisites

1. A Firebase account (sign up at [firebase.google.com](https://firebase.google.com))
2. Node.js and npm installed
3. Firebase CLI (optional, for deployment)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "resystem")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development) or **Start in production mode** (for production)
4. Select a location for your database (choose the closest to your users)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Resystem Web")
5. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Run the setup script to create `.env.local`:
   ```bash
   npm run setup:env
   ```

   Or manually create `.env.local` and fill in your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with the rules from `schema.md` (Security Rules section)
3. Click "Publish"

**Important**: For production, customize the security rules based on your authentication requirements.

## Step 6: Create Firestore Indexes

Firestore requires composite indexes for certain queries. Create them in Firebase Console:

1. Go to **Firestore Database** > **Indexes**
2. Click "Create Index"
3. Create the following indexes:

### Index 1: Interactions by User and Time
- Collection: `interactions`
- Fields:
  - `userId` (Ascending)
  - `timestamp` (Descending)

### Index 2: Interactions by Item and Time
- Collection: `interactions`
- Fields:
  - `itemId` (Ascending)
  - `timestamp` (Descending)

### Index 3: Recommendations by User and Score
- Collection: `recommendations`
- Fields:
  - `userId` (Ascending)
  - `score` (Descending)
  - `timestamp` (Descending)

### Index 4: Recommendations by Algorithm
- Collection: `recommendations`
- Fields:
  - `algorithm` (Ascending)
  - `timestamp` (Descending)

### Index 5: Items by Rating
- Collection: `items`
- Fields:
  - `rating` (Descending)
  - `ratingCount` (Descending)

**Note**: Firebase will automatically prompt you to create indexes when you run queries that require them. You can also create them manually in the console.

## Step 7: Initialize Data (Optional)

You can use the mock data to seed your Firestore database. Create a script or use Firebase Console to add initial data:

1. Go to **Firestore Database** > **Data**
2. Click "Start collection"
3. Create collections: `users`, `items`, `interactions`, `recommendations`, `system_metrics`, `pipeline_stages`
4. Add documents manually or use a migration script

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any Firebase errors
3. Try accessing the dashboard - it should connect to Firestore

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Check that your `.env.local` file has the correct API key
- Make sure environment variables start with `NEXT_PUBLIC_`
- Restart your development server after changing `.env.local`

### Error: "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're authenticated (if using auth)
- Verify the rules allow the operations you're trying to perform

### Error: "The query requires an index"
- Go to Firebase Console > Firestore > Indexes
- Click the link in the error message to create the required index
- Wait for the index to build (can take a few minutes)

### Environment variables not loading
- Make sure `.env.local` is in the project root
- Restart the development server
- Check that variable names start with `NEXT_PUBLIC_` for client-side access

## Next Steps

1. **Set up Authentication** (if needed):
   - Go to Firebase Console > Authentication
   - Enable authentication providers (Email/Password, Google, etc.)

2. **Set up Cloud Functions** (for backend algorithms):
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Initialize Functions: `firebase init functions`
   - Deploy functions: `firebase deploy --only functions`

3. **Set up Real-time Listeners**:
   - Use `onSnapshot` for real-time updates
   - See Firebase documentation for examples

4. **Production Deployment**:
   - Update security rules for production
   - Set up proper authentication
   - Configure CORS if needed
   - Set up monitoring and alerts

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

