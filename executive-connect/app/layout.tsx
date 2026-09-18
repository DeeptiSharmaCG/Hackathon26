import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Executive Connect — Your Network. Your Next Room.",
  description:
    "AI-powered executive event discovery and networking intelligence platform for technology leaders in Texas.",
  keywords: ["executive networking", "tech events", "Dallas", "Texas", "leadership"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="bg-[#F8F9FC] text-[#111827] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
