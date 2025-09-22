### public_feed

An application for listing, searching, and viewing posts.

# Description

**public_feed** is a Next.js application that fetches posts from a public API.  
It provides a responsive UI with Material UI, supports search and pagination, and includes a single post detail view.  
Testing is implemented with Vitest and React Testing Library.


## Documentation

> API docs.  
Posts are fetched from [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts).

## Setup

### Dependencies

- [NodeJS](https://github.com/nodejs/node) – JavaScript runtime environment
- [Next.js](https://nextjs.org/) – React framework for SSR & routing
- [Material UI](https://mui.com/) – UI component library
- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) – Data fetching and caching
- [Vitest](https://vitest.dev/) – Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) – Component testing utilities

### Getting Started

Follow these steps to set up the project in development mode:

- Install [Node.js](https://nodejs.org/en/download/)
- Clone the repository:
  ```bash
  git clone https://github.com/mikenthiwa/public_feed.git
  cd public_feed
  ```
  
- Install dependencies
    ```bash
  yarn install
  ```

- Environment Variables
Create a .env.local file in the root directory:

### Architecture & Approach

The project follows a **feature-based architecture**:

- **Core**: Contains shared logic, types and services. It does not depend on other layers, ensuring it remains lightweight and reusable.
- **Features**: Each feature encapsulates its state, API hooks, and UI composition. Features depend on **Core** and **UI** layers but not on each other, which reduces coupling and improves scalability.
- **UI**: Contains shared presentational components (e.g., buttons, layouts, inputs).

#### Trade-offs
- This separation introduces slightly more boilerplate, but the payoff is in maintainability and testability as the codebase grows.
- By ensuring **Core** has no external dependencies, it can be tested in isolation and potentially reused across other projects.
- Having features depend on Core and UI provides a clean flow of data and reduces circular dependencies, but it requires discipline in keeping boundaries clear.


```
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

- Testing
```bash
yarn test
```

### Given that your application were to be launched globally with 100,000 daily users:

#### How would you design and implement authentication? Consider security, scalability and user experience
#### How would you design a scalable and efficient search functionality? Consider both frontend and backend aspects, including indexing, performance optimization andpotential third party services.
#### How would you monitor health and performance of the application/infrastructure, andwhat strategies would you implement for ongoing maintenance and updates?
#### Goals
#### 1) Authentication
- Secure
- Scalable 
- Great UX
#### Architecture
**Authentication**
 *Frontend*
 - Use credentials or OIDC via Auth.js provider
 - Session model: Auth.js JWT strategy, with server callbacks to:
    - Store accessToken (short-lived, ~10–15 min) and refreshToken (longer, ~7–30 days).
    - Refresh flow in jwt callback when the access token is near expiry.
 - Cookies: HttpOnly; Secure; SameSite=Lax for session; CSRF token cookie for forms.
 - CSRF: built-in Auth.js CSRF for sign-in routes; require custom header for state-changing API calls.
 
 *Backend*
 - Identity for user store (password hashing with BCrypt), email verification, lockouts, password reset.
 - Token service 
    - Issue JWT access tokens (audience = resource APIs, scopes/roles embedded).
    - Refresh token rotation: store hashed refresh tokens server-side (DB/Redis), rotate per use, revoke stolen chains.
    
 *Security hardening*
  - XSS prevention (textContent, sanitization if rendering HTML).
  - Rate limiting
  - Device/session management UI (list & revoke active sessions).
  - Audit logs: log auth events (successful/failed sign-ins, refresh, revokes).
 
 *UX details*
  - Silent refresh before expiry (Auth.js jwt callback logic).
  - Optimistic navigation after sign-in; preserve callbackUrl.
  - Passwordless / social options to reduce friction.

**Search**
 *Backend*
  - Caching: Redis cache for hot queries (e.g., top searches, “latest”).
  - Pagination: keyset over id, rank (avoid offset for deep pages).
  - Full-text search (tsvector, GIN indexes) or pg_trgm for fuzzy matching.
  - Index design: Create a search index that includes key fields such as `title`, `body`, `tags`, `author`, and `createdAt`.
    Apply analyzers to improve search quality:
      - Convert all text to lowercase (so searches are case-insensitive).
      - Remove common words (stopwords like “the”, “a”, “and”).
      - Use stemming (so “run” matches “running”).
      - Add a synonyms list (so “car” also matches “automobile”).
  - CDC pipeline: on write to Postgres → enqueue to Kafka/SQS → indexer service upserts documents.
  - Observability
    - Track query latency P50/P95, timeouts, “no results” %, top queries.


 *Frontend*
  - Debounced input (250–300ms),
  - Render results incrementally;

**Monitoring, health, operations & maintenance**
 - Metrics: Use OpenTelemetry → Prometheus → Grafana (or Datadog/New Relic):
 - Tracing: distributed traces across Next.js → API → DB/search (W3C trace context).
 - Logs: structured JSON; centralize (ELK/Datadog). Redact PII/secrets.
    
  *Health checks & rollout*
   - Liveness/Readiness endpoints (check DB, cache, search cluster ping).
   - Deployment
     - Feature flags for safe, gradual releases.
     - Blue/Green or Canary with automatic rollback on SLO breach
  *Maintenance*
     - Backups: nightly DB snapshots + PITR; index snapshots.
     - Schema changes: backward-compatible migrations; online index builds.
     - Security posture: monthly dependency audit; SAST/DAST; secret scanning; CSP/report-only to tune; bug bounty (if public).
     - Key rotation: regular JWT signing key rotation (use kid + JWKS).
    
    
