import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexValue AI | Law Firm Management",
  description: "Advanced AI-powered law firm management and document analysis.",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#334155',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9'
          }
        }} />
      </body>
    </html>
  );
}
