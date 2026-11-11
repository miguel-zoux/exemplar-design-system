# Exemplar design system

Shared tokens, fonts, icons and React components for our Open edX exemplar blocks.
It's generated from the **Exemplars-System** Figma file. Blocks use this package
for every colour, type style, spacing value and shared component, and keep only
their own layout and motion.

## How a block uses it
Blocks point at this repo by relative path, so clone it **next to the block's repo** (same parent
folder, folder name `exemplar-design-system`). For example:
```sh
git clone https://github.com/miguel-zoux/exemplar-design-system.git
git clone https://github.com/miguel-zoux/xblock-flashcards-prototype.git
```

1. Add the dependency to the block's `frontend/package.json`:
   `"@zoux/exemplar-design-system": "file:../../exemplar-design-system"`.
2. In the block's Vite and Vitest configs, add `resolve.dedupe: ['react', 'react-dom']`. In its
   tsconfig `paths`, point `react`, `react/*`, `react-dom/*` and `csstype` at the block's own
   `node_modules`. Both stop the package's own copy of React (installed for the preview) from
   being used.
3. Put `className="wgu-ds"` on the block's root element and import components from
   `@zoux/exemplar-design-system`. The CSS comes with the import; Vite bundles it into
   the block's own `public/` files.
4. In block styles, use only `var(--wgu-*)` tokens. Scope every rule under `.wgu-ds`.

## What's inside
- `tokens/figma-variables.json`: the Figma variables, read with the Figma MCP's
  `get_variable_defs`. Add variables here as new blocks need them, then run `npm run tokens`.
  That writes `src/tokens.generated.scss` (`--wgu-*` custom properties and `.wgu-type-*`
  text classes).
- `src/styles.scss`: scoping under `.wgu-ds`, a small reset against LMS styles, and the
  component styles. The `--wgu-local-*` values are used in Figma without a variable; ask the
  designers to add variables for them.
- `src/fonts.scss`: Sora 700 and Lato 400/700 (SIL OFL, from `@fontsource`), woff2 only, under
  their own names (`Exemplar Sora`, `Exemplar Lato`) so they never restyle the rest of the page.
- `src/icons`: Material Symbols icons from Figma as React components (`currentColor`).
- `src/components`: `Button`, `IconButton`, `InteractiveHeader`, `Card`, `LaunchCard` and
  `InteractiveShell`.
- Opening an interactive (no OS full screen; it fills the browser window):
  - `src/learningModal.ts`: in Open edX's learning app the block runs in a unit iframe, which only
    covers itself. `openLearningModal(launchUrl(usageId), title)` asks the learning app (its
    `plugin.modal` message) for a window-sized modal. The modal loads the block's own LMS page with
    `?wgu_launch=1`, so the block starts launched there (`isLaunchedInModal()`), and
    `closeLearningModal()` closes it. `canUseLearningModal()` says whether that's available.
  - `src/hooks/useOverlay.ts`: the interactive itself. It gets `wgu-overlay` (fixed over the window)
    where `canCoverWindow()` is true: a top-level page, or inside that modal. Elsewhere, such as
    Studio's unit iframe (Studio has no modal message), it gets `wgu-panel`, a panel in place.
    `isClosing` lets the content animate out first.
- `src/shadow.ts`: `mountInShadow(host, [cssUrl])` renders a block in a shadow root, so LMS and
  theme styles can't reach in. Also load the same stylesheet in the page for the fonts.

## Commands (Node 20: `export PATH="/opt/homebrew/opt/node@20/bin:$PATH"`)
- `npm install`: install the preview's dependencies.
- `npm run tokens`: regenerate the tokens from the JSON.
- `npm run dev`: a preview page with every component and token.
- `npm run build`: tokens, type check and a preview build (a check only; blocks use `src/`).
