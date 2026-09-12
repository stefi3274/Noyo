import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noyo.vercel.app"),
  title: "Noyo — La vie commence ici, avec nous",
  description:
    "Noyo met en relation les producteurs haïtiens et les acheteurs, directement, sans intermédiaire caché.",
  openGraph: {
    title: "Noyo — La vie commence ici, avec nous",
    description:
      "Noyo met en relation les producteurs haïtiens et les acheteurs, directement, sans intermédiaire caché.",
    locale: "fr_HT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${workSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
