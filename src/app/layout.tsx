import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";
import { I18nProvider } from "@/components/I18nProvider";
import { LanguageGate } from "@/components/LanguageGate";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BRAND } from "@/lib/copy";
import { getDictionary } from "@/i18n";
import { getLocale, hasChosenLocale } from "@/i18n/server";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: {
      default: `${BRAND.name} — ${t.tagline}`,
      template: `%s · ${BRAND.name}`,
    },
    description: t.short,
    metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
    icons: { icon: "/favicon.png", apple: "/logo.png" },
    openGraph: { title: BRAND.name, description: t.short, type: "website" },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const chosen = await hasChosenLocale();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-ink text-cream antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <Providers>
            {!chosen && <LanguageGate initialLocale={locale} />}
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
