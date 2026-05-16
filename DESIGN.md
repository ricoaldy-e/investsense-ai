# InvestSense AI — Design System & Guidelines (V2)

This document serves as the single source of truth for the InvestSense AI visual identity. The design language is inspired by high-end precision engineering (Bugatti) and clinical data analysis, moving away from generic "AI SaaS" templates.

## 1. Core Philosophy
- **Rationality over Hype**: The design must evoke calmness, objectivity, and precision. It should feel like a clinical tool that helps investors conquer FOMO (Fear Of Missing Out).
- **Confidence in Silence**: Rely on extreme whitespace and typography rather than flashy backgrounds, gradients, or shadows.
- **Precision Engineered**: Sharp edges, hairline borders, and monospace data points give the impression of a tool built by engineers for serious analysts.

---

## 2. Color System (Cold Surgical)

We use a desaturated, "cold" palette. Avoid bright cyan, neon blue, or generic tech primary colors.

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Background Dark** | `#09090b` | Main page backgrounds (`bg-bg-dark`) |
| **Surface** | `#111113` | Secondary backgrounds, modals (`bg-surface`) |
| **Card Dark** | `#18181b` | Main card backgrounds (`bg-card-dark`) |
| **Card Border** | `#27272a` | Default borders, dividers (`border-card-border`) |
| **Hairline** | `#1f1f1f` | Very subtle dividers (`divide-hairline`) |
| **Primary Accent** | `#a8b5c8` | Desaturated slate-blue for buttons, links, active states (`text-accent`, `bg-accent`) |
| **Text Main** | `#fafafa` | Primary headings, active text (`text-text-main`) |
| **Text Secondary** | `#a1a1aa` | Body paragraphs, descriptions (`text-text-secondary`) |
| **Text Muted** | `#52525b` | Overlines, inactive tabs, subtle hints (`text-text-muted`) |
| **Danger** | `#e85d5d` | Warnings, bearish sentiment, high risk (`text-danger`) |

---

## 3. Typography Trinity

We strictly use a 3-font system. **NEVER use `font-bold` or `font-extrabold`.**

### A. Display / Headings (`font-display`)
- **FontFamily**: `Outfit`
- **Weight**: Light (`font-light` / 300) or Medium (`font-medium` / 500).
- **Style**: Always UPPERCASE, always tracked (`tracking-[1.5px]` to `tracking-[3px]`).
- **Usage**: Main page titles, section headers, card titles.

### B. Editorial Body (`font-body`)
- **FontFamily**: `Source Serif 4`
- **Weight**: Regular (`font-normal` / 400). Can use italic for quotes/disclaimers.
- **Style**: Normal sentence case, generous line-height (`leading-relaxed`).
- **Usage**: All paragraph text, descriptions, feature explanations. Gives the platform a trustworthy, human-designed editorial feel.

### C. UI & Data (`font-mono`)
- **FontFamily**: `JetBrains Mono`
- **Weight**: Regular (400) or Medium (500).
- **Style**: UPPERCASE for UI labels (with tracking), normal case for numbers/data.
- **Usage**: Nav links, buttons, overlines, stock prices, percentages, risk levels.

---

## 4. UI Components & Geometry

### 🟦 Sharp Geometry (0px Corners)
Everything in the UI—cards, images, input fields, progress bars, dropdowns—MUST have **sharp corners** (`rounded-none`). No rounded rectangles allowed.

### 💊 The Only Exception: Buttons
Buttons are the ONLY elements allowed to have rounded corners, and they must be perfectly round pills (`rounded-full`). 
- **Default State**: Transparent background, 1px accent border, accent text (`border border-accent/40 text-accent`).
- **Hover State**: Fill background with accent, text becomes dark (`hover:bg-accent hover:text-bg-dark transition-all`).
- **Never**: Do not use filled primary buttons by default.

### 🔲 Inputs (Auth / Search)
- Use **Bottom-Border Only** inputs. 
- Do not use fully enclosed boxed inputs. 
- Background must be transparent (`bg-transparent border-b border-card-border`).

### 🃏 Cards
- Background: `bg-card-dark` or `bg-bg-dark`.
- Border: `border border-card-border`.
- **NO SHADOWS** (`shadow-none`).
- **NO GRADIENT GLOWS** on hover.

---

## 5. Layout & Spacing

- **Extreme Whitespace**: Use `py-32` or `py-40` between major landing page sections. Let the content breathe.
- **Invisible Borders**: Do not separate main horizontal sections with border lines. Use whitespace to group content.
- **Hairline Grids**: When displaying lists or feature grids, use the 1px gap trick: container `bg-card-border`, items `bg-bg-dark`, with `gap-px` to create perfect 1px dividing lines.

---

## 6. 🚫 Anti-Patterns (What NOT to do)

If you catch yourself doing any of the following, **stop and rewrite**:

1. ❌ Using `font-bold`, `font-extrabold`, or `font-black`. (Use font size and monospace for hierarchy instead).
2. ❌ Using `rounded-md`, `rounded-lg`, `rounded-xl`. (It makes the site look like a cheap SaaS template).
3. ❌ Using shadows (`shadow-md`, `shadow-2xl`). (We rely on borders for depth).
4. ❌ Using bright primary colors like standard blue, red, or green for backgrounds.
5. ❌ Adding glowing radial gradients behind cards or text. (If ambient light is needed, keep opacity under `0.03`).
6. ❌ Using sans-serif (Inter/Roboto) for body paragraphs. (Always use Source Serif 4).