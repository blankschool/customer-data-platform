

## Plan: Fix Build Errors

### Error 1 & 2: `variant` prop on `DropdownMenuItem`
The `DropdownMenuItem` component doesn't have a `variant` prop. Two files use `variant='destructive'`:
- `src/components/shadcn-studio/blocks/datatable-transaction.tsx` (line 280)
- `src/components/shadcn-studio/blocks/dropdown-profile.tsx` (line 70)

**Fix**: Add a `variant` prop to the `DropdownMenuItem` component in `src/components/ui/dropdown-menu.tsx` that supports `'default' | 'destructive'`, applying destructive styling (red text) when `variant='destructive'`.

### Error 3: CSS import TS2882
`src/main.tsx` line 3: `import './index.css'` triggers a type error for side-effect imports.

**Fix**: Add a `src/vite-env.d.ts` file declaring CSS modules so TypeScript recognizes `.css` imports.

### User Request: Remove "Visão geral"
The string "Visão geral" does not exist in `src/` files — only in `app/dashboard-shell-01/page.tsx` (outside the build). If there's a specific UI element the user wants removed from the dashboard, it may already have been removed or may refer to something else. No action needed for this unless the user clarifies further.

### Files to Change
1. **`src/components/ui/dropdown-menu.tsx`** — Add `variant` prop to `DropdownMenuItem`
2. **`src/vite-env.d.ts`** — Create with CSS module declaration
3. **`src/components/shadcn-studio/blocks/datatable-transaction.tsx`** — Replace `variant='destructive'` with `className` approach if needed (but adding `variant` to the component is cleaner)

