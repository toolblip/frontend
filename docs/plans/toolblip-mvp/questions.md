# Questions Log

## Q1
**Question:** What is the end-to-end MVP outcome you want Toolblip to achieve?

**Answer:** Toolblip will include multiple browser-based tools, an admin panel, shared favorites, saved memory/context, and free-to-paid pricing plan handling.
**Addendum:** In the MVP, all browser tools already on the website must work, including browser history and the pricing-plan path.
**Current plan shape:** Free + 3 paid plans.
- Free: all tools, client-side processing, 5MB file limit, 0GB storage, 1 seat, no API access, no priority support.
- Starter: 1GB storage, 50MB file limit, 1 seat.
- Pro: 10GB storage, 500MB file limit, 3 seats, API access, standard support.
- Max: 50GB storage, 5GB file limit, 10 seats, API access, priority support.
**Usage limits:**
- Guest: 10 uses/day.
- Free: 25 uses/day.
- Starter/Pro/Max: unlimited.
**Feature order:**
1. Browser tools first
2. Pricing and checkout, including paid plans and dashboard area
3. Favorites sharing and dashboard favorites list
4. Memory / saved context and favorites management in the dashboard
5. Dashboard area (admin panel) MVP-ready
**Dashboard area (MVP):**
- User profiles are necessary.
- Billing status is necessary.
- Usage counters are version two.
- Tool shortcuts are version two.
- Admin-only controls start as a vanilla user-management area.
- MVP admin actions: upgrade plan, downgrade plan, cancel plan, and basic support.
- Revisit whether anything else belongs in this area later.

## Q2
**Question:** What should the MVP admin-only control area include?

**Answer:** Start with a vanilla admin area focused on user management:
- upgrade plan
- downgrade plan
- manually cancel a plan when a user asks
- provide basic support through user management actions
- check later if any additional admin-only controls are needed

## Q3
**Question:** What should count as the exact MVP launch boundary and acceptance criteria?

**Answer:** MVP launch needs:
- a dashboard
- pricing plan handling
- people can share / favorite items
- browser tools fully working
- if a tool needs more than browser-only support, show "coming soon"
- bare-minimum SEO on the launch pages and flows

**Open:** We still need to confirm what "fabricate" meant in your message so the feature wording is right.

**Browser-tool history:**
- Favorites should appear in the dashboard first.
- Recent tools used should come next.
- Use one hidden default favorites list in MVP.
- Defer the favorites-list dropdown / multi-list picker until later.
- Shared favorites are a version-two feature.
**Saved memory/context:**
- Include lightweight saved context in MVP for paid users.
- Keep it user-controlled and simple.
- Use it to save last-used settings / preferred defaults / resume state.
- Defer heavier AI-style memory or recommendations until later.

## Open decisions
- Define the first release boundary
- Define what is explicitly out of scope
- Define which browser tools are in MVP versus later
