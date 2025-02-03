# Next UI Full Calendar - Project Structure and Styling Guide

## Project Overview
This project is built using Next.js and incorporates a sophisticated styling system that combines NextUI, Tailwind CSS, and CSS variables for theming.

## Directory Structure

```
├── app/                  # Next.js app directory (App Router)
├── components/          # React components
│   ├── custom components examples/
│   ├── schedule/       # Calendar-related components
│   ├── ui/            # UI components
│   ├── navbar.tsx
│   ├── theme-switch.tsx
│   └── icons.tsx
├── styles/             # Global styles
│   └── globals.css
├── providers/          # React context providers
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

## Styling Architecture

### 1. Core Technologies
- **Tailwind CSS**: Used as the primary styling framework
- **NextUI**: Provides pre-built components and theming capabilities
- **CSS Variables**: Used for dynamic theming and color management

### 2. Theme Configuration
The project uses a sophisticated theming system defined in `tailwind.config.js` that includes:
- Custom font families
- Responsive border radius system
- Extensive color palette with light/dark mode support
- Integration with NextUI components

### 3. Color System
Colors are managed through CSS variables in `globals.css`, providing:
- Base colors for light/dark modes
- Semantic color tokens (primary, secondary, accent, etc.)
- Chart-specific colors
- Consistent color application across components

### 4. Key Style Features
- **Dark Mode Support**: Built-in dark mode with theme switching capability
- **CSS Variables**: Used for dynamic theming and consistent styling
- **Custom Animations**: Includes custom animations like `automation-zoom-in`
- **Responsive Design**: Built-in responsive utilities from Tailwind CSS

### 5. Component Styling
Components can be styled using:
- Tailwind utility classes
- NextUI component props
- CSS modules (when needed)
- Custom CSS classes defined in `globals.css`

### 6. Theme Variables
Key theme variables include:
- Background/Foreground colors
- Card styles
- Popover styles
- Primary/Secondary colors
- Accent colors
- Border radius
- Font families

## Best Practices
1. Use Tailwind utility classes as the primary styling method
2. Leverage NextUI components for consistent UI elements
3. Use CSS variables for dynamic values that need to change with theme
4. Keep custom CSS to a minimum, prefer Tailwind utilities
5. Use semantic color tokens instead of hard-coded values

## Theme Customization
To customize the theme:
1. Modify `tailwind.config.js` for Tailwind-specific customizations
2. Update CSS variables in `globals.css` for color schemes
3. Use the NextUI theme configuration for component-specific styling
