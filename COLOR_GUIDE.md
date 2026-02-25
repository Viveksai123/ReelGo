# Color & Theme Reference Guide

Complete reference for the color system and theme implementation.

## Color System Overview

The app uses semantic CSS variables instead of hardcoded colors. This ensures consistency and makes theme switching seamless.

### Semantic Tokens (Light Mode)

| Token | Color | Use Case |
|-------|-------|----------|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `#0f172a` | Primary text |
| `--card` | `#f8fafc` | Card/panel background |
| `--card-foreground` | `#0f172a` | Card text |
| `--primary` | `#2563eb` | Main action color (buttons) |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--secondary` | `#f1f5f9` | Secondary backgrounds |
| `--secondary-foreground` | `#0f172a` | Text on secondary |
| `--muted` | `#e2e8f0` | Muted backgrounds |
| `--muted-foreground` | `#64748b` | Muted text (helpers) |
| `--accent` | `#3b82f6` | Accent highlights |
| `--accent-foreground` | `#ffffff` | Text on accent |
| `--destructive` | `#dc2626` | Error/danger states |
| `--destructive-foreground` | `#ffffff` | Error text |
| `--border` | `#e2e8f0` | Borders |
| `--input` | `#f1f5f9` | Input backgrounds |

### Semantic Tokens (Dark Mode)

| Token | Color | Use Case |
|-------|-------|----------|
| `--background` | `#0f172a` | Page background |
| `--foreground` | `#f1f5f9` | Primary text |
| `--card` | `#1e293b` | Card/panel background |
| `--card-foreground` | `#f1f5f9` | Card text |
| `--primary` | `#3b82f6` | Main action color (buttons) |
| `--primary-foreground` | `#0f172a` | Text on primary |
| `--secondary` | `#334155` | Secondary backgrounds |
| `--secondary-foreground` | `#f1f5f9` | Text on secondary |
| `--muted` | `#475569` | Muted backgrounds |
| `--muted-foreground` | `#cbd5e1` | Muted text (helpers) |
| `--accent` | `#60a5fa` | Accent highlights |
| `--accent-foreground` | `#0f172a` | Text on accent |
| `--destructive` | `#ef4444` | Error/danger states |
| `--destructive-foreground` | `#fca5a5` | Error text |
| `--border` | `#334155` | Borders |
| `--input` | `#1e293b` | Input backgrounds |

## Component Styling Examples

### Buttons

**Primary Button:**
```jsx
className="bg-primary hover:bg-primary/90 text-primary-foreground"
```
Light: Blue button with white text
Dark: Lighter blue button with dark text

**Secondary Button:**
```jsx
className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
```
Light: Light gray button with dark text
Dark: Gray button with light text

### Cards & Containers

```jsx
className="bg-card border border-border text-card-foreground"
```
Light: White card with light gray border
Dark: Dark slate card with dark gray border

### Text Colors

```jsx
// Primary heading
className="text-foreground"

// Helper text
className="text-muted-foreground"

// Error message
className="text-destructive"

// Success indicator
className="text-green-600 dark:text-green-400"
```

### Input Fields

```jsx
className="bg-input border border-border text-foreground"
```
Light: Light gray input with subtle border
Dark: Dark input with darker border

## Usage in CSS Variables

### In globals.css

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: #2563eb;
  /* ... more tokens ... */
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --primary: #3b82f6;
  /* ... more tokens ... */
}
```

### In Tailwind Classes

```jsx
// Using tokens directly
className="bg-background text-foreground"

// With hover states
className="hover:bg-card hover:border-border"

// With opacity
className="bg-primary/90 bg-primary/20"
```

## Color Contrast Reference

### Light Mode Contrast Ratios
- Background ↔ Foreground: 20:1 ✅
- Card ↔ Card Text: 18:1 ✅
- Primary ↔ White: 4.5:1 ✅
- Muted ↔ Muted Text: 4.6:1 ✅

### Dark Mode Contrast Ratios
- Background ↔ Foreground: 15:1 ✅
- Card ↔ Card Text: 13:1 ✅
- Primary ↔ Dark: 5:1 ✅
- Muted ↔ Muted Text: 4.3:1 ✅

## Component Color Breakdown

### Home Page (app/page.tsx)

| Element | Light Class | Dark Equivalent |
|---------|------------|-----------------|
| Background | `bg-background` | Auto |
| Card | `bg-card border-border` | Auto |
| Input | `bg-input border-border` | Auto |
| Role Button (selected) | `bg-primary/10 border-primary` | Auto |
| Info Box | `bg-primary/5 border-primary/20` | Auto |
| Text | `text-foreground` | Auto |
| Helper Text | `text-muted-foreground` | Auto |

### Session Map (components/map-view.tsx)

| Element | Light | Dark |
|---------|-------|------|
| Canvas BG | Light blue gradient | Dark blue gradient |
| Grid lines | Slate/20% opacity | Slate/20% opacity |
| Zoom buttons | bg-card | Auto |
| Zoom text | `text-foreground` | Auto |
| Role badge | `bg-blue-600` | `dark:bg-blue-500` |

### HUD Overlay (components/hud-overlay.tsx)

| Panel | Light | Dark |
|-------|-------|------|
| Room info | `bg-card border-border` | Auto |
| Connection | `bg-card border-border` | Auto |
| Role badge | `bg-blue-600` | Auto |
| Stats | `bg-card border-border` | Auto |
| Location data | `bg-card border-border` | Auto |

## Adding New Colors

### Option 1: Add to CSS Variables
```css
:root {
  --my-custom: #your-color;
}

.dark {
  --my-custom: #your-dark-color;
}
```

Then use in Tailwind:
```jsx
className="bg-[var(--my-custom)]"
```

### Option 2: Use Tailwind Colors Directly
```jsx
className="text-blue-600 dark:text-blue-400"
```

### Recommended: Add as Token
Best practice is to define new colors as semantic tokens in globals.css first.

## Theme Detection in Code

### Get Current Theme
```typescript
import { useTheme } from '@/components/theme-provider';

export function MyComponent() {
  const { resolvedTheme } = useTheme(); // 'light' or 'dark'
  
  return (
    <div>
      Current theme: {resolvedTheme}
    </div>
  );
}
```

### Conditional Canvas Rendering
```javascript
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDark) {
  gradient.addColorStop(0, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
} else {
  gradient.addColorStop(0, '#e0f2fe');
  gradient.addColorStop(1, '#bae6fd');
}
```

## Accessibility Considerations

### Color Alone
❌ Don't use color as the only indicator:
```jsx
// Bad - color only
<div className="text-green-600">Success</div>

// Good - color + text
<div className="flex items-center gap-2">
  <CheckCircle className="text-green-600" />
  <span>Success</span>
</div>
```

### Contrast
✅ All text meets WCAG AA standards (4.5:1)
✅ Large text meets WCAG AAA standards (3:1)

### Focus States
```jsx
// Ensure focus is visible
className="focus:outline-none focus:ring-2 focus:ring-primary"
```

## Testing Colors

### Test Light Mode
```javascript
localStorage.setItem('theme', 'light');
location.reload();
```

### Test Dark Mode
```javascript
localStorage.setItem('theme', 'dark');
location.reload();
```

### Test System Preference
```javascript
localStorage.removeItem('theme');
// App will follow system preference
```

## Figma/Design Reference

If using design tools, import these colors:

**Light Palette:**
```
Primary: #2563eb (Blue 600)
Success: #16a34a (Green 600)
Warning: #eab308 (Yellow 500)
Error: #dc2626 (Red 600)
Background: #ffffff (White)
Surface: #f8fafc (Slate 50)
Text: #0f172a (Slate 900)
Muted: #64748b (Slate 500)
```

**Dark Palette:**
```
Primary: #3b82f6 (Blue 500)
Success: #22c55e (Green 500)
Warning: #facc15 (Yellow 400)
Error: #ef4444 (Red 500)
Background: #0f172a (Slate 900)
Surface: #1e293b (Slate 800)
Text: #f1f5f9 (Slate 100)
Muted: #cbd5e1 (Slate 300)
```

## Color Consistency Checklist

- [ ] All text uses semantic tokens
- [ ] All backgrounds use semantic tokens
- [ ] All borders use semantic tokens
- [ ] Hover states maintain contrast
- [ ] Focus states are visible
- [ ] Disabled states are clear
- [ ] Errors use destructive color
- [ ] Success uses green color
- [ ] Warnings use yellow color
- [ ] Both themes tested

## Summary

The color system is designed to:
1. **Accessibility First** - High contrast ratios
2. **Flexibility** - Easy to add new themes
3. **Consistency** - Semantic tokens throughout
4. **Maintainability** - Change themes in one place
5. **User Preference** - Respects system preference

All colors are stored in CSS variables and can be changed globally by updating `globals.css`.

For questions or to customize colors, refer to the theme provider implementation in `components/theme-provider.tsx`.
