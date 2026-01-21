# Theming System - Quick Start

## What You Can Do Now

### On the Landing Page
1. **Top-Right**: See the theme toggle and dark mode button
2. **Click Moon/Sun Icon**: Switch between light and dark mode instantly
3. **Click Theme Label**: Opens full settings (or click SETTINGS button)
4. **Theme Grid**: Select from 11 beautiful themes
5. **Dark Mode Toggle**: Full button in settings menu

### Themes Available
- **LOUD** - Bright, bold, high contrast
- **SONGWRITER** - Muted, writer-friendly
- **YACHT ROCK** - Ocean vibes, summery
- **RAGTIME** - Vintage, nostalgic
- **BUBBLEGUM** - Pink, playful, fun
- **COFFEESHOP** - Warm, cozy, earthy
- **PURPLEHAZE** - Purple, modern, elegant
- **SYNTHWAVE** - Neon, retro, cyberpunk
- **OLYMPIA** - Clean, minimal, modern
- **DOOM** - Aggressive, intense
- **CHRONIC** - Gaming, intense

### Automatic Saving
- Your theme choice is saved to browser storage
- Dark mode preference is saved
- Next visit loads your saved choices automatically

## For Developers

### To Apply Theming to More Pages:
1. Use CSS variables instead of hardcoded colors:
   ```jsx
   // Instead of: style={{ color: '#818cf8' }}
   // Use: style={{ color: 'var(--primary)' }}
   ```

2. The `useTheme` hook is available globally:
   ```jsx
   import { useTheme } from './hooks/useTheme';
   
   function MyComponent() {
     const { isDarkMode, currentTheme } = useTheme();
     // Component automatically responds to theme changes
   }
   ```

3. All Tailwind classes work with themes:
   ```jsx
   <button className="text-primary border-primary hover:bg-primary/20">
     Themed Button
   </button>
   ```

### CSS Variables Reference
- `var(--primary)` - Main brand color
- `var(--secondary)` - Secondary accent
- `var(--background)` - Page background
- `var(--foreground)` - Text color
- `var(--card)` - Card backgrounds
- `var(--accent)` - Highlight color
- `var(--muted)` - Disabled/muted colors
- `var(--destructive)` - Error colors

## Implementation Details

### Files Created
- `src/hooks/useTheme.js` - Theme management hook
- `THEMING_SYSTEM_COMPLETE.md` - Full documentation
- `THEMING_USAGE_GUIDE.md` - Developer guide

### Files Modified
- `src/styles.css` - Added 11 theme definitions
- `src/pages/LandingPage.jsx` - Added theme/dark mode controls
- `src/App.jsx` - Initialize theme system
- `src/hooks/index.js` - Export useTheme hook

### Build Status
✅ All systems working
✅ 1749 modules
✅ 0 errors, 0 warnings
✅ Dev server running on http://localhost:5173/gigmaster/

## Next Steps

1. **Apply to GamePage**: Convert hardcoded colors to CSS variables
2. **Apply to ScenarioSelection**: Use theme colors
3. **Apply to BandCreation**: Style with theme
4. **Add Custom Themes**: Create user-defined themes if desired
5. **Theme Animations**: Use transitions for smoother changes

## How It Works (Technical)

```
User selects theme → useTheme hook updates state
                  → Applies class to <html>: .theme-synthwave
                  → CSS cascade applies variables
                  → All var(--color) elements update
                  → localStorage saves choice
                  → Next visit loads saved theme
```

## Customizing Themes

To add a new theme, add to `src/styles.css`:

```css
.theme-mytheme:root {
  --primary: hsl(0 100% 50%);
  --secondary: hsl(120 100% 50%);
  --background: hsl(0 0% 95%);
  /* ... other variables ... */
}

.theme-mytheme.dark {
  --primary: hsl(0 100% 60%);
  --secondary: hsl(120 100% 60%);
  --background: hsl(0 0% 10%);
  /* ... other variables ... */
}
```

Then add to `useTheme.js` THEMES and THEME_NAMES objects.

## Support

For questions or issues:
1. Check `THEMING_USAGE_GUIDE.md` for implementation patterns
2. Look at `src/pages/LandingPage.jsx` for working example
3. Reference `src/hooks/useTheme.js` for hook API

Enjoy your fully themed GIGMASTER game! 🎸✨
