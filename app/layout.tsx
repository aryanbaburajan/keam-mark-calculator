import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";

import "./globals.css";
import "../public/fonts/Satoshi/satoshi.module.css";

export const metadata: Metadata = {
  title: "KEAM Mark Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-[Satoshi-Variable] antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
