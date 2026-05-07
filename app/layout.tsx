import type { Metadata } from "next";
import { Manrope, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";

const siteUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ashwath Ram's Canvas",
  description:
    "Cloud Engineer and DevOps practitioner focused on AWS infrastructure, containerized applications, CI/CD, Terraform, Linux, and monitoring.",
  keywords: [
    "Ashwath Ram",
    "Cloud Engineer",
    "DevOps Practitioner",
    "AWS",
    "Docker",
    "Terraform",
    "CI/CD",
    "Linux",
    "Prometheus",
    "Grafana",
    "Portfolio",
  ],
  authors: [{ name: "Ashwath Ram" }],
  openGraph: {
    title: "Ashwath Ram, Cloud Engineer & DevOps Practitioner",
    description:
      "Cloud and DevOps practitioner focused on AWS infrastructure, Docker, CI/CD, Terraform, Linux, Prometheus, and Grafana.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Thumbnail portfolio.png",
        width: 1200,
        height: 630,
        alt: "Ashwath Ram - Cloud Engineer & DevOps Practitioner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwath Ram, Cloud Engineer",
    description:
      "Cloud Engineer and DevOps practitioner building reliable infrastructure and deployment workflows.",
    images: ["/Thumbnail portfolio.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/Favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/Favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Favicon.png" />
      </head>
      <body className={`${manrope.variable} ${dmMono.variable} ${instrumentSerif.variable} antialiased`}>
        <Analytics />
        <LoadingScreen />
        <ScrollToTop />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
