# @skai/ui

SKAI Trading UI Component Library - A modern, accessible, and themeable React component library built with Tailwind CSS.

## 🎨 For Design Teams

This repository is specifically designed for UI/UX teams to collaborate on SKAI's design system without touching core application logic. You can:

- **Create and modify components** in `src/components/`
- **Preview changes in Storybook** - An interactive component playground
- **Define design tokens** in `tailwind.config.ts` and `src/styles/`
- **Write documentation** alongside components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/SKAI-Trading/skai-ui.git
cd skai-ui

# Install dependencies
npm install

# Start Storybook development server
npm run dev
```

Open [http://localhost:6006](http://localhost:6006) to view Storybook.

## 📦 Available Components

| Component | Description                | Variants                                                                   |
| --------- | -------------------------- | -------------------------------------------------------------------------- |
| `Button`  | Interactive button element | default, secondary, destructive, outline, ghost, link, gradient, glow      |
| `Card`    | Container for content      | default, elevated, outline, ghost, gradient, glow                          |
| `Input`   | Text input field           | default, error, success, ghost                                             |
| `Badge`   | Status indicators          | default, secondary, destructive, outline, success, warning, info, gradient |

## 🎨 Design Tokens

### Colors

Our color palette is defined in `tailwind.config.ts`:

```typescript
colors: {
  'skai-primary': '#6366f1',    // Indigo - Primary brand color
  'skai-secondary': '#8b5cf6',  // Purple - Secondary actions
  'skai-accent': '#06b6d4',     // Cyan - Highlights
  'skai-success': '#22c55e',    // Green - Success states
  'skai-warning': '#f59e0b',    // Amber - Warnings
  'skai-error': '#ef4444',      // Red - Errors
}
```

### Animations

Custom animations available:

- `animate-pulse-glow` - Subtle glow pulse effect
- `animate-fade-in` - Fade in entrance
- `animate-slide-in` - Slide in from bottom

## 🛠️ Development Workflow

### Creating a New Component

1. Create a folder in `src/components/YourComponent/`
2. Add these files:
   - `YourComponent.tsx` - Main component
   - `index.ts` - Exports
   - `YourComponent.stories.tsx` - Storybook stories

3. Export from `src/index.ts`

### Example Component Structure

```
src/components/YourComponent/
├── YourComponent.tsx       # Component implementation
├── YourComponent.stories.tsx # Storybook stories
└── index.ts               # Exports
```

### Running Tests

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
```

### Building

```bash
npm run build       # Build for production
```

Output will be in `dist/` with:

- `index.js` - CommonJS bundle
- `index.mjs` - ES Module bundle
- `index.d.ts` - TypeScript declarations
- `styles.css` - Compiled CSS

## 📚 Using in Applications

### Installation

```bash
npm install @skai/ui
```

### Setup

1. Import styles in your app's main CSS:

```css
@import "@skai/ui/dist/styles.css";
```

2. Import and use components:

```tsx
import { Button, Card, Input, Badge } from "@skai/ui";

function App() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your name" />
        <Button variant="gradient">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## 🤝 Contributing

### For Design Team Members

1. **Branch naming**: `design/your-feature-name`
2. **Commit messages**: `feat(component): description` or `fix(component): description`
3. **Always test in Storybook** before committing
4. **Update stories** when modifying components

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test in Storybook
4. Submit a PR with screenshots if visual changes

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details.

## 🔗 Related

- [SKAI Trading App](https://github.com/SKAI-Trading/skai-trading)
- [Figma Design System](link-to-figma) _(coming soon)_
