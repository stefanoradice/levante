# Levante

CMS-agnostic headless frontend built with Next.js 15 App Router.

The core idea: the UI layer never knows (or cares) which data source is behind it. All data access goes through typed repository interfaces. Swapping WordPress for Supabase, Contentful, or anything else means implementing those interfaces — no UI code changes.

> Work in progress — also used as a learning project for Next.js App Router patterns and TypeScript.

---

## Architecture

```
src/lib/repositories/
├── interfaces.ts          # IPostRepository, ICommentRepository, IUserDataRepository, ...
├── factory.ts             # getPostRepository() — swap backend here, nowhere else
└── wordpress/             # current concrete implementation (WP REST API)
```

Pages and Server Actions import only from `factory.ts`, never from a concrete class. The domain types in `src/types/index.ts` are backend-neutral — mappers in each implementation translate raw API shapes into them.

```
src/lib/api/wordpress/
├── client.ts     # raw fetch wrappers + typed errors (WpApiError, WpConnectionError)
├── mappers.ts    # WP response shapes → domain types
└── types.ts      # WP-specific response types
```

Adding a new backend = new folder under `repositories/`, implement the interfaces, update `factory.ts`. Done.

---

## Current backend: WordPress

WordPress is the reference implementation. It exposes data via:
- Standard WP REST API (`/wp-json/wp/v2/`)
- A custom `headless` plugin (`/wp-json/headless/v1/`) for user-specific features not available out of the box: lists, bookmarks, user registration, nav menus

Authentication: JWT tokens issued by WordPress, stored in an `httpOnly` cookie server-side. Validated on every protected request via `getValidatedSession()`.

---

## Features

- Blog with infinite scroll (Intersection Observer + Route Handler)
- Single post with nested comments (authenticated + guest)
- Auth: register, login, logout via Server Actions
- User dashboard: custom reading lists (CRUD), bookmarks, reading history
- Dark mode (`next-themes`)
- Per-route error boundaries with typed error classes

---

## Tech Stack

| | |
|--|--|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI |
| Animations | Framer Motion |
| Client data fetching | SWR |

---

## Running Locally

Requires a running backend that implements the expected API surface. With the WordPress reference backend via Docker:

```bash
# from the parent directory (contains docker-compose.yml + this folder)
docker compose up
```

Then set env vars in `.env.local`:

```
NEXT_PUBLIC_WP_URL=http://localhost:8080
WP_INTERNAL_URL=http://wordpress
```

Or run standalone:

```bash
npm install
npm run dev
```

pointing `NEXT_PUBLIC_WP_URL` at any compatible backend.

---

## Key Design Decisions

**Repository pattern over direct fetching** — isolates the data layer completely. Each repository interface is small and focused. Unit-testing a page means mocking one interface, not a chain of fetch calls.

**Server Components as the default** — data fetching happens on the server wherever possible. `'use client'` is opt-in, only where interactivity requires it (infinite scroll, context providers, interactive buttons).

**httpOnly cookie session** — the JWT token is never exposed to JavaScript. Validated server-side on each request; the client gets a hydrated user object or nothing.

**Typed errors at the boundary** — `WpApiError` and `WpConnectionError` are thrown at the fetch layer and caught by `error.tsx` boundaries. The rest of the app doesn't handle fetch failures inline.
