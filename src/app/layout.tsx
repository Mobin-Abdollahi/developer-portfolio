import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    siteConfig.description,
  keywords: [
    "Front-End Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Tailwind CSS",
    "Portfolio Website",
    "Framer Motion",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Your Name | Front-End Developer",
    description:
      "Modern portfolio of a Front-End Developer building responsive and interactive web experiences.",
    siteName: "Your Name Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Your Name Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name | Front-End Developer",
    description:
      "Modern portfolio of a Front-End Developer building responsive and interactive web experiences.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://your-domain.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
