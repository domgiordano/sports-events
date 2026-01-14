# Sports Event Management Application

A full-stack sports event management application built with Next.js 15, Supabase, and TypeScript. Users can create, view, edit, and delete sports events with multiple venue support.

## 🚀 Live Demo

[View Live Application](https://your-vercel-url.vercel.app)

## ✨ Features

- **Authentication**: Email/password and Google OAuth via Supabase Auth
- **Event Management**: Full CRUD operations for sports events
- **Multiple Venues**: Each event supports multiple venues with address and capacity
- **Search & Filter**: Real-time search by name and filter by sport type (server-side)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Server Actions**: All database operations happen server-side

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: react-hook-form + zod validation
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── actions/           # Server actions for auth and events
│   ├── auth.ts       # Authentication actions
│   └── events.ts     # Event CRUD actions
├── app/              # Next.js App Router pages
│   ├── auth/         # OAuth callback
│   ├── dashboard/    # Main events dashboard
│   ├── events/       # Event create/edit pages
│   ├── login/        # Login page
│   └── signup/       # Signup page
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   └── ...           # Feature components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and Supabase clients
│   └── supabase/     # Supabase server/client helpers
└── types/            # TypeScript types
```

## 🗄 Database Schema

The application uses two main tables:

### Events Table

- `id` (UUID, PK)
- `name` (VARCHAR)
- `sport_type` (VARCHAR)
- `date_time` (TIMESTAMPTZ)
- `description` (TEXT, nullable)
- `user_id` (UUID, FK to auth.users)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### Venues Table

- `id` (UUID, PK)
- `event_id` (UUID, FK to events)
- `name` (VARCHAR)
- `address` (TEXT, nullable)
- `capacity` (INTEGER, nullable)
- `created_at` (TIMESTAMPTZ)

Row Level Security (RLS) ensures users can only access their own events.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd sports-events
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Google OAuth (optional):
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
4. Deploy!

### Post-deployment

Update your Supabase project:

1. Go to Authentication > URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add `https://your-app.vercel.app/auth/callback` to "Redirect URLs"

## 📝 API Design

All database interactions use Server Actions with a generic `safeAction` helper for consistent error handling:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

This provides:

- Type-safe responses
- Consistent error handling
- No direct client-side database access

## 🧪 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
