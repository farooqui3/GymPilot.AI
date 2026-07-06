import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GymPilot AI — Run your gym on autopilot",
  description:
    "AI-powered gym management for gyms worldwide. Automate renewals, payments, member follow-ups and WhatsApp — so you grow, not chase.",
  keywords: ["gym software", "gym management", "AI gym", "gym CRM", "WhatsApp gym", "fitness studio software"],
  openGraph: {
    title: "GymPilot AI — Run your gym on autopilot",
    description:
      "AI-powered gym management for gyms worldwide. Automate renewals, payments and WhatsApp follow-ups.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
