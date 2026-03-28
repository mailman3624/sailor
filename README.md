# Sailor Piece Inventory

Next.js inventory app deployed on Vercel and backed by Supabase PostgreSQL.

## Stack
- Next.js 15
- React 19
- TypeScript
- Supabase Postgres
- Vercel

## Project structure
- `src/app` route pages and Next layout
- `src/features/inventory/components` UI used by inventory pages
- `src/server/inventory` database access and server actions
- `database/schema.sql` SQL schema for Supabase
- `database/seed.sql` seed data for a fresh environment

## Setup
1. Install dependencies with `npm install`
2. Add `DATABASE_URL` to `.env.local`
3. Run `database/schema.sql` in Supabase SQL Editor
4. Run `database/seed.sql` if you want sample data
5. Start with `npm run dev`

## Deploy
1. Push to GitHub
2. Add `DATABASE_URL` in Vercel Environment Variables
3. Deploy
