# XChatLife

AI chatbot companion application built with the T3 Stack. Create and chat with AI characters featuring customizable personalities, appearances, and behaviors.

## Tech Stack

- **Framework**: Next.js 15+ with React 19
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **API**: tRPC for type-safe API calls
- **Styling**: Tailwind CSS 4.0 with custom design system
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI with Catalyst-style design system
- **Testing**: Cypress for E2E tests
- **Storage**: Cloudflare R2 (S3-compatible)
- **Payments**: CoinGate

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Docker/Podman (optional, for local database)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Start development server
pnpm dev
```

## Scripts

### Development

```bash
pnpm dev              # Start development server with Turbo
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Build and start production server
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues automatically
pnpm typecheck        # Run TypeScript type checking
pnpm check            # Run both lint and typecheck
```

### Formatting

```bash
pnpm format:check     # Check code formatting
pnpm format:write     # Fix code formatting
```

### Database

```bash
pnpm db:generate      # Generate Prisma migrations
pnpm db:migrate       # Deploy Prisma migrations
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Prisma Studio
```

### Testing

```bash
pnpm storybook        # Start Storybook on port 6006
pnpm build-storybook  # Build Storybook for production
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── _components/        # Component library (atomic design)
│   │   ├── atoms/          # Base UI components
│   │   ├── molecules/      # Composite components
│   │   ├── organisms/      # Complex components
│   │   └── pages/          # Full page components
│   ├── api/                # API routes
│   └── [routes]/           # Application pages
├── server/                 # Backend logic
│   ├── api/                # tRPC routers
│   ├── auth/               # Authentication config
│   └── db.ts               # Database client
├── trpc/                   # Client-side tRPC setup
├── stories/                # Storybook stories
└── styles/                 # Global styles
```

## Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| User | Extended Better Auth user with preferences |
| Character | AI characters with physical/personality attributes |
| Chat | 1-to-1 conversations between users and characters |
| Message | Individual messages (text/image/video/audio) |
| Collection | Saved images from chats |
| Subscription | Premium subscriptions via CoinGate |
| UsageQuota | Token and resource usage tracking |
| Story | 24-hour expiring character stories |
| Reel | Permanent character video content |
| Affiliate | Referral program accounts |
| Referral | Referred user tracking |

## Role & Permission System

This application uses a granular role-based permission system for access control.

### Built-in Roles

| Role | Description |
|------|-------------|
| `superadmin` | Full system access, bypasses all permission checks |
| `admin` | Administrative access, bypasses all permission checks |
| `default` | Base role for users without a custom role assigned |

### Custom Roles

Custom roles are stored in the `role_custom` table with granular CRUD permissions per module:

```typescript
// Permission structure for each module
{
  user: { create: boolean, read: boolean, update: boolean, delete: boolean },
  character: { create: boolean, read: boolean, update: boolean, delete: boolean },
  chat: { create: boolean, read: boolean, update: boolean, delete: boolean },
  media: { create: boolean, read: boolean, update: boolean, delete: boolean },
  content: { create: boolean, read: boolean, update: boolean, delete: boolean },
  visual_novel: { create: boolean, read: boolean, update: boolean, delete: boolean },
  ticket: { create: boolean, read: boolean, update: boolean, delete: boolean },
  subscription: { create: boolean, read: boolean, update: boolean, delete: boolean },
  affiliate: { create: boolean, read: boolean, update: boolean, delete: boolean },
  auth: { create: boolean, read: boolean, update: boolean, delete: boolean },
}
```

### Seeded Roles

The seed script creates two custom roles:

| Role | Description |
|------|-------------|
| `SUPER ADMIN` | All permissions enabled |
| `CUSTOMER` | Regular user permissions (can create/manage their own content, limited admin access) |

### Permission Enforcement

tRPC procedures enforce permissions at different levels:

| Procedure | Auth | Permission Check | Use Case |
|-----------|------|------------------|----------|
| `publicProcedure` | No | No | Public endpoints (signup, public reads) |
| `protectedProcedure` | Yes | No | Ownership-based endpoints (my chats, my profile) |
| `permissionProcedure(module, action)` | Yes | Yes | Granular permission check |
| `adminProcedure` | Yes | Admin role only | Admin-only endpoints |

### Usage Example

```typescript
// In a tRPC router:
import { permissionProcedure } from "@/server/api/trpc";

export const characterRouter = createTRPCRouter({
  // Requires character.create permission
  create: permissionProcedure("character", "create")
    .input(createCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      // ... implementation
    }),
});
```

### Auto-assignment on Signup

New users are automatically assigned the `CUSTOMER` role via Better Auth's `databaseHooks`. This happens for both email/password and OAuth signups.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
BETTER_AUTH_SECRET="..."

# Cloudflare R2 (S3-compatible storage)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
R2_PUBLIC_URL="..."

# CoinGate Payments
COINGATE_API_KEY="..."
COINGATE_WEBHOOK_SECRET="..."
```

## Design System

This project uses a comprehensive design system with semantic color tokens. See `DESIGN.md` for detailed guidelines.

Key principles:
- Use semantic CSS custom properties (no `dark:` classes)
- Component-specific colors auto-handle light/dark modes
- 44px minimum touch targets for accessibility
- Headless UI for accessible interactive components

## License

Private - All rights reserved
