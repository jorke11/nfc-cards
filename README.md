# NFC Digital Profile Platform

A modern NFC-enabled digital profile platform that allows users to create shareable digital profiles accessible via NFC cards, QR codes, and direct links.

## Project Structure

```
nfc-cards/
├── frontend/          # Next.js 14+ application
└── backend/           # NestJS application
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js
- **State Management:** React Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

### Backend
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** Passport.js (JWT, OAuth)
- **Storage:** AWS S3
- **Email:** AWS SES
- **Rate Limiting:** @nestjs/throttler

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- AWS account (for S3 and SES)
- OAuth credentials (Google, Facebook, LinkedIn, Apple)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration:
   - Database credentials
   - JWT secret
   - AWS credentials
   - OAuth provider credentials

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Run database migrations:
   ```bash
   npm run migration:run
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend API will be available at `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your configuration:
   - API URL
   - NextAuth secret
   - OAuth provider credentials

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Development Workflow

1. Make sure the PostgreSQL database is running
2. Start the backend server: `cd backend && npm run start:dev`
3. Start the frontend server: `cd frontend && npm run dev`
4. Access the application at `http://localhost:3000`

## Features

### MVP Features
- Multi-provider authentication (email/password, Google, Facebook, LinkedIn, Apple, magic links)
- Create and customize digital profiles
- Unique shareable links and QR codes
- NFC card redirect handling
- Profile analytics tracking
- Enable/disable profile visibility
- Image uploads to AWS S3
- Email verification and notifications

### Coming Soon
- Business card profiles
- Advanced analytics
- Custom domains
- Profile templates
- Team accounts

## Database Schema

The application uses four main tables:
- **users** - User authentication and account data
- **profiles** - Digital profile information
- **profile_views** - Analytics tracking
- **verification_tokens** - Email and magic link tokens

## API Documentation

API documentation is available at `http://localhost:4000/api` when running in development mode.

## Deployment

See the deployment guide in the plan document for production deployment instructions to AWS EC2.

## License

Proprietary

## Support

For issues and questions, please open an issue in the repository.
