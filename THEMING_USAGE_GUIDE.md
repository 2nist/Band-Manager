# Using the Theming System

## For Developers - Applying Themes to Components

### Using CSS Variables in Styles
Instead of hardcoded colors, always use CSS variables:

```jsx
// ❌ DON'T: Hardcoded colors
<div style={{ color: '#818cf8', backgroundColor: '#000000' }}>
  Content
</div>

// ✅ DO: Use CSS variables
<div style={{ color: 'var(--primary)', backgroundColor: 'var(--background)' }}>
  Content
</div>
```

### Common CSS Variable Replacements

| Hardcoded | Variable | Purpose |
|-----------|----------|---------|
| `#818cf8` | `var(--primary)` | Main brand color |
| `#2dd4bf` | `var(--secondary)` | Secondary accent |
| `#fcd34d` | `var(--accent)` | Highlight color |
| `#f87171` | `var(--destructive)` | Error/danger |
| Background dark color | `var(--background)` | Page background |
| White/light text | `var(--foreground)` | Main text color |
| Card/container bg | `var(--card)` | Card backgrounds |
| Disabled text | `var(--muted)` | Muted/disabled state |
| Border lines | `var(--border)` | Border colors |

### Tailwind Classes with Themes

Tailwind automatically uses CSS variables:

```jsx
// ✅ These automatically respond to theme
<div className="bg-background text-foreground">
  Content
</div>

<button className="text-primary hover:text-primary/80 border-primary">
  Click Me
</button>
```

### In Component Code

```jsx
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { isDarkMode, currentTheme, setTheme } = useTheme();
  
  return (
    <div className="p-6">
      <h1 style={{ color: 'var(--primary)' }}>
        Current Theme: {currentTheme}
      </h1>
      <p style={{ color: 'var(--muted)' }}>
        Dark Mode: {isDarkMode ? 'On' : 'Off'}
      </p>
    </div>
  );
}
```

## Theme Guidelines

### Color Usage Rules

**Primary Color** (`var(--primary)`)
- Main headers
- Important CTAs
- Brand elements
- Neon glows (dark mode)

**Secondary Color** (`var(--secondary)`)
- Secondary CTAs
- Accent elements
- Secondary glows
- Status indicators

**Accent Color** (`var(--accent)`)
- Highlights
- Special emphasis
- Premium elements
- UI focus states

**Destructive Color** (`var(--destructive)`)
- Error messages
- Delete buttons
- Warning states
- Danger indicators

**Muted Colors** (`var(--muted)`, `var(--muted-foreground)`)
- Disabled buttons
- Inactive states
- Secondary text
- Help text

### Text Color Hierarchy

```jsx
// Primary text
<p style={{ color: 'var(--foreground)' }}>Main content</p>

// Secondary text
<p style={{ color: 'var(--muted-foreground)' }}>Supporting info</p>

// Highlighted text
<p style={{ color: 'var(--primary)' }}>Important notice</p>
```

### Container Backgrounds

```jsx
// Page/main background
<div style={{ backgroundColor: 'var(--background)' }}>
  Main content area
</div>

// Cards/panels
<div style={{ backgroundColor: 'var(--card)' }}>
  Card content
</div>

// Muted/disabled backgrounds
<div style={{ backgroundColor: 'var(--muted)' }}>
  Disabled area
</div>
```

## Updating Components for Theming

### Step 1: Find Hardcoded Colors
Scan your component for colors like:
- `#818cf8`, `#2dd4bf` (old primary/secondary)
- `#000000`, `#ffffff` (black/white)
- `rgba(...)` with specific hex values

### Step 2: Replace with Variables
```jsx
// OLD
<button className="text-blue-500 border-blue-500">
  Click
</button>

// NEW
<button className="text-primary border-primary">
  Click
</button>
```

### Step 3: For Dynamic Styles
```jsx
// OLD
style={{ color: '#818cf8', backgroundColor: '#000000' }}

// NEW
style={{ color: 'var(--primary)', backgroundColor: 'var(--background)' }}
```

### Step 4: Test All Themes
After changes:
1. Open Settings on landing page
2. Test each theme (all 11)
3. Toggle light/dark mode for each
4. Verify colors look good

## Available Themes Reference

### Light-Biased Themes
- **LOUD** - Bright white background, bold red/yellow primaries
- **YACHTROCK** - Cream background, blue/teal primaries
- **RAGTIME** - Beige background, brown primaries
- **COFFEESHOP** - Off-white background, brown primaries
- **OLYMPIA** - Pure white, minimal styling

### Dark-Biased Themes
- **SONGWRITER** - Gray tones, minimal contrast
- **BUBBLEGUM** - Dark blue background, pink primaries
- **PURPLEHAZE** - Dark blue background, purple primaries
- **SYNTHWAVE** - Very dark background, neon magenta/cyan
- **DOOM** - Dark gray, aggressive red/green
- **CHRONIC** - Very dark, intense gaming colors

## CSS Variable Reference

### All Available Variables
```css
--background              /* Main background color */
--foreground              /* Main text color */
--card                    /* Card background color */
--card-foreground         /* Text on cards */
--primary                 /* Primary brand color */
--primary-foreground      /* Text on primary */
--secondary               /* Secondary accent color */
--secondary-foreground    /* Text on secondary */
--muted                   /* Muted background */
--muted-foreground        /* Muted text */
--accent                  /* Accent/highlight color */
--accent-foreground       /* Text on accent */
--destructive             /* Error/danger color */
--destructive-foreground  /* Text on destructive */
--border                  /* Border colors */
--input                   /* Input field colors */
--ring                    /* Focus ring color */

--font-sans               /* Default font family */
--font-serif              /* Serif font family */
--font-mono               /* Monospace font family */

--radius                  /* Border radius */
--shadow-*                /* Various shadow values */
```

## Testing Checklist

When adding themed components, verify:

- [ ] All text uses `var(--foreground)` or `var(--muted-foreground)`
- [ ] Primary CTAs use `var(--primary)`
- [ ] Secondary elements use `var(--secondary)`
- [ ] Disabled states use `var(--muted)`
- [ ] Error states use `var(--destructive)`
- [ ] Background uses `var(--background)`
- [ ] Cards use `var(--card)`
- [ ] All themes render correctly
- [ ] Light mode looks good
- [ ] Dark mode looks good
- [ ] Text is readable in all themes
- [ ] Contrast meets accessibility standards

## Common Patterns

### Themed Button
```jsx
<button
  className="px-4 py-2 rounded-lg border-2 font-bold transition-all"
  style={{
    borderColor: 'var(--primary)',
    color: 'var(--primary)',
    backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
  }}
>
  Click Me
</button>
```

### Themed Card
```jsx
<div
  className="p-6 rounded-lg border-2"
  style={{
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
    borderColor: 'var(--border)',
  }}
>
  Card content
</div>
```

### Themed Input
```jsx
<input
  className="px-4 py-2 rounded-lg border-2"
  style={{
    backgroundColor: 'var(--card)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  }}
/>
```

### Themed Text with Hierarchy
```jsx
<div>
  <h1 style={{ color: 'var(--primary)' }}>Main Title</h1>
  <p style={{ color: 'var(--foreground)' }}>Main content</p>
  <small style={{ color: 'var(--muted-foreground)' }}>Helper text</small>
</div>
```

## Performance Tips

1. **Minimize Dynamic Calculations**
   - Prefer Tailwind classes over inline styles
   - Group styles using className when possible

2. **Use CSS Variables Over Props**
   - CSS variables cascade automatically
   - No re-renders needed when theme changes
   - Smaller bundle size

3. **Avoid Theme Context in Components**
   - Theme is global, applied via CSS
   - Only use `useTheme()` hook when you need to access theme values
   - Most components should just use CSS variables

## Questions?

Refer to:
- `THEMING_SYSTEM_COMPLETE.md` - Full system documentation
- `src/hooks/useTheme.js` - Hook implementation
- `src/pages/LandingPage.jsx` - Example implementation
