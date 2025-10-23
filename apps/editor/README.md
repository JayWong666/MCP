# Editor application

The editor is a Next.js 14 workspace that leverages React Flow to provide the drag-and-connect workflow builder experience described in the blueprint. The current scaffold includes:

- A hero landing page with navigation into the workbench and blueprint reference.
- A themed React Flow canvas (`FlowCanvas` component) that renders the “Night charge to 80%” demo flow and exposes minimap, controls, and background grid.
- A `/workbench` route ready to host schema-driven cards, inspectors, and live context panes.
- Shared workspace scripts wired through the repository root (`npm run dev`, `npm run build`, `npm run lint`).

## Development

From the repository root:

```bash
npm install
npm run dev
```

This starts the Next.js development server on <http://localhost:3000>. Hot module reloading is enabled by default so you can iterate on node components, inspector panels, or layout changes quickly.

## Next steps

- Replace the static `FlowCanvas` data with nodes sourced from the shared JSON Schemas (`packages/schema`).
- Introduce a right-side inspector layout and schema-driven forms.
- Implement persistence by connecting to the orchestrator API once its CRUD endpoints are available.
- Add Tailwind/shadcn/ui (or your preferred design system) for consistent theming across the editor.
