import type { Metadata, Viewport } from "next";
import { Cinzel, Cinzel_Decorative, IM_Fell_English, Manrope } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const imFell = IM_Fell_English({
  variable: "--font-im-fell",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espresso Patronum — Magic in Every Crumb, Spell in Every Sip",
  description:
    "A wizarding bakery & coffee house in Samarkand. Butterbeer lattes, treacle tarts, cauldron cakes and owl-post delivery across the city.",
};

export const viewport: Viewport = {
  themeColor: "#060509",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cinzelDecorative.variable} ${cinzel.variable} ${imFell.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
