import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Added for better font loading
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GeminiSimplify', // Updated app name
  description: 'Simplify and translate text with AI using a futuristic interface.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Set dark theme as default if desired */}
      <body className={`${inter.variable} antialiased font-sans bg-background text-foreground`}>
        <div className="animated-lines-bg" aria-hidden="true"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
