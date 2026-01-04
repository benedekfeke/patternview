import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "./components/Footer";
import "./globals.css";
import Header from "./components/Header";

const sf = localFont({
  src: [
    {
      path: "./fonts/SpaceMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SpaceMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/SpaceMono-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/SpaceMono-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    }
  ],
  variable: "--font-sf",    
})

export const metadata: Metadata = {
  title: "PatternView",
  description: "Algorithm visualizer with Next.js, React and Unity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sf.variable} flex flex-col h-dvh`}>
        <Header />
        <main className="flex-1 flex flex-col pointer-events-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
