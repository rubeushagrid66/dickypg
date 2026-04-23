import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DPG Sistem - Dicky Putra Gorden",
  description: "Internal Dashboard for Dicky Putra Gorden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
