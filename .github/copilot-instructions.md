## Purpose

This file gives AI coding agents the essential, project-specific knowledge to be immediately productive in this Next.js + Shadcn UI admin dashboard codebase.

Keep instructions brief and actionable. When in doubt, modify files under `src/` and follow the existing feature-based layout.

## High-level architecture (big picture)

- Next.js 16 App Router based app (see `src/app/`). Routes are grouped (e.g. `(dashboard)`, `(auth)`) and use server and client components.
- UI: Shadcn UI + Tailwind CSS (styles in `src/app/globals.css`, `src/app/theme.css`).
- Auth: Clerk is used for authentication flows (refer to README and `package.json` deps).
- Data: Supabase client is available at `src/lib/supabase.ts` (env keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — database types are declared there.
- Error/observability: Sentry integration configured in `next.config.ts` (env keys: `NEXT_PUBLIC_SENTRY_DISABLED`, `NEXT_PUBLIC_SENTRY_ORG`, `NEXT_PUBLIC_SENTRY_PROJECT`).
- State & behavior: Zustand stores in `src/stores/`, Nuqs manages URL/search params, TanStack tables for data tables, kbar for command palette.

## Developer workflows & commands

- Local dev: follow README — install deps then run dev. This project recommends `bun install` and `bun run dev`, but standard npm/pnpm/yarn work too. `package.json` scripts:
  - `dev` -> `next dev`
  - `build` -> `next build`
  - `start` -> `next start`
  - `lint` -> `next lint`
  - `format` -> `prettier --write .`
- Environment: copy `env.example.txt` to `.env.local` and set required keys (Clerk, Supabase, Sentry). See `src/lib/supabase.ts` and `next.config.ts` for exact env names.
- Pre-commit hooks: Husky + lint-staged are configured; running `npm run prepare` sets up Husky.

## Project-specific conventions & patterns

- Feature-based layout: implement feature modules under `src/features/<feature>/` with this pattern:
  - `components/` (feature UI)
  - `actions/` (server actions / API calls)
  - `schemas/` (zod schemas for forms)
  - `utils/`
- Shared UI lives under `src/components/` (e.g. `layout/`, `ui/`). Prefer reusing existing shadcn components.
- Providers & theming: Root providers are wired in `src/app/layout.tsx` and `src/components/layout/providers.tsx` — add global context/providers there.
- Data access: use server actions or API routes inside `src/app/api` for server-side logic; for client-side interactions, use Supabase client from `src/lib/supabase.ts` or call your own APIs.
- Types: project exposes domain types (students, teachers, classes) in `src/lib/supabase.ts` and `src/types/` — import and use these for model typings.

## Integration points to be aware of

- Clerk (authentication) — used for sign-in/up flows in `src/app/(auth)/` and pages that rely on Clerk session state.
- Supabase — used for application data, client created in `src/lib/supabase.ts`.
- Sentry — wraps Next.js build via `withSentryConfig` in `next.config.ts` (disable with `NEXT_PUBLIC_SENTRY_DISABLED=true`).
- Nuqs — search params manager integrated at app-level (see `src/app/layout.tsx` for Nuqs adapter usage).

## Concrete examples to follow

- Adding a new dashboard route: create `src/app/(dashboard)/your-feature/layout.tsx` and `page.tsx`, reusing the sidebar/header components in `src/components/layout/`.
- Adding a server action that queries DB: put server-side logic in `src/features/<feature>/actions/` (or `src/app/api/`) and use `supabase` from `src/lib/supabase.ts`.
- New shared UI: place in `src/components/ui/` and create a matching story/demo in the feature that uses it.

## Quick tips for AI edits

- Preserve Next.js App Router conventions: do not move or rename route-group folders unless also updating references. Use the `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` pattern.
- Use existing hooks & stores (e.g. `src/hooks/*`, `src/stores/*`) instead of introducing ad-hoc global state.
- When modifying public APIs or types, update the corresponding types under `src/types` or `src/lib`.
- Environment-sensitive changes: prefer feature flags or env checks — Sentry and Supabase are toggled via env variables.

## Files & locations to inspect for context

- `README.md` — project overview and run instructions
- `package.json` — scripts and dependencies
- `next.config.ts` — Sentry and Next configuration
- `src/app/layout.tsx` — root layout, theme, Nuqs adapter, providers
- `src/lib/supabase.ts` — supabase client and domain types (Students, Teachers, Class)
- `src/components/layout/` — sidebar/header/providers (layout wiring)
- `src/features/` — feature modules (patterns to copy)

## When to ask the human

- If sensitive environment values (Clerk, Supabase, Sentry) are missing or unclear, ask for the `.env` values or deployment details.
- If the request requires changing deployment or CI settings, ask for target environment and CI provider.

---

If you'd like, I can: (1) add short examples for a common change (add a CRUD feature for `Class`), or (2) merge any custom agent guidance you want included — tell me what to add.

## UI guardrail (for AI agents)

- Always reuse existing components and patterns. Don't create new low-level UI primitives. Preferred building blocks:
  - Page wrapper: `src/components/layout/page-container.tsx`
  - Card pattern: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` from `src/components/ui/card`.
  - Empty/Error states: `EmptyState`, `ErrorState`, `LoadingState` from `src/components/empty-state.tsx` — use for friendly, non-scary UX:
    - `<LoadingState title="Loading..." description="..." />` for loading states
    - `<ErrorState title="..." description="..." onRetry={...} />` for errors with retry button
    - `<EmptyState title="..." description="..." action={{label: '...', onClick: ...}} />` for empty data states with CTA
  - Forms & dialogs: use components in `src/components/forms/` (e.g. `add-student-dialog.tsx`, `add-class-dialog.tsx`, `add-teacher-dialog.tsx`).
  - Tables: use TanStack table integrations as in `src/app/dashboard/students/page.tsx` and `src/app/dashboard/teachers/page.tsx`.
- Naming & routing:
  - Follow App Router conventions: create `page.tsx` inside `src/app/<route>/` or `src/app/dashboard/<section>/<subpage>/page.tsx`.
  - Use the sidebar entries in `src/constants/sidebar.ts` as the canonical list of routes—if you add a page, update the sidebar constant.
- Implementation pattern for new pages:
  - Copy the structure from existing pages (students/teachers/classes):
    - `use client` at top, import `useUser` from `src/context/user/user-context` and guard with `isAdmin` when appropriate.
    - Use `PageContainer` and one or more `Card` components for content.
    - Reuse `apiClient` from `src/lib/api/client.ts` to call backend endpoints.
    - Handle loading/error states with `LoadingState` and `ErrorState` instead of generic spinners/messages.
    - For empty data, show `EmptyState` with a call-to-action (e.g., "Add first student" button).
- Error & loading patterns (for all pages):
  - Replace generic loading spinners with `LoadingState` component (friendly, non-technical).
  - Replace generic error messages with `ErrorState` component (includes retry button, helpful tone).
  - Replace empty data messages with `EmptyState` component (friendly tone, clear CTA).
  - Use `variant="error"` for access denied / permission errors, `variant="empty"` for no-data states, `variant="loading"` for loading.

## Error Handling Best Practices (USER-FRIENDLY)

**Critical Rule**: Users should NEVER see technical error messages, stack traces, or jargon. All errors must be:
1. **Non-technical**: Replace "Cannot destructure..." with "Something went wrong. Please try again."
2. **Actionable**: Tell user what to do (retry, refresh, contact support)
3. **Friendly**: Use warm, encouraging tone (not scary red error dialogs)

### Common Error Patterns to Handle

#### FormContext Errors (useFormField, useFormContext)
- **Problem**: Dialog/form component used outside FormProvider context
- **Symptom**: "Cannot destructure property 'getFieldState' of null" in browser console
- **Fix**: Wrap form fields in `<Form>` context OR check if form is open before rendering fields
- **Pattern**:
```typescript
// ❌ WRONG: Form fields rendered without FormProvider
const MyForm = () => (
  <FormInput label="Name" />  // This will crash!
);

// ✅ CORRECT: Wrap in FormProvider from react-hook-form
const MyForm = () => (
  <Form {...form}>
    <FormInput label="Name" />  // Safe!
  </Form>
);
```

#### API 404 Errors (endpoint not found)
- **Problem**: Calling backend endpoint that doesn't exist yet
- **Symptom**: "Request failed with status code 404" in console + blank page
- **Fix**: Check endpoint path, or return mock data for UI development
- **Pattern**:
```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await apiClient.getXxx();  // Returns 404 if not implemented
    setData(data);
  } catch (err) {
    // Show friendly message, NOT the 404 error
    setError('Unable to load data. Please refresh the page.');
    setData([]);  // Fallback to empty data so UI doesn't crash
  } finally {
    setLoading(false);
  }
};
```

#### Network/Timeout Errors
- **Problem**: Backend is slow or unreachable
- **Symptom**: Request hangs, then fails with network error
- **Fix**: Always set timeouts, catch errors gracefully
- **Pattern**:
```typescript
// Already configured: apiClient has 30s timeout
// Always wrap fetch in try-catch with fallback
try {
  const result = await apiClient.get('/path');
} catch (err) {
  setError('Connection issue. Check your internet and try again.');
}
```

### User-Facing Error Messages (Examples)
Replace technical messages with these friendly alternatives:

| Technical Error | User-Friendly Message |
|-----------------|----------------------|
| "Cannot destructure property 'getFieldState'..." | "Something went wrong. Please refresh and try again." |
| "Request failed with status code 404" | "Unable to load this page. Please refresh or contact support." |
| "TypeError: Cannot read property 'map' of undefined" | "The data couldn't be loaded. Please try again." |
| "AxiosError: Network Error" | "Connection problem. Check your internet and try again." |
| "ReferenceError: apiClient is not defined" | "System error. Please refresh the page." |

**Display Location**: Use `ErrorState` component, NOT console.error or alert boxes.
```typescript
if (error) return <ErrorState title="Oops!" description={error} onRetry={fetchData} />;
```
- Accessibility & style:
  - Keep classNames and component props consistent with existing pages (no inline CSS modules).
  - Use existing icons from `lucide-react` as other pages do.
  - Ensure all error messages are non-technical and approachable (avoid jargon, use "We couldn't load..." instead of "API error").

Small changes only: prefer creating minimal skeleton pages that reuse the components above. Ask for permission before introducing new UI primitives or third-party UI libraries.
