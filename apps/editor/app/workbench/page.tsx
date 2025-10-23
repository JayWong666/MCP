import type { Metadata } from "next";
import Link from "next/link";

import { FlowCanvas } from "../../components/FlowCanvas";

export const metadata: Metadata = {
  title: "HEMS Flow Workbench",
};

export default function WorkbenchPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "2.5rem min(6vw, 4rem) 4rem",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2.25rem" }}>Workflow canvas</h1>
          <p style={{ margin: "0.5rem 0 0", color: "rgba(226, 232, 240, 0.7)", maxWidth: "60ch" }}>
            This starter workbench renders a demo flow so you can focus on implementing schema-driven nodes, inspector panels, and
            live safety checks next.
          </p>
        </div>
        <Link
          href="/"
          style={{
            padding: "0.75rem 1.35rem",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            color: "rgba(226, 232, 240, 0.85)",
            fontWeight: 500,
          }}
        >
          Back to overview
        </Link>
      </header>
      <FlowCanvas />
    </main>
  );
}
