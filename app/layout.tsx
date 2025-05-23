import type { Metadata } from "next";
import { Roboto, Geist_Mono, DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Text({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debutism - Get ideas on what to build next",
  description: "Discover the most successful Product Hunt launches delivered to your inbox daily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
