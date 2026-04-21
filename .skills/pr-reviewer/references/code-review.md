# Code Review Checklist

## Diff Review

Go through every file changed in the PR diff. For each file:

### General Correctness
- [ ] Logic is correct and does what the PR claims to do
- [ ] No obvious bugs, off-by-ones, or null pointer issues
- [ ] Error handling is present and appropriate (try/catch where needed, error states handled)
- [ ] No dead code or commented-out blocks that should be removed
- [ ] No commented-out debugging code left in

### Imports & Dependencies
- [ ] No unnecessary imports added
- [ ] No unused variables or imports
- [ ] No new dependencies introduced without justification
- [ ] If new packages added: check for abandoned/unmaintained packages, excessive bundle size, or known vulnerabilities

### State & Mutations
- [ ] React components use hooks correctly (no missing dependencies in useEffect deps arrays)
- [ ] State updates are correct (immutable patterns where expected)
- [ ] No direct state mutations on objects/arrays passed to children
- [ ] `useEffect` cleanup functions present for subscriptions/timers

### API Changes
- [ ] New endpoints have proper auth guards
- [ ] Request validation present (schema validation, type checks)
- [ ] Response types are accurate (no returning extra data that shouldn't be exposed)
- [ ] CRUD operations map correctly (GET=read, POST=create, PUT=update, DELETE=delete)
- [ ] No secrets, tokens, or PII logged or returned in responses

### Database & Data Model
- [ ] Migrations are safe and reversible (or marked non-reversible)
- [ ] Indexes added where needed for new query patterns
- [ ] No N+1 query patterns introduced
- [ ] Soft deletes used where appropriate

### TypeScript / Types
- [ ] Types are specific enough — no `any` without good reason
- [ ] New interfaces/API types match actual runtime behavior
- [ ] No type casts that bypass the type system (`as any`, `as unknown`)
- [ ] Generic types used correctly

### Performance
- [ ] No expensive operations inside loops (N+1, repeated DB calls, repeated expensive computations)
- [ ] Large data sets are paginated or lazy-loaded
- [ ] Images/media lazy-loaded (no eager load of below-fold content)
- [ ] No memory leaks (event listeners not removed, URLs not revoked)

### UX / Accessibility
- [ ] Loading states handled for async operations
- [ ] Empty states have helpful messages
- [ ] Error messages are user-friendly (not stack traces)
- [ ] Focus management works correctly for modals/drawers
- [ ] Color contrast sufficient for text
- [ ] Interactive elements have accessible labels

### Testing
- [ ] If test files exist alongside source files, new logic has basic coverage
- [ ] Test assertions match behavior (not just checking "no error")
- [ ] Mocks are realistic (not bypassing the actual logic being tested)

## Per-Language Notes

**TypeScript/JavaScript:**
- No `console.log` left in production code
- No hardcoded URLs/config that should be env vars
- Env vars are accessed correctly (`process.env.NEXT_PUBLIC_*` for client-side)
- `dangerouslySetInnerHTML` used only with sanitized content
- No SVG `xmlns` pointing to `http://` (should be `https://`)

**PHP/Laravel:**
- Routes have proper middleware (auth, throttle, validate)
- Eloquent queries use parameterization (no raw SQL with string interpolation)
- Controller methods are thin (logic in service/repository)
- Form Requests used for validation

**Python:**
- No secrets in code
- `except Exception as e:` with specific exception types
- Async functions correctly awaited

**Shell/DevOps:**
- Scripts are idempotent (can run twice safely)
- No hardcoded credentials in scripts
- Proper quoting for variables to prevent injection
