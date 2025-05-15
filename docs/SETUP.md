# Setting Up and Running Integrity News with Backend Integration

This guide explains how to set up and run both the Integrity News frontend and the Integrity Project backend together.

## Prerequisites

- Node.js 18+ or Bun installed
- Git

## Step 1: Clone Both Repositories

```bash
# Clone the frontend
git clone https://github.com/your-username/integrity.git

# Clone the backend
git clone https://github.com/nyujuzer/integrityproject.git
```

## Step 2: Set Up the Backend (integrityproject)

```bash
cd integrityproject

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env
```

Edit the `.env` file to include:

```
NEWS_KEY=pub_83393351512f8f49e67a9d6b177b5289b6fed
GOOGLE_KEY=AIzaSyBa3v8T1fFAq0BOOVsQmEEU9MZO-UEFRwQ
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaHBueGpmcG5ybXVyanJiY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NTM5NzYsImV4cCI6MjA2MTUyOTk3Nn0.9AaAHIKNcX3PHkKQKfoIEnqiehS-utxoPWSRfBl91R0
SUPABASE_URL=https://hphpnxjfpnrmurjrbcef.supabase.co/
RESEND_KEY=re_XcNacJpA_KPuyQqkU187Q72zZ5UdfBsPG
```

### Start the Backend Server

```bash
# Start in development mode
npm run dev
# or
bun dev
```

The backend server should now be running on `http://localhost:4000`.

This will start the backend server on http://localhost:3000.

## Step 3: Set Up the Frontend (integrity)

```bash
cd ../integrity

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env.local
```

Edit the `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_KEY=a07756a8-c5f2-40e5-8fdb-0866c53a6cf5
```

Note: The API key must be a valid UUID format that exists in the backend's api_keys table.

### Start the Frontend Server

```bash
# Start in development mode
npm run dev
# or
bun dev
```

This will start the frontend on http://localhost:3001 (or another port if 3000 is already in use).

## Using the Article Generation Feature

1. Start both the backend and frontend servers
2. Navigate to the homepage of Integrity News
3. Click the "Generate New Article with AI" button
4. The system will use the backend to:
   - Fetch real news articles from external sources
   - Process them with AI to create satirical versions
   - Store them in the database
   - Make them available via the API
5. After generation completes, the article list will refresh automatically

## Common Issues

- **API Key Error**: If you get an "Unauthorized" error when generating articles, make sure your API key in `.env.local` matches a valid key in the backend's database.
- **404 Not Found Error**: If you get a 404 error when generating articles:
  1. Ensure the backend server is actually running (`npm run dev` in the integrityproject directory)
  2. Check that it's running on port 3000 (you should see "Server is listening on port 3000..." in the terminal)
  3. Verify that the NEXT_PUBLIC_API_URL in your .env.local is set to "http://localhost:3000" (no trailing slash)
  4. Make sure the API key is in a valid UUID format (e.g., a07756a8-c5f2-40e5-8fdb-0866c53a6cf5)
  5. Check the backend Supabase database has an entry for your API key in the api_keys table
- **CORS Issues**: If you experience CORS problems, make sure the backend has proper CORS configuration enabled.
- **Connection Errors**: Ensure both servers are running and the `NEXT_PUBLIC_API_URL` is correctly set to match the backend URL.
