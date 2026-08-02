# Restore Attendance Cards

Production-ready Next.js 15 app for QR-based attendance cards using the supplied Restore blueprint card design.

## Features
- Participant card claim flow at `/card/{uuid}`
- Read-only participant progress page
- Leader login, phone-friendly QR scanner, search, instant check/uncheck attendance
- Admin password-only dashboard using HTTP-only JWT cookie
- Card generation, leader management, reset/delete controls, analytics and activity logs
- Print-ready PDF export using the exact uploaded card artwork with generated QR codes
- Prisma/PostgreSQL schema with indexes and safe transactions

## Stack
Next.js 15 App Router, React 19, TypeScript, TailwindCSS, Prisma, PostgreSQL, jose HTTP-only sessions, bcryptjs, html5-qrcode, qrcode, pdf-lib, Zod, Server Actions.

## Setup
```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Environment
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/restored?sslmode=require"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
ADMIN_PASSWORD="ngnewgeneration"
SEED_LEADER_PASSWORD="restoreleader123"
```

## Vercel Deployment
1. Create a Neon or Supabase PostgreSQL database.
2. Add all environment variables in Vercel Project Settings.
3. Deploy from GitHub or with `vercel --prod`.
4. Run `npx prisma db push` once against production, then `npm run db:seed` if you want the initial leader and 25 cards.

## Default seed
- Leader username: `leader`
- Leader password: value of `SEED_LEADER_PASSWORD`, default `restoreleader123`

## Design fidelity
`public/card-template.png` is the uploaded official design reference. The app renders it directly as the card background and overlays only the QR code, participant name, and checked-circle fills.
