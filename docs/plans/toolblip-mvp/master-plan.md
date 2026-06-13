# Toolblip MVP Master Plan

> Living planning workspace for the Toolblip MVP.

**Goal:** Define, build, and ship the smallest complete version of Toolblip that delivers a usable browser-tool platform end to end.

**Scope:**
- All browser tools already on the website must work in the MVP
- Browser tool history must work in the MVP
- A vanilla admin area focused on user management
- User favorites / sharing
- Memory/saved context support
- Pricing plan handling from free to paid
- A clear purchase offer for users
- A dashboard
- Bare-minimum SEO support for these launch pages and flows
- If a tool needs more than browser-only support, show "coming soon"
- Break the work into chronological stages
- Break each stage into features
- Break each feature into small tasks with two execution groups
- Track progress persistently
- Give every task a clear state marker: todo, working, blocked, needs attention, done, or lean
- Keep lean items visible so cut scope stays easy to review instead of being forgotten

**Out of scope:**
- Non-MVP nice-to-haves
- Broad refactors not needed for the MVP
- Implementation details before the product scope is clear

**Success criteria:**
- MVP scope is explicitly defined
- Stages are ordered and named
- Features are attached to stages
- Tasks are attached to features and split into two groups
- Progress can be updated and reviewed at any time
- The plan is usable as a living document for continuous work
- Task states are visible and easy to move between markers
- Stuck tasks can be moved to needs attention without losing the thread of work

## Stages
1. Launch foundation
2. Browser tools and history
3. Favorites and sharing
4. Billing, context, and plan controls
5. Admin area and user management

## Draft feature order
1. Browser tools first
2. Pricing and checkout, including paid plans and dashboard area
3. Favorites sharing and dashboard favorites list
4. Memory / saved context and favorites management in the dashboard
5. Admin area / user management

---

## Current status
- Master plan: complete for the tracked frontend MVP Task Group A/B work
- Stages: complete for frontend tasks
- Features: complete for frontend tasks
- Tasks: complete as tracked task groups
- Task markers: assigned and current
- Current question: none
- Implementation tracker: current through backend admin API PR #17, now needs human review

## Persistence rule
- After each answer, update the plan files immediately so the discussion can resume safely if the thread gets corrupted or interrupted.
- Cron and worker runs should re-read the live planning files on each run and avoid stale cached state.
- When possible, keep cron and worker runs aligned with the same workdir and environment assumptions as the interactive agent.

## Lean rule
- If a task is too heavy for MVP, mark it lean and keep it visible rather than burying it.
- Lean items should stay attached to the parent feature so the cutoff is easy to revisit later.
