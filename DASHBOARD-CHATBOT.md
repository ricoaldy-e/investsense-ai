# InvestSense AI — Dashboard & AI Assistant Panel Design Specification

This document defines the layout, behavior, and design requirements for the integrated AI Assistant Panel within the Dashboard page.

---

## 1. Architecture Overview

The AI Assistant is NOT a separate page. It is a collapsible right-side panel embedded within the `DashboardLayout`. This approach:
- keeps users in context while analyzing stocks
- eliminates the need to navigate away from the dashboard
- mirrors modern AI agent interfaces (e.g., Antigravity, Cursor, GitHub Copilot Chat)

### Layout Structure

```text
┌──────────────────────────────────────────────────────────────┐
│  DashboardLayout                                             │
│  ┌────────┬──────────────────────────────┬─────────────────┐ │
│  │        │          Navbar              │                 │ │
│  │        ├──────────────────────────────┤                 │ │
│  │Sidebar │                              │  AI Assistant   │ │
│  │        │      Main Content Area       │     Panel       │ │
│  │  - Dashboard                          │                 │ │
│  │  - Market    (Dashboard / Market      │  (Right Side)   │ │
│  │    Insight     Insight via Outlet)    │                 │ │
│  │  - Logout                             │  [Default:      │ │
│  │        │                              │   OPEN]         │ │
│  │        │                              ├─────────────────┤ │
│  │        │                              │  Chat Input     │ │
│  └────────┴──────────────────────────────┴─────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Sidebar Navigation

The sidebar contains exactly 3 items:

| Menu Item | Route | Icon | Description |
|:---|:---|:---|:---|
| Dashboard | `/dashboard` | `LayoutDashboard` | Stock analysis workspace |
| Market Insight | `/market-insight` | `TrendingUp` or `BarChart3` | Macro-level market overview page |
| Logout | — | `LogOut` | Ends session, redirects to `/login` |

### Key Changes from Previous Version
- ❌ Removed: "Chatbot" menu item and `/chatbot` route
- ✅ Added: "Market Insight" menu item linking to `/market-insight`
- ❌ Removed: Floating Chat Button entirely

---

## 3. AI Assistant Panel (Right Side)

### 3.1 Panel Behavior

| Property | Value |
|:---|:---|
| Position | Right side of `DashboardLayout`, inside the flex container |
| Default state | **OPEN** (Visible by default on Desktop) |
| Width (open) | Default `w-[380px]`, but **draggable/resizable** by the user. |
| Width (closed) | `w-0` with `overflow-hidden` |
| Transition | `transition-all duration-300` (only when toggling, disable during drag) |
| Z-index | Same level as main content (not overlapping on desktop) |
| Border | `border-l border-card-border` |
| Background | `bg-surface` or `bg-bg-dark` |

### 3.2 Toggle & Resize Mechanism (No Floating Button)

The Floating Action Button has been **completely removed**.
The left border line of the AI Panel now serves two interactive purposes:

1. **Draggable Resizer**: The entire border line should have `cursor-col-resize`. The user can click and drag this line left or right to manually adjust the width of the AI panel. (Implementing a simple resizer using mouse events or a library).
2. **Toggle Button**: Attached precisely to this border line (vertically centered or near the top) is a small toggle button (e.g., `ChevronRight`/`ChevronLeft`). Clicking this button instantly collapses the panel to `w-0` or expands it back to its last known width.

### 3.3 Dashboard Layout Adjustments

Since the AI Panel is open by default and resizable, the main content area (where the Dashboard cards live) will have dynamic width.
- The existing stock analysis cards (StockChartCard, SentimentAnalysisCard, etc.) must be highly responsive using CSS Grid/Flexbox to adapt gracefully as the user resizes the panel.
- The layout should fluidly change from 3 columns to 2 columns or 1 column depending on the remaining space.

### 3.4 Panel Internal Structure

```text
┌─────────────────────────┐
│  Panel Header           │  ← h-16, border-b, title
├─────────────────────────┤
│                         │
│  Chat Messages Area     │  ← flex-1, overflow-y-auto
│  (scrollable)           │
│                         │
│  - Zero state           │
│  - User messages        │
│  - AI responses         │
│  - Typing indicator     │
│                         │
├─────────────────────────┤
│  Chat Input             │  ← fixed bottom, textarea + send button
│  + Disclaimer           │
└─────────────────────────┘
```

#### Panel Header
- Height: `h-16` (matches Sidebar and Navbar headers)
- Content: Title text ("AI ASSISTANT" in font-mono uppercase)
- Border: `border-b border-card-border`

#### Messages Area
- Scrollable container with `overflow-y-auto`
- Zero state: "System Ready" message when no conversation exists
- Message bubbles: user messages right-aligned with `bg-card-dark border`, AI messages left-aligned without background
- Typing indicator: pulsing dot with "[ANALYZING MARKET DATA...]" text

#### Chat Input
- Positioned at the bottom of the panel
- Contains: textarea input + send button (circular, pill-style)
- Placeholder: "Ask AI..." (short, since panel width is limited)
- Disclaimer text below input

### 3.5 Contextual Awareness

When the user has an active stock loaded on the dashboard:
- The AI panel should be aware of `lastViewedStock` from `localStorage`
- When the dashboard loads with a stock active, the panel can automatically provide initial context or suggestions.

---

## 4. Mobile Behavior

### 4.1 AI Assistant Panel on Mobile

Because mobile screens lack the horizontal space to keep the panel open alongside content:
- The panel **cannot** be open by default on mobile.
- It appears as a **full-screen slide-over overlay** from the right.
- Background overlay: `bg-black/50` behind the panel.
- Panel width: full screen width or `w-[90vw]`.
- Trigger: A dedicated toggle button (perhaps in the Navbar or a small floating icon specifically for mobile) is needed to open it, with a close (X) button in the panel header to close it.

### 4.2 Sidebar on Mobile

- Remains a collapsible drawer from the left (existing behavior).

---

## 5. Component Reuse Strategy

### Components to Reuse (from `src/components/chatbot/`)

| Component | Current Usage | New Usage |
|:---|:---|:---|
| `ChatInput.jsx` | Chatbot page input | AI Panel input (minor width adjustments) |
| `ChatHeader.jsx` | Chatbot page header | AI Panel header (title change) |

### Components to Remove or Deprecate

| Component | Reason |
|:---|:---|
| `ChatSidebar.jsx` | No longer needed — chat history sidebar is not part of the panel |
| `InsightPanel.jsx` | No longer needed — the panel itself replaces the insight sidebar |
| `PromptChips.jsx` | Already deprecated in previous sprint |
| `FloatingChatButton.jsx` | ❌ **Completely removed**, replaced by border-toggle |
| `src/pages/Chatbot.jsx` | ❌ **Completely removed**, replaced by integrated panel |

### Components to Modify

| Component | Change |
|:---|:---|
| `DashboardLayout.jsx` | Add AI panel as a flex sibling alongside the main content `<Outlet>`, implement resizable border logic |
| `Dashboard.jsx` | Adjust CSS Grid layout to fit nicely alongside the open/resized AI panel |
| `Sidebar.jsx` | Replace "Chatbot" NavLink with "Market Insight" NavLink pointing to `/market-insight` |

### New Components / Pages

| File | Purpose |
|:---|:---|
| `src/pages/MarketInsight.jsx` | New page for macro-level market overview |
| `src/components/AIChatPanel.jsx` | New integrated AI panel component |

---

## 6. Route Changes

| Before | After |
|:---|:---|
| `/chatbot` → `Chatbot.jsx` (full page) | ❌ Removed |
| — | `/market-insight` → `MarketInsight.jsx` (new page) |
| `/dashboard` → `Dashboard.jsx` | `/dashboard` → `Dashboard.jsx` (unchanged, but layout now includes AI panel) |

---

## 7. Design Compliance

All new and modified components MUST follow the Cold Surgical design system:

- ✅ Sharp geometry (0px corners) on all non-button elements
- ✅ Pill buttons only (`rounded-full`)
- ✅ Typography trinity: Outfit (display), Source Serif 4 (body), JetBrains Mono (UI/data)
- ✅ No shadows, no glows, no gradients on cards
- ✅ `border-card-border` for panel borders
- ✅ `bg-surface` or `bg-bg-dark` for panel backgrounds
- ✅ No `font-bold` or `font-extrabold`
- ✅ All text-labels in `font-mono` with `tracking-[2px]` and `uppercase`
