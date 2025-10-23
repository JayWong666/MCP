import Image from "next/image";
import Link from "next/link";

import { FlowCanvas } from "../components/FlowCanvas";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "3.5rem min(6vw, 5rem)",
        gap: "3rem",
      }}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: "2.5rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                background: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Alpha scaffold
            </span>
            <span style={{ color: "#cbd5f5", fontSize: "0.85rem" }}>
              React Flow + Safety aware runtime vision
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 3.75rem)", margin: 0, lineHeight: 1.05 }}>
            Start building the HEMS workflow editor
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "1.05rem",
              color: "rgba(226, 232, 240, 0.9)",
              lineHeight: 1.6,
              maxWidth: "44ch",
            }}
          >
            A Next.js workspace ready for implementing drag-and-connect energy automations. This scaffold ships with React Flow,
            a themed canvas preview, and workspace scripts so you can move straight into feature development.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/workbench"
              style={{
                padding: "0.85rem 1.5rem",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb, #22d3ee)",
                color: "black",
                fontWeight: 600,
              }}
            >
              Open canvas
            </Link>
            <a
              href="/docs/blueprint"
              style={{
                padding: "0.85rem 1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(148, 163, 184, 0.4)",
                color: "rgba(226, 232, 240, 0.9)",
                fontWeight: 500,
              }}
            >
              View blueprint
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <Image src="/icons/lightning.svg" alt="Lightning bolt" width={28} height={28} />
              <span style={{ fontSize: "0.95rem", color: "#bae6fd" }}>Deterministic orchestration</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <Image src="/icons/shield.svg" alt="Shield" width={28} height={28} />
              <span style={{ fontSize: "0.95rem", color: "#bbf7d0" }}>Safety policy gateway ready</span>
            </div>
          </div>
        </div>
        <FlowCanvas />
      </section>
    </main>
  );
}
