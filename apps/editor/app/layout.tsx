import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEMS Workflow Builder",
  description: "Visual workflow editor for residential energy automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
