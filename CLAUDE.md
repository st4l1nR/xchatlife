# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack memoir/book creation application built with Next.js, focusing on creating personalized books and memories. The project uses modern web technologies with a comprehensive design system and multi-step signup flow.

## Additional Instructions

Read DESIGN.md and src\styles\globals.css for design system guidance and prisma\schema.prisma for database guidance
- Always use @src\env.js for getting variables

## Key Commands

### Development

```bash
npm run dev                 # Start development server with Turbo
npm run build              # Build for production
npm run start              # Start production server
npm run preview            # Build and start production server
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run lint:fix           # Fix linting issues automatically
npm run typecheck          # Run TypeScript type checking
npm run check              # Run both lint and typecheck
```

### Formatting

```bash
npm run format:check       # Check code formatting
npm run format:write       # Fix code formatting
```

### Database Operations

```bash
npm run db:generate        # Generate Prisma migrations for development
npm run db:migrate         # Deploy Prisma migrations
npm run db:push            # Push schema changes to database
npm run db:studio          # Open Prisma Studio
./start-database.sh        # Start MySQL database container (requires Docker/Podman)
```

### Testing & Storybook

```bash
npm run storybook          # Start Storybook development server on port 6006
npm run build-storybook    # Build Storybook for production
```

## Tech Stack & Architecture

### Core Technologies

- **Framework**: Next.js 15+ with React 19
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js 5.0 (beta) with Discord provider
- **API**: tRPC for type-safe API calls
- **Styling**: Tailwind CSS 4.0 with comprehensive design system
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI with custom Catalyst-style design system

### Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── _components/        # Component library organized by atomic design
│   │   ├── atoms/          # Base UI components (buttons, inputs, etc.)
│   │   ├── organisms/      # Complex components (Hero, Navbar, signup steps)
│   │   └── pages/          # Full page components
│   ├── api/               # API routes (NextAuth, tRPC)
│   ├── auth/              # Authentication pages
│   └── [other routes]/    # Application pages
├── server/                # Backend logic
│   ├── api/               # tRPC routers and configuration
│   ├── auth/              # NextAuth configuration
│   └── db.ts              # Database client
├── trpc/                  # Client-side tRPC setup
├── stories/               # Storybook stories for components
└── styles/                # Global styles and CSS
```

### Database Schema

- **Users**: Standard NextAuth user model with Discord authentication
- **Posts**: Basic content model (expandable for book/memoir content)
- **Authentication Tables**: Account, Session, VerificationToken for NextAuth
- Uses MySQL as primary database with Prisma for type-safe database access

## Design System Architecture

### Component Organization

Components follow atomic design principles and use a comprehensive design system:

- **Atoms**: Button (20+ color variants), Input (with error/success states), form controls
- **Organisms**: Multi-step signup flow (6 steps), Hero section, navigation
- **Pages**: Complete page layouts with auth integration

### Key Design Patterns

#### 1. Headless UI Foundation

All interactive components wrap Headless UI for accessibility:

```tsx
import * as Headless from "@headlessui/react";

export const Button = forwardRef(function Button(props, ref) {
  return "href" in props ? (
    <Link {...props} className={classes} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  );
});
```

#### 2. Data-Slot Architecture

Components use `data-slot` attributes for styling and composition:

```tsx
<Button>
  <PlusIcon data-slot="icon" />
  Add Item
</Button>
```

#### 3. Color System (READ DESIGN.md)

- Uses semantic CSS custom properties that auto-handle light/dark modes
- Component-specific colors (sidebar-_, popover-_, card-\*)
- NO `dark:` classes - theme system handles everything automatically
- Priority: component-specific > semantic > generic theme properties

#### 4. Touch Target Enhancement

44px minimum touch targets on mobile for accessibility

### Multi-Step Signup Flow

The application features a comprehensive 6-step signup process with dedicated components:

- `StepSignUp1.tsx` through `StepSignUp6.tsx`
- `AuthSignUpPage.tsx` orchestrates the flow
- `SidebarSignUpAuth.tsx` provides navigation

## Authentication System

- **Provider**: Discord OAuth (expandable to other providers)
- **Session Management**: NextAuth.js with Prisma adapter
- **Type Safety**: Custom session augmentation for user ID access
- **Database**: Standard NextAuth tables in MySQL

## Development Guidelines

### Code Quality Standards

- **ESLint**: Comprehensive TypeScript and React rules
- **TypeScript**: Strict type checking with project service
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for code quality

### Key ESLint Rules

- Consistent type imports with inline style
- No unused variables (except `_` prefixed)
- Relaxed some strict TypeScript rules for development velocity
- React hooks and Next.js specific rules enabled

### Component Development

1. Follow atomic design principles
2. Use Headless UI for interactive components
3. Implement `data-slot` architecture for styling
4. Always use semantic color system (see DESIGN.md)
5. Include proper TypeScript types with forwardRef
6. Add Storybook stories for visual testing

### Form Handling

- **Validation**: Always use Zod schemas
- **State Management**: React Hook Form for all forms
- **Error Handling**: Built into design system components
- **Toast Notifications**: React Hot Toast for user feedback

### Database Development

1. Use Prisma for all database operations
2. Generate migrations for schema changes
3. Use type-safe Prisma client throughout application
4. Test with local MySQL container via `./start-database.sh`

### API Development

- **tRPC**: All API calls should use tRPC for type safety
- **Routers**: Add new routers to `/server/api/routers/`
- **Integration**: Register routers in `/server/api/root.ts`
- **Client**: Use tRPC React Query integration

## Environment Setup

### Database Setup (Windows)

1. Install WSL (Windows Subsystem for Linux)
2. Install Docker Desktop or Podman Desktop
3. Run `./start-database.sh` in WSL to start MySQL container
4. Configure `.env` with proper DATABASE_URL

### Development Workflow

1. `npm install` - Install dependencies
2. `./start-database.sh` - Start database
3. `npm run db:push` - Setup database schema
4. `npm run dev` - Start development server
5. `npm run storybook` - Start component development

### Testing Checklist Before Committing

- [ ] `npm run check` passes (lint + typecheck)
- [ ] `npm run format:check` passes
- [ ] Components work in both light and dark themes
- [ ] New components have Storybook stories
- [ ] Database changes include proper migrations
- [ ] Authentication flows work correctly

## Important Notes

- **Color System**: NEVER use `dark:` classes - use semantic color system
- **Components**: Always check DESIGN.md for color usage patterns
- **Database**: MySQL configured, not PostgreSQL (despite T3 Stack default)
- **Authentication**: Currently Discord only, but extensible
- **Styling**: Tailwind CSS 4.0 with extensive custom properties
- **Forms**: Zod + React Hook Form is the standard pattern
- **Notifications**: React Hot Toast for all user messages

## Recent Development Focus

The codebase shows active development on:

- Multi-step signup/onboarding flow
- Comprehensive design system implementation
- Storybook component documentation
- Authentication integration
- Database schema evolution for memoir/book features

Always reference DESIGN.md for comprehensive color system guidelines and component usage patterns.

## Testing Strategy

- We use cypress for e2e testing

## Cypress Testing Guidelines

- Always use {force:true} when clicking a listbox element with cypress

## List Component Architecture

This project follows a specific pattern for creating list-type components that display collections of data.

### Component Structure

When creating list components, follow this two-tier architecture:

1. **Base Component** (molecules): Individual item component (e.g., `SnackBook.tsx`)
2. **List Component** (organisms): Container that renders multiple items (e.g., `ListSnackBook.tsx`)

### Creating a New List Component

#### Step 1: Create the Base Item Component

```tsx
// src/app/_components/molecules/SnackItem.tsx
import React from 'react'
import clsx from 'clsx'

export type SnackItemProps = {
  className?: string
  id?: string
  // ... other properties specific to your data
  title: string
  description?: string
  href?: string
  onClick?: () => void
}

const SnackItem: React.FC<SnackItemProps> = ({ 
  className,
  title,
  description,
  href,
  onClick
}) => {
  const Component = href ? 'a' : 'div'
  const isClickable = href || onClick
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={clsx(
        'group flex items-center justify-between rounded-lg border border-border bg-card p-6 hover:bg-muted/50 transition-colors',
        isClickable && 'cursor-pointer',
        className
      )}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {isClickable && (
        <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </Component>
  )
}

export default SnackItem
```

#### Step 2: Create the List Container Component

```tsx
// src/app/_components/organisms/ListSnackItem.tsx
import React from "react";
import WrapperLoader from "../molecules/WrapperLoader";
import CardEmptyState from "../molecules/CardEmptyState";
import SnackItem from "../molecules/SnackItem";
import type { SnackItemProps } from "../molecules/SnackItem";

const ListSnackItem = ({
  loading,
  totalDocs,
  items,
}: {
  loading: boolean;
  totalDocs: number;
  items: SnackItemProps[];
}) => {
  return (
    <WrapperLoader loading={loading} totalDocs={totalDocs}>
      <div className="space-y-4">
        {items.map((item, key) => (
          <SnackItem key={item.id || key} {...item} />
        ))}
      </div>
      {loading && (
        <div className="space-y-4">
          {/* Loading skeletons */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded w-40 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-60"></div>
                </div>
                <div className="h-5 w-5 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && totalDocs === 0 && (
        <CardEmptyState
          title="No items found"
          description="There are no items to display at this time."
        />
      )}
    </WrapperLoader>
  );
};

export default ListSnackItem;
```

#### Step 3: Create tRPC Endpoint (if needed)

```tsx
// src/server/api/routers/items.ts
getListItemBySession: protectedProcedure
  .query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const items = await ctx.db.item.findMany({
      where: {
        userId: userId,
      },
      include: {
        // Include related data
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      href: `/dashboard/items/${item.id}`,
      // ... other formatted properties
    }));

    return {
      success: true,
      data: {
        items: formattedItems,
        totalCount: formattedItems.length,
      },
    };
  }),
```

#### Step 4: Use in Page Component

```tsx
// src/app/_components/pages/DashboardItemsPage.tsx
"use client";
import React from "react";
import { Button } from "../atoms/button";
import ListSnackItem from "../organisms/ListSnackItem";
import { api } from "@/trpc/react";

const DashboardItemsPage = () => {
  const { 
    data: itemsData, 
    isLoading,
    error 
  } = api.items.getListItemBySession.useQuery();

  const items = itemsData?.data?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Items</h1>
        <Button>Add New Item</Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">
            Failed to load items: {error.message}
          </p>
        </div>
      )}

      <ListSnackItem
        loading={isLoading}
        totalDocs={items.length}
        items={items}
      />
    </div>
  );
};

export default DashboardItemsPage;
```

### Key Design Principles

1. **Naming Convention**: Use `Snack[EntityName]` for base components and `ListSnack[EntityName]` for list components
2. **Base Component**: Focus on individual item display with hover states and click handling
3. **List Component**: Handle loading states, empty states, and error states
4. **TypeScript**: Always define proper props interfaces with optional fields
5. **Design System**: Use semantic colors from DESIGN.md (no hardcoded colors)
6. **Accessibility**: Support keyboard navigation and screen readers
7. **Performance**: Use proper keys for list items and consider virtualization for large lists

### Common Patterns

- **Loading States**: Show skeleton components while data is loading
- **Empty States**: Use CardEmptyState for when no data exists
- **Error States**: Display error messages with destructive color scheme
- **Clickable Items**: Support both `href` links and `onClick` handlers
- **Responsive Design**: Ensure components work on all screen sizes

### Example Use Cases

- **Book Lists**: `SnackBook` + `ListSnackBook` (already implemented)
- **Story Lists**: `SnackStory` + `ListSnackStory`
- **Comment Lists**: `SnackComment` + `ListSnackComment`
- **User Lists**: `SnackUser` + `ListSnackUser`

Always follow this pattern when creating new list-type components to maintain consistency across the application.
- Always use Link nextjs component instead of a html element for links
- For using auth session on server components we use import { auth } from "@/server/auth";
- Always use loding property when action loading for button component
- Always use bg-muted instead of bg-card for snacks and cards components
- Always use zod and react-hook-form for field inputs
- Alway when creating a dialog type off component use @src\app\_components\organisms\DialogBase.tsx as structure reference
- label component off @src\app\_components\atoms\fieldset.tsx always have to have a field parent