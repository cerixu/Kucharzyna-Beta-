# Kucharzyna Design System 1.0

> Visual source of truth for Kucharzyna Beta 0.1.
> Reference: the approved iPhone mockup supplied for the project.

## 1. Product character

Kucharzyna is a professional kitchen tool designed exclusively for iPhone.

The interface should feel:
- dark, warm and culinary
- premium without looking luxurious or ornamental
- information-dense but calm
- photographic rather than icon-heavy
- fast to scan while working in a kitchen
- unmistakably native to an iPhone

The UI is not a desktop website squeezed onto a phone.

## 2. Visual principles

### Deep warm dark
The base is near-black graphite with a subtle warm brown bias. Avoid cold blue-black backgrounds.

### Warm light
Primary text is warm white rather than pure white. Secondary text is muted warm grey.

### Amber accent
Amber is the Kucharzyna brand accent. Use it for primary actions, active states, important highlights and progress.

### Photography first
Recipe, category, preparation and ingredient imagery is part of the interface language. Photos should carry visual hierarchy instead of decorative gradients or emoji.

### Glass only where useful
Translucent surfaces may be used for navigation, overlays and selected hero elements. Normal content cards remain solid enough to preserve readability.

### One visual language
Every module must reuse the same components, spacing, typography, radii, icon treatment and interaction states.

## 3. Color system

### Core dark palette

| Token | Value | Purpose |
|---|---|---|
| Background | #100E0C | App background |
| Surface 1 | #181513 | Standard card |
| Surface 2 | #211D19 | Elevated card |
| Surface 3 | #2B2520 | Strong/elevated surface |
| Text | #F7F1E8 | Primary text |
| Text soft | #C4BBB0 | Secondary text |
| Text muted | #8D8378 | Tertiary/caption text |
| Amber | #E7A94B | Brand/action |
| Amber strong | #F4BE63 | Press/highlight |
| Success | #79C98A | Positive state |
| Warning | #E7A94B | Warning state |
| Danger | #ED7770 | Error/critical |
| Line | rgba(255,255,255,.09) | Borders/dividers |

### Rules

- Never use pure black for the main background.
- Never use pure white for normal text.
- Amber is a semantic accent, not a background color for large areas.
- Danger is reserved for destructive or genuinely critical states.
- Success is reserved for confirmed/healthy states.
- Keep contrast readable over photography with overlays where necessary.

## 4. Typography

Use the iOS system font stack.

### Hierarchy

| Role | Size | Weight | Tracking |
|---|---:|---:|---:|
| Display | 44-48px | 800 | -0.06em |
| Screen title | 34-40px | 800 | -0.05em |
| Section title | 20-24px | 750 | -0.035em |
| Card title | 15-17px | 700 | -0.015em |
| Body | 14-16px | 400-500 | normal |
| Secondary | 12-14px | 400-500 | normal |
| Caption | 10-12px | 650-800 | +0.02em |
| Eyebrow | 9-11px | 800 | +0.14em |

### Rules

- Large titles are compact and confident.
- Body copy stays short.
- Captions may use uppercase.
- Do not use excessive font weights on one screen.
- Do not use italics as a structural UI device.

## 5. Spacing

Base unit: 4px.

Primary rhythm:
- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40

Default horizontal screen inset: 16-20px depending on screen size.

Minimum interactive target: 44x44px.

## 6. Shape language

| Component | Radius |
|---|---:|
| Small control | 12-14px |
| Button | 14-16px |
| Card | 18-22px |
| Large card/hero | 24-30px |
| Image tile | 14-18px |
| Bottom sheet | 28-32px top corners |
| Pill/chip | 999px |

Avoid mixing many unrelated corner radii on one screen.

## 7. Elevation

Kucharzyna uses depth through:
1. surface color
2. thin borders
3. soft shadows
4. photography
5. restrained gradients

Preferred shadow language:
- normal cards: subtle
- featured cards: medium
- modal/sheet: strong but soft

Never use heavy generic web drop shadows.

## 8. Buttons

### Primary
Amber filled, dark text, strong contrast.

Used for:
- primary action
- Next step
- Save
- Start cooking
- Add

### Secondary
Dark surface with a subtle border.

### Tertiary
Transparent, text/icon only.

### Destructive
Danger color, used only for destructive confirmation.

### Icon button
Minimum 44x44px. Icon centered. The icon must explain the action without requiring hover.

Press state:
- slight scale-down
- reduced brightness
- fast transition

## 9. Cards

### Standard card
Used for normal content.

### Interactive card
Entire card is tappable and has a clear pressed state.

### Recipe card
Must support:
- image
- title
- short description
- difficulty
- time
- servings
- favorite state

### Featured card
Used for Start hero/primary actions. Larger radius and stronger visual treatment.

## 10. Search

Search is a first-class navigation mechanism.

Default appearance:
- rounded dark translucent/solid field
- search icon
- placeholder
- optional clear button

Search results should support segmented filtering such as:
- Wszystkie
- Przepisy
- Składniki
- Tagi

The search field must remain comfortable to use with the iOS keyboard.

## 11. Chips and filters

Chips are compact, pill-shaped controls.

States:
- neutral
- selected
- disabled

Selected state uses amber background or amber border depending on context.

Do not use chips as decoration.

## 12. Bottom navigation

Primary tabs:

1. Start
2. Przepisy
3. Kuchnia
4. Zakupy
5. Więcej

The bottom bar is a real layout child, never a fixed element compensated with magic bottom offsets.

It must respect safe-area-inset-bottom.

Active tab:
- warm/white foreground
- amber indicator
- restrained surface highlight

## 13. Top bars

Standard top bar supports:
- back
- title
- optional action(s)

Start uses:
- Kucharzyna brand
- settings/action button
- search directly below

Recipe detail uses:
- back
- title context where appropriate
- favorite
- overflow

Cooking mode prioritizes:
- back/exit
- session context
- optional timer/sound control

## 14. Sheets and modals

Use bottom sheets for short actions and contextual controls.

Use full-screen presentation for:
- recipe editor
- ingredient selector
- complex calculators
- cooking mode

Sheets:
- top radius 28-32px
- safe-area aware
- drag handle only when the interaction supports dragging
- clear close action

## 15. Recipe imagery

Images should feel editorial and food-focused.

Rules:
- use real/generated culinary photography
- avoid visible watermarks
- preserve food texture
- use consistent crop ratios per component
- never distort images
- overlay gradients only when text sits directly over an image

Hero images:
- large, immersive
- rounded corners
- content readable over or immediately below the image

## 16. Ingredient Atlas

Ingredients are visual entities, not emoji.

Every canonical ingredient can eventually have:
- id
- name
- aliases
- image
- category
- default unit
- purchasable flag
- inventory tracking flag

Atlas imagery must use one coherent visual treatment.

Ingredient images are reused in:
- recipe ingredients
- shopping
- inventory
- food cost
- cooking mode

## 17. Iconography

Icons should be:
- simple
- line-based where possible
- consistent stroke weight
- optically centered
- recognizable at small sizes

Do not use emoji as primary navigation or action icons.

Brand mark is a dedicated culinary/chef symbol, not a combination of unrelated symbols.

## 18. Interaction

Every tappable element needs:
- minimum 44px target
- visible pressed state
- no hover dependency
- no tiny controls packed next to each other

Transitions should generally be 140-240ms.

Preferred easing: ease-out for entering UI and responsive press feedback.

Respect prefers-reduced-motion.

## 19. iPhone layout rules

The application is iPhone-only.

Required:
- viewport-fit=cover
- 100dvh
- top safe area
- bottom safe area
- left/right safe areas where relevant
- WebKit touch scrolling
- portrait-first layout
- no desktop navigation
- no desktop sidebar
- no mouse-dependent interactions
- no layout that relies on fixed pixel offsets around the bottom navigation

The UI must work across current iPhone sizes, not only one device.

## 20. Accessibility

- minimum touch target: 44x44px
- text remains readable on photographic backgrounds
- focus-visible states exist for keyboard/accessibility navigation
- buttons have accessible labels
- decorative images use appropriate empty alt text
- status is not communicated by color alone
- support reduced motion

## 21. States

Every component should define:
- default
- pressed
- selected
- disabled
- loading
- empty
- error
- success where applicable

Every feature screen must have a deliberate empty state. Empty states are not placeholders.

## 22. What Kucharzyna must avoid

- desktop-style UI
- blue/purple SaaS aesthetics
- cold black backgrounds
- excessive glassmorphism
- emoji as UI icons
- tiny tap targets
- random corner radii
- arbitrary one-off colors
- magic bottom offsets
- duplicated CSS overrides
- duplicated renderers
- placeholder screens presented as finished functionality

## 23. Design implementation order

The visual system is implemented in this order:

1. Design specification (this document)
2. Design tokens
3. Base/reset rules
4. Layout primitives
5. Core components
6. Screen-specific composition
7. Start screen
8. Recipe screens
9. Cooking mode
10. Ingredient Atlas
11. Shopping, inventory and calculators

This document is the reference for all later UI decisions.
