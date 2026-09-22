# UI/UX Design Brief — TravelBuddy

## 1. Design philosophy

Warm, travel-inspired, and premium-feeling rather than generic SaaS-blue. The palette and typography are meant to evoke "golden hour on a trip with friends" — not a corporate dashboard.

## 2. Color palette

Custom **"sunset teal → coral"** palette, defined in the **oklch** color space for perceptually consistent gradients and better dark-mode behavior than traditional hex/RGB.

| Role | Direction |
|---|---|
| Primary | Deep sunset teal |
| Accent | Warm coral |
| Gradient use | Teal → coral transitions on hero sections, buttons, and highlight states |
| Neutral | Soft off-white / charcoal for text and backgrounds |

> Because colors are defined in oklch rather than hex, adjusting lightness/chroma for hover, disabled, or dark-mode states stays visually consistent instead of muddying — this is a deliberate technical choice, not just an aesthetic one.

## 3. Typography

| Use | Typeface |
|---|---|
| Headings / display | **Fraunces** — a serif with warmth and character, used to avoid the generic "tech startup" feel |
| Body / UI text | **Inter** — a clean, highly legible sans-serif for everything functional (forms, tables, nav) |

The pairing intentionally contrasts an editorial/warm display face against a neutral, functional body face.

## 4. Layout principles

- **Component system:** built on shadcn/ui primitives (accessible by default) rather than custom-built-from-scratch components, styled with Tailwind CSS v4 utility classes.
- **Motion:** Framer Motion used for entrance animations — sections and cards animate in rather than appearing abruptly, reinforcing the "premium" feel.
- **Home page centerpiece:** an interactive, rotating 3D globe (Three.js / React Three Fiber / drei) with clickable pins per destination — the signature visual element of the app, meant to be explored rather than just looked at.
- **Cards over tables** where possible for trips, matches, and destinations — more visual, more scannable, more "travel app" than "admin panel."
- **Responsive grid** for the travel memories feed, Instagram-style, so photo content is the visual focus.

## 5. UX principles

- **Transparency over black boxes:** compatibility match scores always show *why* — the breakdown by travel style / destinations / interests — never a bare unexplained number.
- **Status should never lie:** trip status (Upcoming/Ongoing/Completed) is computed live from dates rather than manually set, so the UI never shows stale state.
- **Gate sensibly, not everywhere:** exploring destinations is public (lets new users get a feel for the product before signing up); anything personal (trips, matches, chat, expenses, feed) requires login.
- **Demo honesty:** the booking flow is visually polished but explicitly labeled as a demo at the point of booking — no dark patterns implying a real transaction is happening.

## 6. Design tokens (for AI-assisted or future development)

When extending the UI, keep new components consistent with:
- oklch-based teal → coral palette (don't introduce new arbitrary hex colors)
- Fraunces for headings, Inter for body — no third typeface
- shadcn/ui component patterns (composable, accessible) rather than raw unstyled HTML elements
- Framer Motion for any new entrance/transition, matching existing animation timing/easing rather than introducing a new motion language
