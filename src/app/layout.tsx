import type { Metadata } from "next";
import Link from "next/link";
import { Great_Vibes, Playfair_Display, Montserrat } from "next/font/google";
import { WeddingTemplateProvider } from "@/components/wedding-template/WeddingTemplateProvider";
import { ShareButton, DataImporter } from "@/components/wedding-template/ShareButton";
import "./globals.css";
import "./wedding-template.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedding Template Planner",
  description:
    "Plan your wedding guests, seating chart, and vendors in one elegant place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { href: "/", label: "Overview" },
    { href: "/guests", label: "Guests" },
    { href: "/seating", label: "Seating" },
    { href: "/vendors", label: "Vendors" },
    { href: "/timeline", label: "Timeline" },
    { href: "/inspo", label: "Inspo & Notes" },
  ];

  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} ${playfairDisplay.variable} ${montserrat.variable} antialiased`}
      >
        <div className="min-h-screen bg-ivory text-sage-dark">
          <WeddingTemplateProvider>
            <header className="wedding-header border-b border-gold/30 bg-white/70 backdrop-blur-sm">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-5">
                <div>
                  <p className="text-xs font-medium tracking-[0.25em] uppercase text-gold">
                    Wedding Planner
                  </p>
                  <h1 className="font-display text-xl md:text-2xl text-sage-dark">
                    Viktorija&apos;s Wedding Template
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <ShareButton />
                  <div className="hidden text-right md:block">
                    <p className="font-script text-2xl text-gold leading-tight">
                      15 August 2026
                    </p>
                    <p className="text-xs text-sage-dark/70">A day to remember</p>
                  </div>
                </div>
              </div>
              <nav className="wedding-nav">
                <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 pt-1 text-sm">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="wedding-nav-link"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </header>
            <DataImporter />
            <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
              {children}
            </main>
          </WeddingTemplateProvider>
        </div>
      </body>
    </html>
  );
}
