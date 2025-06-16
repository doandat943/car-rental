import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdvancedChatbot from '@/components/AdvancedChatbot';
import { CalendarModalProvider } from '@/contexts/CalendarModalContext';
import GlobalCalendarModal from '@/components/GlobalCalendarModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Car Rental - Rent Your Dream Car',
  description: 'Find and rent your perfect car for any occasion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CalendarModalProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AdvancedChatbot />
            <GlobalCalendarModal />
        </div>
        </CalendarModalProvider>
      </body>
    </html>
  );
} 