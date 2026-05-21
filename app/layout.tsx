
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "McD Muse Prototype",
  description: "Mobile-like web app powered by Shopping Muse",
  manifest: "/manifest.webmanifest",
  themeColor: "#DA291C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
