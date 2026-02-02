# Dual-Repo Migration Coordination Strategy

This document outlines the workflow for coordinating component migrations between `skai-ui` and `skai-interface`.

## Overview

When migrating components from `skai-interface` to `skai-ui`, both repositories need coordinated changes:

1. **skai-ui**: Add the pure UI component
2. **skai-interface**: Update imports to use `@skai/ui`

## Workflow

### Phase 1: Planning

```bash
# 1. Identify components to migrate
cd skai-interface
find src/components/{domain}/ -name "*.tsx" -type f

# 2. Analyze dependencies
grep -r "useAuth\|useWallet\|useTrading" src/components/{domain}/

# 3. Create coordinated branches
# In skai-ui:
git checkout -b feature/add-{domain}-components

# In skai-interface:
git checkout -b feature/migrate-{domain}-to-skai-ui
```

### Phase 2: Development

#### In skai-ui

```bash
# 1. Create component (extract pure UI)
# Move from: skai-interface/src/components/{domain}/Component.tsx
# To: skai-ui/src/components/{category}/component.tsx

# 2. Update imports to use ../../lib/utils pattern
sed -i 's|from "../lib/utils"|from "../../lib/utils"|g' component.tsx

# 3. Add to category index
echo 'export * from "./component";' >> src/components/{category}/index.ts

# 4. Create stories
touch src/components/{category}/component.stories.tsx

# 5. Build and test
npm run build:quiet
npm run test
```

#### In skai-interface

```bash
# 1. Update component imports
# From: import { Component } from "@/components/{domain}/Component"
# To: import { Component } from "@skai/ui"

# 2. Pass business logic as props
# Before: Component uses internal hooks
# After: Component receives data via props

# 3. Delete old component file
rm src/components/{domain}/Component.tsx

# 4. Test integration
npm run build
npm run test
```

### Phase 3: Review & Merge

#### Merge Sequence (Critical!)

```
1. Create skai-ui PR first
   ↓
2. Review and approve skai-ui PR
   ↓
3. MERGE skai-ui PR ← Components now available
   ↓
4. Update submodule in skai-interface branch:
   git submodule update --remote modules/skai-ui
   git add modules/skai-ui
   git commit -m "Update skai-ui submodule"
   ↓
5. Create skai-interface PR (references skai-ui PR)
   ↓
6. Review and merge skai-interface PR
```

## PR Linking

### skai-ui PR Description

```markdown
## 🔄 Component Migration

**Domain**: Trading

**Components Added**:
- `src/components/trading/trader-card.tsx`
- `src/components/trading/position-display.tsx`

**Related skai-interface PR**: SKAI-Trading/skai-interface#123

**Merge this PR first**, then merge the skai-interface PR.
```

### skai-interface PR Description

```markdown
## 🔄 Component Migration

**Domain**: Trading

**Depends on**: SKAI-Trading/skai-ui#456 (must be merged first)

**Changes**:
- Updated imports to use `@skai/ui`
- Removed local component files
- Added prop passing for business logic

**Submodule Update Needed**: Yes
```

## Domain Migration Schedule

| Week | Domain | Est. Components | skai-ui Category |
|------|--------|-----------------|------------------|
| 1 | Trading | ~80 | trading/ |
| 2 | Gaming | ~60 | gaming/ (new) |
| 3 | DeFi | ~40 | defi/ (new) |
| 4 | Account | ~100 | account/ (new) |
| 5 | Remaining | ~208 | various |

## Component Extraction Pattern

### Before (in skai-interface)
```tsx
// Mixed UI + business logic
function TraderCard({ traderId }: { traderId: string }) {
  const { trader, isFollowing } = useTrader(traderId);
  const { follow, unfollow } = useFollowActions();

  return (
    <Card>
      <Avatar src={trader.avatar} />
      <h3>{trader.name}</h3>
      <Button onClick={() => isFollowing ? unfollow() : follow()}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </Card>
  );
}
```

### After (in skai-ui)
```tsx
// Pure UI component
export interface TraderCardProps {
  trader: {
    name: string;
    avatar: string;
  };
  isFollowing: boolean;
  onFollowToggle: () => void;
}

export function TraderCard({
  trader,
  isFollowing,
  onFollowToggle
}: TraderCardProps) {
  return (
    <Card>
      <Avatar src={trader.avatar} />
      <h3>{trader.name}</h3>
      <Button onClick={onFollowToggle}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </Card>
  );
}
```

### After (in skai-interface)
```tsx
// Wrapper with business logic
import { TraderCard } from "@skai/ui";

function TraderCardContainer({ traderId }: { traderId: string }) {
  const { trader, isFollowing } = useTrader(traderId);
  const { follow, unfollow } = useFollowActions();

  return (
    <TraderCard
      trader={trader}
      isFollowing={isFollowing}
      onFollowToggle={() => isFollowing ? unfollow() : follow()}
    />
  );
}
```

## Troubleshooting

### Build Errors After Migration

```bash
# 1. Ensure skai-ui is built
cd modules/skai-ui && npm run build:quiet

# 2. Reinstall dependencies
cd ../../ && npm install

# 3. Clear TypeScript cache
rm -rf node_modules/.cache
npm run typecheck
```

### Import Resolution Issues

```bash
# Check tsconfig paths
cat tsconfig.json | grep -A5 "paths"

# Ensure @skai/ui resolves correctly
# Should point to: "./modules/skai-ui"
```

### Submodule Out of Sync

```bash
# Update submodule to latest
git submodule update --remote modules/skai-ui

# Or reset to specific commit
cd modules/skai-ui
git checkout {commit-hash}
cd ../..
git add modules/skai-ui
```

## Success Criteria

- [ ] Zero broken builds during migration
- [ ] All tests pass in both repos
- [ ] No functionality regression
- [ ] TypeScript compiles without errors
- [ ] Storybook renders all components
- [ ] Clear prop interfaces documented
