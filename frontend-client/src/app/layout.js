'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ChatbotProvider } from '@/lib/ChatbotContext';
import AdvancedChatbot from '@/components/ui/AdvancedChatbot';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Car Rental - Rent Your Dream Car</title>
        <meta name="description" content="Find and rent your perfect car for any occasion" />
      </head>
      <body className={inter.className}>
        <ChatbotProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <AdvancedChatbot />
          </div>
        </ChatbotProvider>
      </body>
    </html>
  );
} 