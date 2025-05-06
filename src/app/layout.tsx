import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter from next/font/google
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Initialize Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define CSS variable
});

export const metadata: Metadata = {
  title: 'Saysimple',
  description: 'Simplify and translate text with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variable to the body */}
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
