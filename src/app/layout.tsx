import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SaySimple', // Updated app name
  description: 'Simplify and translate text with AI using a modern, clean interface.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Dark theme is default */}
      <body className={`${inter.variable} antialiased font-sans bg-background text-foreground`}>
        <div className="animated-lines-bg" aria-hidden="true"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
