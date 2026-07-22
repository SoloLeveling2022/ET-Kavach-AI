# Kavach-AI Development Guide

Complete development workflow and contributing guidelines for Kavach-AI.

## Development Environment Setup

### Prerequisites

- **Node.js**: 18.17+ (LTS recommended)
- **Package Manager**: pnpm 10+
- **Git**: 2.30+
- **Code Editor**: VS Code with TypeScript support
- **Browser**: Modern browser with DevTools (Chrome/Firefox recommended)

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/yourorg/kavach-ai.git
cd kavach-ai

# 2. Install dependencies
pnpm install

# 3. Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_BASE=ws://localhost:8080/api/v1
NODE_ENV=development
EOF

# 4. Start dev server
pnpm dev

# 5. Open http://localhost:3000 (auto-redirects to /dashboard)
```

## Project Structure

```
kavach-ai/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout + dark theme
│   ├── page.tsx                 # Home redirect
│   ├── globals.css              # Design tokens + animations
│   └── dashboard/               # Dashboard route
│       ├── layout.tsx           # SessionProvider wrapper
│       └── page.tsx             # Main dashboard
│
├── components/                   # React components
│   ├── DashboardLayout.tsx      # Grid container (6-panel)
│   ├── SessionHeader.tsx        # Top bar
│   ├── ThreatGauge.tsx          # Canvas gauge
│   ├── AudioVisualizer.tsx      # Canvas oscilloscope
│   ├── LivenessMonitor.tsx      # WebRTC video
│   ├── MoneyFlowGraph.tsx       # SVG graph
│   ├── GISMap.tsx               # Canvas heatmap
│   ├── ForensicDocket.tsx       # Certificate viewer
│   ├── ErrorBoundary.tsx        # Error wrapper
│   └── ui/                      # shadcn components
│
├── context/                      # React Context
│   └── SessionContext.tsx       # Global session state
│
├── hooks/                        # Custom React hooks
│   ├── useThreatPolling.ts     # REST polling
│   ├── useWebSocket.ts         # WebSocket management
│   ├── useMediaStream.ts       # Audio/camera capture
│   ├── useGyroSensor.ts        # Gyroscope listener
│   └── useThemeColors.ts       # Dynamic colors
│
├── lib/                          # Utilities & helpers
│   ├── api.ts                   # REST client
│   ├── websocket.ts             # WebSocket manager
│   ├── audio.ts                 # Audio DSP
│   ├── colors.ts                # Color interpolation
│   ├── types.ts                 # TypeScript interfaces
│   └── constants.ts             # Configuration
│
├── public/                       # Static assets
├── README.md                     # Main documentation
├── DEPLOYMENT.md                 # Deployment guide
├── IMPLEMENTATION_SUMMARY.md     # Project summary
├── DEVELOPMENT.md                # This file
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── next.config.mjs               # Next.js config
```

## Development Workflow

### 1. Creating a New Component

```bash
# Create component file
touch components/MyComponent.tsx

# Structure
'use client';

import React from 'react';

interface MyComponentProps {
  data?: any;
}

export function MyComponent({ data }: MyComponentProps) {
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  );
}
```

### 2. Creating a Custom Hook

```bash
# Create hook file
touch hooks/useMyHook.ts

# Structure
'use client';

import { useEffect, useState } from 'react';

export function useMyHook() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Hook logic
  }, []);

  return { state };
}
```

### 3. Adding a New Utility

```bash
# Create utility file
touch lib/myUtility.ts

# Structure
/**
 * Utility description
 */
export function myFunction(input: string): string {
  // Implementation
  return input;
}
```

### 4. Styling Guidelines

**Use Tailwind CSS classes** (not inline styles):

```tsx
// ✅ Good
<div className="bg-[hsl(220,14%,16%)] rounded-lg border border-[hsl(220,10%,25%)] p-4">
  Content
</div>

// ❌ Avoid
<div style={{ backgroundColor: 'hsl(220, 14%, 16%)', ...}}>
  Content
</div>
```

**Color Usage**:

```tsx
// ✅ Use design tokens via CSS variables
className="bg-[hsl(220,14%,16%)] text-[hsl(0,0%,95%)]"

// Use dynamic colors via utility functions
const threatColor = getThreatColor(threatIndex);
ctx.strokeStyle = threatColor;
```

**Responsive Design**:

```tsx
// Mobile-first approach with Tailwind
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

## Code Standards

### TypeScript

```tsx
// Always use strict mode
// ✅ Type all props
interface ComponentProps {
  data: string;
  onUpdate?: (data: string) => void;
}

// ✅ Type hook returns
function useMyHook(): { value: string; loading: boolean } {
  return { value: '', loading: false };
}

// ✅ Use interfaces for objects (not type)
interface User {
  id: string;
  name: string;
}

// ✅ Use generics for reusable code
function createFactory<T>(item: T): T[] {
  return [item];
}
```

### React Patterns

```tsx
// ✅ Use functional components
export function MyComponent() {
  return <div>Content</div>;
}

// ✅ Use hooks for side effects
useEffect(() => {
  // Effect code
}, [dependency]);

// ✅ Use context for global state
const value = useContext(MyContext);

// ❌ Avoid class components
// ❌ Avoid useState for single values (use hooks)
```

### Error Handling

```tsx
// ✅ Async/await with try-catch
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('[MyComponent] Error:', error);
    throw new Error('Failed to fetch data');
  }
}

// ✅ Log with component prefix
console.log('[ComponentName] Message');
console.error('[ComponentName] Error:', error);
```

## Testing

### Unit Tests (Recommended)

```bash
# Install test dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# Create test file
touch lib/colors.test.ts
```

```typescript
import { describe, it, expect } from 'vitest';
import { getThreatColor } from './colors';

describe('getThreatColor', () => {
  it('returns teal for safe threat', () => {
    const color = getThreatColor(0.2);
    expect(color).toContain('hsl');
  });
});
```

### Integration Tests

```bash
# Use existing SessionContext + hooks
pnpm add -D @testing-library/user-event

# Test component with providers
import { SessionProvider } from '@/context/SessionContext';
import { render, screen } from '@testing-library/react';

describe('DashboardPage', () => {
  it('renders with SessionProvider', () => {
    render(
      <SessionProvider>
        <DashboardPage />
      </SessionProvider>
    );
    expect(screen.getByText('KAVACH-AI')).toBeInTheDocument();
  });
});
```

### E2E Tests

```bash
# Install Playwright
pnpm add -D @playwright/test

# Create test
touch tests/dashboard.spec.ts
```

```typescript
import { test, expect } from '@playwright/test';

test('dashboard loads and displays threat gauge', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveTitle('Kavach-AI');
  await expect(page.getByText('THREAT GAUGE')).toBeVisible();
});
```

## Debugging

### Browser DevTools

1. **Open DevTools**: F12 or Cmd+Option+I
2. **Network Tab**: Monitor API calls + WebSocket frames
3. **Console Tab**: Check for errors (search for `[v0]` logs)
4. **Performance Tab**: Profile canvas rendering
5. **React DevTools**: Inspect component tree + state

### Common Issues

**WebSocket Connection Fails**
```javascript
// Check in console
console.log(new WebSocket('ws://localhost:8080/api/v1/stream/audio'));
// Should log: WebSocket {readyState: 0, ...}
```

**Audio Permission Denied**
```javascript
// Check permission in console
navigator.permissions.query({ name: 'microphone' })
  .then(result => console.log(result.state));
// Should log: 'granted', 'denied', or 'prompt'
```

**Canvas Rendering Issues**
```javascript
// Check device pixel ratio
console.log(window.devicePixelRatio);
// If > 1, canvas may need scaling adjustment
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build --profile

# Output shows chunk breakdown
# Look for: .next/static/chunks/
```

### Canvas Performance

```typescript
// Use device pixel ratio
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);

// Use requestAnimationFrame
let frameId = requestAnimationFrame(render);

// Throttle updates
let lastUpdateTime = Date.now();
if (Date.now() - lastUpdateTime > 16) { // 60fps
  // Update
  lastUpdateTime = Date.now();
}
```

### Memory Leaks

```typescript
// Always cleanup
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);

// Avoid creating functions in loops
const handlers = items.map(item => ({
  id: item.id,
  onClick: () => handleClick(item) // Creates new function!
}));

// Better: Use event delegation
<ul onClick={(e) => handleClick(e.currentTarget.dataset.id)} />
```

## Git Workflow

### Branch Naming

```bash
# Feature
git checkout -b feature/threat-gauge-animation

# Bug fix
git checkout -b fix/websocket-reconnect

# Docs
git checkout -b docs/api-integration

# Chore
git checkout -b chore/update-dependencies
```

### Commit Messages

```bash
# ✅ Good commit messages
git commit -m "feat: add smooth threat gauge interpolation"
git commit -m "fix: prevent WebSocket reconnect loop"
git commit -m "docs: add API integration guide"

# ❌ Avoid
git commit -m "update"
git commit -m "fixes"
```

### Pull Request Process

1. Create feature branch
2. Make changes (small, focused commits)
3. Test locally (`pnpm dev`, browser testing)
4. Push to GitHub
5. Create PR with description
6. Request review
7. Address feedback
8. Merge when approved

## Useful Commands

```bash
# Development
pnpm dev                  # Start dev server
pnpm build                # Build for production
pnpm start                # Run production build
pnpm lint                 # Run ESLint

# Testing
pnpm test                 # Run unit tests
pnpm test:watch           # Watch mode
pnpm test:coverage        # Coverage report

# Code Quality
pnpm format               # Format with Prettier
pnpm type-check           # TypeScript check

# Dependencies
pnpm add <package>        # Add dependency
pnpm add -D <package>     # Add dev dependency
pnpm remove <package>     # Remove dependency
pnpm update               # Update dependencies
pnpm audit                # Security audit

# Git
git status                # Check status
git diff                  # View changes
git log --oneline         # View commit history
git reset --hard          # Discard changes
```

## Troubleshooting

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install

# Try again
pnpm build
```

### Dev Server Hangs

```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Restart
pnpm dev
```

### TypeScript Errors

```bash
# Type check
pnpm tsc --noEmit

# Fix errors in tsconfig.json if needed
```

### WebSocket Connection Issues

```bash
# Ensure backend is running
curl -i http://localhost:8080/api/v1/session/init

# Check WebSocket availability
wscat -c ws://localhost:8080/api/v1/stream/audio
```

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] TypeScript strict mode (no `any`)
- [ ] All props/hooks typed
- [ ] No console.log (except `console.log('[ComponentName] ...)`)
- [ ] Proper error handling (try-catch or .catch())
- [ ] Tests added for new functions
- [ ] Component stories if UI component
- [ ] Documentation updated (README/comments)
- [ ] No commented-out code
- [ ] CSS classes preferred over inline styles
- [ ] Mobile-friendly layout
- [ ] Accessibility (ARIA labels, semantic HTML)
- [ ] Performance considered (no unnecessary re-renders)
- [ ] Git history clean (squash trivial commits)

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes following code standards
4. Add tests
5. Update documentation
6. Submit PR
7. Address review feedback

## Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## Support

For development questions:
- Check existing documentation
- Search GitHub issues
- Create new issue with details
- Ask in team Slack

---

**Happy Coding!** 🚀  
*Last Updated: July 2026*
