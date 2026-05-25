import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHAY_CE | WoW UI Profiles, Addons, and Stream Tools",
  description:
    "Official CHAY_CE hub for World of Warcraft UI profiles, ChayBar, ChayImages, stream branding, and creator tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}