# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## What this is

A **SharePoint Framework (SPFx) v1.23.0 Application Customizer** extension. The build toolchain is **Heft** (Rush Stack) with `@microsoft/spfx-web-build-rig` — not the traditional SPFx gulp pipeline. Package manager is **pnpm**. Node 22.x required.

## Commands

```bash
pnpm install                    # Install dependencies
heft start --clean              # Dev server (HTTPS, port 4321)
heft test --clean               # Build + run tests
heft build --clean              # Build only
heft clean                      # Clean artifacts
heft test --clean --production && heft package-solution --production  # Full prod build
```

Before `heft start`, replace `{tenantDomain}` in `config/serve.json` with your SharePoint tenant domain. The serve config controls which component and properties are injected during local development.

## Heft / rig notes

TypeScript and webpack config come from the rig (`config/rig.json` → `@microsoft/spfx-web-build-rig`). Do not add local `tsconfig.json` overrides or `webpack.config.js` unless you first run `heft eject-webpack`. Tests run via Jest, already wired into the rig — no separate Jest config needed.

## Deployment

The production build produces `sharepoint/solution/sharepoint-site-assistant.sppkg`, uploaded to the SharePoint App Catalog. Because `skipFeatureDeployment: true` in `config/package-solution.json`, the extension deploys tenant-wide without per-site installation. `sharepoint/assets/elements.xml` defines the `CustomAction` that wires the component ID to SharePoint.

## Code organization

Each extension is self-contained. Layers live inside the extension folder:

```
src/extensions/sharepointSiteAssistant/
  SharepointSiteAssistantApplicationCustomizer.ts  # Entry point only — no business logic
  components/   # React components — UI only, no business logic
  services/     # Async data access (SharePoint REST, Microsoft Graph)
  hooks/        # Custom React hooks — bridge between components and services
  models/       # All interfaces, types, and enums for this extension
  utils/        # Pure functions with no React or SPFx dependencies
```

If a second extension is added, it gets its own identical layer structure under `extensions/`. There is no shared cross-extension layer.

## TypeScript and React conventions

**Components** are thin. They receive data and callbacks via props, render UI, and call hooks. No API calls, no business logic, no direct service imports inside a component.

**Hooks** own component-level state and side effects. They call services and expose loading/error state to components. A hook is the only place a component should get async data.

**Services** are classes with async methods. They take dependencies (e.g. `spHttpClient`, `context`) via constructor injection so they can be mocked in tests. Return typed model objects, never raw API responses.

**Models** (`models/`) hold all interfaces, types, and enums for the extension. No logic — shapes only.

**Utils** are pure functions. If a function touches React or SPFx, it belongs in a hook or service instead.

**Styling** uses Fluent UI components for M365-consistent UI, and CSS Modules (`.module.scss`) for layout and custom overrides.

## SCSS theming rules

**Hard rule: hardcoded colors, fonts, and pixel sizes in `.module.scss` files require explicit operator approval before use.**

Instead, use SPFx theme tokens and semantic slots so styles automatically adapt to the site's theme:

```scss
// Theme token syntax — second argument is the fallback shown at build time only
color: "[theme: themePrimary, default: #0078d4]";
background-color: "[theme: neutralLighter, default: #f3f2f1]";

// Or assign to a SCSS variable first for reuse
$themePrimary: "[theme: themePrimary, default: #0078d4]";
$neutralPrimary: "[theme: neutralPrimary, default: #323130]";
```

Common semantic slots to prefer over raw colors:

| Slot | Use |
|---|---|
| `themePrimary` | Primary brand/action color |
| `themeDark` / `themeDarker` | Hover / active states on primary |
| `neutralPrimary` | Default body text |
| `neutralSecondary` | Secondary / subdued text |
| `neutralLight` / `neutralLighter` | Subtle backgrounds, dividers |
| `bodyBackground` | Page/panel background |
| `white` | White surface (adapts in high-contrast) |

For the full list of available slots, inspect `window.__themeState__.theme` in the browser console on any SharePoint page, or see the [official SPFx theming docs](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/use-theme-colors-in-your-customizations).

Pixel sizes for spacing and type should use the standard 4px grid and reference Fluent UI spacing tokens where possible. Any deviation (fixed `px` values, explicit `font-size`, explicit `font-family`) requires operator sign-off.

**State management** uses React Context and hooks only — no external state library.

## Localization rules

**Hard rule: every string displayed to end users must come from the extension's `/loc` files — never hardcoded inline.**

This includes labels, button text, panel headers, placeholder text, error messages, tooltips, and `aria-label` values.

Add new strings to both the type declaration and all locale files:

```
src/extensions/sharepointSiteAssistant/loc/
  myStrings.d.ts   ← declare the interface member
  en-us.js         ← provide the English value
```

Import and use them in components and hooks via the strings module:

```ts
import * as strings from 'SharepointSiteAssistantApplicationCustomizerStrings';

// in JSX
<Panel headerText={strings.ChatPanelTitle} />
<button aria-label={strings.OpenAssistantLabel} />
```

If a string is missing from `/loc`, add it there first — do not inline a literal as a temporary measure.

## SPFx DOM rules

**Hard rule: all rendering must stay within the SPFx host `domElement`. Never access or render into `document.body` or any DOM node outside the host element.**

This means:

- Never use `document.body`, `document.querySelector`, or any global DOM selector to find or create nodes for React rendering.
- Never use `ReactDOM.createPortal(content, document.body)` or any equivalent that portals outside the host element.
- Fluent UI `Panel` and `Layer` components internally portal to `document.body` by default — this violates SPFx sandboxing. If a Panel or similar component must be used, configure it to target a host element inside `domElement`, or replace it with a custom implementation that does not escape the host.
- SPFx extensions may run in iframes or sandboxed contexts where access to the host page DOM is restricted. Rendering outside `domElement` can break silently or behave unpredictably across tenants and themes.

## Testing approach

- Services are the primary unit test target. Constructor injection makes dependencies easy to mock.
- Hooks are tested with `renderHook` from React Testing Library, with services mocked.
- Components are tested with React Testing Library against behavior, not implementation. Because components contain no logic, tests are kept minimal.
- Utils are plain unit tests — no mocking needed.
