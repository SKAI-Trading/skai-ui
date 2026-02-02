---
name: 🔄 Component Migration
about: Track migration of components from skai-interface to skai-ui
title: '[Migration] {Domain}: Migrate {Component(s)}'
labels: migration
assignees: ''
---

## Migration Domain
<!-- Select one: Trading / Gaming / DeFi / Account / Social / Analytics / Common -->

## Components to Migrate

### From skai-interface
<!-- List source paths -->
```
src/components/{domain}/ComponentA.tsx
src/components/{domain}/ComponentB.tsx
```

### To skai-ui
<!-- List target paths -->
```
src/components/{category}/component-a.tsx
src/components/{category}/component-b.tsx
```

## Component Analysis

### Business Logic to Extract
<!-- List any hooks, contexts, or business logic that needs to stay in skai-interface -->
- [ ] `useXxx` hook usage
- [ ] Context dependencies
- [ ] API calls

### Props Interface
<!-- Document the props that will be passed from skai-interface -->
```typescript
interface ComponentProps {
  // Define pure UI props
}
```

## Migration Checklist

### skai-ui Tasks
- [ ] Create component file(s)
- [ ] Extract pure UI (no business logic)
- [ ] Add to category index.ts
- [ ] Create Storybook stories
- [ ] Add tests
- [ ] Update main exports

### skai-interface Tasks
- [ ] Update imports to `@skai/ui`
- [ ] Pass business logic as props
- [ ] Remove old component file(s)
- [ ] Test functionality preserved

## Related PRs
- skai-ui: #
- skai-interface: SKAI-Trading/skai-interface#

## Notes
<!-- Any special considerations for this migration -->
