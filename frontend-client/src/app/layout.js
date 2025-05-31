import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdvancedChatbot from '@/components/ui/AdvancedChatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Car Rental - Rent Your Dream Car',
  description: 'Find and rent your perfect car for any occasion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AdvancedChatbot />
        </div>
      </body>
    </html>
  );
} 