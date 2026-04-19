# Frontier Design System

Shared React component library and design tokens for the Frontier Products Team.  
Synced from the [FPT Design System Figma file](https://www.figma.com/design/L1pEBeQ807VixpBZMzFo39).

**[→ View Storybook](https://felimcpf.github.io/frontier-design-system)**

---

## Installation

This package is published to GitHub Packages. Add the registry to your project's `.npmrc`:

```
@felimcpf:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @felimcpf/frontier-design-system
```

> You'll need a GitHub personal access token with `read:packages` scope to install from GitHub Packages.  
> Set it in your `.npmrc`: `//npm.pkg.github.com/:_authToken=YOUR_TOKEN`

---

## Usage

Wrap your app in a `ThemeProvider`, then use any component:

```tsx
import { ThemeProvider, Button, InputField } from '@felimcpf/frontier-design-system'
import '@felimcpf/frontier-design-system/style.css'

function App() {
  return (
    <ThemeProvider product="agent-central">
      <Button label="Get started" variant="solid-primary" />
      <InputField label="Email" placeholder="you@example.com" />
    </ThemeProvider>
  )
}
```

---

## Themes

| Theme | Primary colour | Use for |
|---|---|---|
| `agent-central` | Pink `#FF7DA6` | Claude / AI products |
| `doc-central` | Green `#5DC115` + Orange secondary | Documentation products |
| `nav-central` | Navy blue `#3D52C7` | Navigation / portal |
| `draft-central` | Steel blue `#5B8ED6` | Drafting / forms |

The `agent-central` theme also exposes `--color-secondary-*` (blue), `--color-teal-*`, and `--color-accent-*` CSS variables for richer UI needs.

---

## Components

| Component | Description |
|---|---|
| `ThemeProvider` | Wraps content with a `data-theme` scope |
| `Button` | 11 variants × 3 sizes, with optional icon |
| `InputField` | Text, textarea, prefix; label, caption, error states |
| `Typography` | 13 variants: display, heading, body, label, caption |
| `Modal` | sm / md / lg, keyboard-accessible |
| `Tabs` | Controlled tab navigation |
| `Tags` | Closeable tags, 3 sizes |
| `Accordion` | Expandable sections |
| `Avatar` / `AvatarGroup` | Initials or image avatars |
| `Breadcrumb` | Navigation breadcrumbs |
| `Checkbox` / `RadioGroup` / `ToggleButton` | Form controls |
| `DropdownSelector` | Single & multi-select dropdowns |
| `DropdownMenu` | Context/action menus |
| `DropdownButton` | Button with a dropdown |
| `GlobalNavigation` | Top-level app navigation bar |
| `SideMenu` | Sidebar navigation |
| `SearchBar` | Search input with icon |
| `InputField` | Text / textarea / prefix input |
| `LinkButton` / `IconButton` | Inline and icon-only buttons |
| `LinkCard` / `LinkCardGrid` | Card-based navigation tiles |
| `Loader` | Spinner variants |
| `ProgressBar` | Progress indicator |
| `Snackbar` | Toast notifications |
| `Stepper` | Multi-step progress indicator |
| `Divider` | Horizontal/vertical separators |
| `Tooltip` | Hover tooltips |

---

## Development

```bash
npm install
npm run storybook       # Browse components at http://localhost:6006
npm run generate-themes # Regenerate CSS from tokens/
npm run sync-figma      # Pull latest colours from Figma (needs .env)
npm run build           # Build the publishable library
npm run test            # Run component tests
```

### Syncing colours from Figma

Create a `.env` file (never commit this):

```
FIGMA_TOKEN=your_figma_personal_access_token
FIGMA_FILE_KEY=L1pEBeQ807VixpBZMzFo39
```

Then run `npm run sync-figma`. This updates `tokens/*.json` and regenerates the theme CSS.

---

## Publishing a new version

1. Update the version in `package.json` (follow semver)
2. Commit and push to `main`
3. [Create a GitHub Release](https://github.com/felimcpf/frontier-design-system/releases/new) — the publish workflow runs automatically

The Storybook is rebuilt and deployed to GitHub Pages on every push to `main`.
