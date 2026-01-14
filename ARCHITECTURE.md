# Architectural Decision Record (ADR)

## Sports Event Management Application

This document explains the key architectural decisions made during the development of this application.

---

## 1. Framework Choice: Next.js 15 with App Router

### Decision
Use Next.js 15+ with the App Router instead of Pages Router or other frameworks.

### Rationale
- **Server Components by Default**: App Router enables React Server Components, reducing client-side JavaScript and improving performance
- **Server Actions**: Native support for server mutations without creating separate API routes
- **Built-in Streaming**: Suspense boundaries and streaming for better UX during data loading
- **Modern Routing**: File-based routing with layouts, nested routes, and parallel routes
- **Assignment Requirement**: Specified in the requirements

### Alternatives Considered
- **Pages Router**: Less aligned with modern React patterns
- **Remix**: Good alternative but less ecosystem support
- **Plain React + Express**: More setup required, no built-in SSR

---

## 2. Database: Supabase

### Decision
Use Supabase as the database and authentication provider.

### Rationale
- **PostgreSQL**: Full-featured relational database with ACID compliance
- **Row Level Security (RLS)**: Native security at the database level
- **Real-time Subscriptions**: Built-in real-time capabilities if needed
- **Authentication**: Integrated auth with OAuth providers
- **Assignment Requirement**: Specified in the requirements

### Implementation Details
- Used `@supabase/ssr` for proper cookie handling with Next.js
- Created separate server and client Supabase clients
- Implemented RLS policies for user-scoped data access

---

## 3. Server Actions Over API Routes

### Decision
Use Server Actions for all database operations instead of API Route Handlers.

### Rationale
- **Assignment Requirement**: "Actions over API Routes" was explicitly stated
- **Type Safety**: End-to-end type safety without manual type definitions
- **Simplicity**: No need to serialize/deserialize data
- **Colocation**: Actions can be defined alongside components
- **Automatic Revalidation**: Built-in cache invalidation with `revalidatePath`

### Generic Action Helper
Created a `safeAction` wrapper for consistent error handling:

```typescript
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function safeAction<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

This provides:
- **Consistent API**: All actions return the same shape
- **Error Boundaries**: Errors are caught and returned gracefully
- **Type Safety**: Generic typing for different return types

---

## 4. Form Handling: react-hook-form + Zod

### Decision
Use react-hook-form with Zod for form validation, wrapped with shadcn's Form component.

### Rationale
- **Assignment Requirement**: shadcn Form with react-hook-form was required
- **Performance**: Uncontrolled inputs minimize re-renders
- **Type Safety**: Zod schemas generate TypeScript types
- **Validation**: Built-in client-side validation with custom messages
- **Array Fields**: useFieldArray for dynamic venue management

### Implementation
```typescript
const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  sport_type: z.enum(SPORT_TYPES),
  date_time: z.string().min(1, "Date and time required"),
  description: z.string().optional(),
  venues: z.array(venueSchema).min(1, "At least one venue required"),
});
```

---

## 5. UI Component Library: shadcn/ui

### Decision
Use shadcn/ui for all UI components.

### Rationale
- **Assignment Requirement**: Explicitly specified
- **Ownership**: Components are copied into the project, not imported
- **Customization**: Full control over styling and behavior
- **Radix Primitives**: Built on accessible Radix UI primitives
- **Tailwind Integration**: Native Tailwind CSS support

### Components Used
- Button, Input, Textarea, Label
- Card, Badge, Skeleton
- Dialog, DropdownMenu
- Select, Form components
- Separator, Avatar
- Sonner (toast notifications)

---

## 6. Styling: Tailwind CSS v4

### Decision
Use Tailwind CSS v4 with CSS variables for theming.

### Rationale
- **Assignment Requirement**: Tailwind CSS was specified
- **Utility-First**: Rapid UI development with utility classes
- **Dark Mode**: CSS variable-based theming for easy dark mode
- **Consistency**: Design tokens via CSS custom properties
- **Performance**: PurgeCSS removes unused styles

### Theme Setup
Used CSS variables for all colors and spacing, enabling:
- Light/dark mode switching
- Consistent design tokens
- Easy customization

---

## 7. Database Schema Design

### Decision
Two-table design with Events and Venues having a one-to-many relationship.

### Rationale
- **Normalization**: Avoids JSON arrays in the events table
- **Flexibility**: Venues can be queried independently if needed
- **Integrity**: Foreign key constraints ensure data consistency
- **Scalability**: Can add venue-specific features later

### Schema Decisions
1. **UUIDs vs Auto-increment**: UUIDs for security (no enumeration)
2. **Timestamps**: Both `created_at` and `updated_at` for auditing
3. **RLS Policies**: User-scoped access at database level
4. **Cascade Deletes**: Venues deleted when event is deleted

---

## 8. Authentication Strategy

### Decision
Support both email/password and Google OAuth authentication.

### Rationale
- **Assignment Requirement**: Both options specified
- **User Convenience**: OAuth reduces friction for sign-up
- **Security**: Supabase handles secure session management
- **Flexibility**: Easy to add more OAuth providers

### Implementation
- Middleware for route protection
- Server-side session validation
- Proper redirect handling for OAuth flows

---

## 9. Search and Filter Implementation

### Decision
Server-side search and filter with URL-based state.

### Rationale
- **Assignment Requirement**: "Should refetch from the database"
- **Shareability**: URLs can be shared with filter state
- **Performance**: Database does the heavy lifting
- **SEO**: Search params are visible to crawlers

### Implementation
- Search params parsed in Server Component
- Passed to `getEvents` action
- Debounced input for better UX
- Loading states with Suspense

---

## 10. Error Handling Strategy

### Decision
Consistent error handling at multiple levels.

### Rationale
- **User Experience**: Clear error messages via toast
- **Developer Experience**: Console logging for debugging
- **Type Safety**: ActionResult type forces error handling
- **Graceful Degradation**: App doesn't crash on errors

### Levels of Error Handling
1. **Zod Validation**: Form-level validation
2. **Server Action**: Try-catch with safeAction
3. **Component**: Toast notifications for user feedback
4. **Middleware**: Auth errors redirect to login

---

## 11. State Management

### Decision
No client-side state management library (Redux, Zustand, etc.).

### Rationale
- **Server Components**: Most data fetched server-side
- **React State**: Local state sufficient for forms
- **URL State**: Search/filter state in URL
- **Simplicity**: Avoids unnecessary complexity

### State Sources
1. **Server**: Database via Server Components
2. **URL**: Search params for filters
3. **React**: useState for form state
4. **Supabase**: Session state

---

## 12. Project Structure

### Decision
Feature-based organization within App Router conventions.

### Rationale
- **Clarity**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Convention**: Follows Next.js best practices

### Structure
```
src/
├── actions/     # Server Actions (business logic)
├── app/         # Routes and pages
├── components/  # UI components
├── hooks/       # Custom hooks
├── lib/         # Utilities
└── types/       # TypeScript types
```

---

## Summary

This application prioritizes:
1. **Type Safety**: TypeScript throughout with Zod validation
2. **Security**: RLS, server-side operations, auth middleware
3. **Performance**: Server Components, streaming, efficient queries
4. **Developer Experience**: Clear patterns, consistent error handling
5. **User Experience**: Loading states, toast feedback, responsive design

All decisions were made considering the assignment requirements while following modern best practices for Next.js applications.
