import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SheetScanner',
  description: 'Scan your spread sheets with ease!',
  // icons: {
  //   icon: '/public/images/ssicon.png',
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="min-h-screen mx-auto text-center pt-6 pattern-boxes pattern-green-600 pattern-bg-white 
            pattern-size-6 pattern-opacity-100 "
        >
          <div className="sheetscanner-child-height bg-green-50 bg-opacity-90 pt-4">
            <div className="mt-16">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
