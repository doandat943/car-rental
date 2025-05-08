import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Car Rental Admin Dashboard',
  description: 'Admin dashboard for Car Rental Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
