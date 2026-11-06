import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "cracked: agent skills for tech placements and coding interviews",
    template: "%s | cracked",
  },
  description:
    "Turn Claude Code, Codex or Cursor into your interviewer. Company-wise mock DSA interviews for 470+ companies, timed OAs graded against hidden tests, system design and HR rounds, and a brutal resume roast with an ATS score. Free and open source.",
  keywords: [
    "placement preparation", "coding interview", "mock interview", "LeetCode company wise questions",
    "online assessment practice", "OA preparation", "system design interview", "HR interview questions",
    "resume review", "ATS score", "Claude Code skills", "agent skills", "Codex", "Cursor", "FAANG preparation",
  ],
  authors: [{ name: "Nishant Tiwari", url: "https://github.com/nishant-Tiwari24" }],
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "cracked",
    title: "cracked: skills for getting hired",
    description: "Company-wise mock interviews, OAs with hidden tests and brutal resume roasts for 470+ companies, straight from your terminal.",
    images: [{ url: "assets/social-preview.png", width: 1280, height: 640, alt: "cracked: skills for getting hired" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "cracked: skills for getting hired",
    description: "Company-wise mock interviews, OAs with hidden tests and brutal resume roasts for 470+ companies, straight from your terminal.",
    images: ["assets/social-preview.png"],
  },
};

export const viewport: Viewport = { themeColor: "#0b0b0b", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
