import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Jura } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aiod MCE",
    template: "%s | Aiod MCE",
  },
  description: "Aiod MCE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${jura.variable} ${geistMono.variable} antialiased font-sans dark bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
