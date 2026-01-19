import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "投研助手 · A 股情报台",
  description: "A 股投研助手：个股情报、新闻解读、机会发现。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <div className="min-h-screen">
          <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                投研助手 · A 股
              </Link>
              <nav className="flex items-center gap-6 text-sm text-slate-200">
                <Link href="/" className="hover:text-white">
                  首页
                </Link>
                <Link href="/research" className="hover:text-white">
                  智投研究
                </Link>
                <Link href="/discover" className="hover:text-white">
                  发现机会
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <footer className="border-t border-white/10 bg-slate-950/70 py-6 text-center text-xs text-slate-400">
            数据源为公开免费接口（可能不稳定），仅供产品演示和内测。
          </footer>
        </div>
      </body>
    </html>
  );
}
