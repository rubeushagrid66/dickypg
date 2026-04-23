import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/ThemeProvider";

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
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            expand={false}
            toastOptions={{
              style: {
                borderRadius: '1rem',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontFamily: 'Helvetica, Arial, sans-serif'
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
