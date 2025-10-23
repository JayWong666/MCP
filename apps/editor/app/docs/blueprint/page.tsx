import Link from "next/link";

const blueprintPath = "docs/blueprint.md";

export const metadata = {
  title: "Blueprint reference",
};

export default function BlueprintPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "3rem min(6vw, 4rem) 4rem",
        maxWidth: "70ch",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "2.25rem" }}>Implementation blueprint</h1>
      <p style={{ margin: 0, color: "rgba(226, 232, 240, 0.82)", lineHeight: 1.6 }}>
        The full architecture and delivery plan for the HEMS workflow builder lives in the repository as a Markdown document. Use
        the link below to open it directly from the codebase while we work on an in-app viewer.
      </p>
      <Link
        href={`https://github.com/PLACEHOLDER_ORG/PLACEHOLDER_REPO/blob/main/${blueprintPath}`}
        style={{
          padding: "0.9rem 1.4rem",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #22d3ee, #2563eb)",
          color: "black",
          fontWeight: 600,
          width: "fit-content",
        }}
        target="_blank"
        rel="noreferrer"
      >
        Open blueprint on GitHub
      </Link>
      <p style={{ margin: 0, color: "rgba(148, 163, 184, 0.85)", fontSize: "0.95rem" }}>
        Update <code>PLACEHOLDER_ORG/PLACEHOLDER_REPO</code> once the repository is published.
      </p>
    </main>
  );
}
