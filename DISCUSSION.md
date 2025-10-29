# DISCUSSION.md

## Overview
This project represents a simplified advocate directory for Solace, allowing users to search and browse advocates by name, specialty, or city.
I focused my limited time on stabilizing the backend, integrating the database, and improving the frontend to support scalable live search.

---

## Improvements I’d Make With More Time

### 1. Backend Enhancements
- Add query parameters for specialty, degree, and city filters, plus server-side pagination to handle large datasets efficiently (e.g. `?page=2&limit=20`).
- Replace `ILIKE` filters with Postgres full-text search or a trigram index for better performance and more natural matching.
- Use Zod to validate query parameters and API responses before returning them to the client.

---

### 2. Frontend Improvements
- Build a card layout with some hover animations, avatar placeholders.
- Add a visible loading spinner, “no results” animation, and preserve the last search query in the URL (`?q=`).
- Use React Query (TanStack Query) for caching API results, revalidation, and background updates to reduce flicker and redundant requests.

---

### 3. Developer Experience
- Add unit tests for API routes and integration tests with a test Postgres container (using Jest or Vitest).

---

---

## Summary
If given more time, I would focus on building out a production-grade search experience — optimized, accessible, and observable — while maintaining a strong developer experience through tests, migrations, and CI/CD.
The core foundation is now in place: a functional database, working API, and responsive live search frontend.
