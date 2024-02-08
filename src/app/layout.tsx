import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';
import { AuthContextProvider } from './components/ParentProvider';
import ClipBoard from './components/ClipBoard';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sheet-scanner.vercel.app/'),
  title: 'SheetScanner',
  description: 'Scan your spreadsheets with ease!',
  authors: [{ name: "Tim Sundell" }],
  keywords: 'spreadsheet, scanner, Next.js, React, JavaScript, Tailwind, Excel',
  openGraph: { 
    type: 'website',
    url: 'https://sheet-scanner.vercel.app/', 
    title: 'SheetScanner - Scan your spreadsheets with ease!',
    description: 'SheetScanner is a handy tool for scanning spreadsheets with ease. Try it now!',
    images: {
      url: '/images/excels.webp',
      alt: 'Excel sheet being analyzed',
    },
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <NavBar />
          <ClipBoard />

          <div
            className="min-h-screen mx-auto text-center pt-6 pattern-boxes pattern-green-600 pattern-bg-white 
            pattern-size-6 pattern-opacity-100 "
          >
            <div className="sheetscanner-child-height bg-slate-50 bg-opacity-90 pt-4">
              <div className="mt-16">{children}</div>
            </div>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
