import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/floating-nav";
import {ProviderTheme} from "@/provider/provider-theme";
import {ScrollToTop} from "@/components/scroll-to-top";
import {ThemeTransitionIndicator} from "@/components/theme-transition-indicator";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Fernando Forastieri Neto",
    description: "Portfolio profissional",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body className={'min-h-screen font-sans pb-20'}>
        <ProviderTheme attribute="class" defaultTheme="system" enableSystem>
            <ScrollToTop />
            <ThemeTransitionIndicator />
            <main className={'container my-12'}>
                <div className={'prose prose-headings:!text-lg md:prose-lg prose-headings:md:!text-xl min-w-full w-full dark:prose-invert max-w-none'}>
                    {children}
                </div>
            </main>
            <FloatingNav />
        </ProviderTheme>
        </body>
        </html>
    );
}
