import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Events",
  description: "Events module",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
            <Link href="/events" className="group">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-600">
                Events
              </p>
            </Link>
          </header>
          <main className="flex-1 px-8 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
