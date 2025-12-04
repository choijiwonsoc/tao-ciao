'use client';
import './globals.css';
import Navbar from '../components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const showNavbar = pathname !== '/'; // only hide navbar on login page

  return (
    <html lang="en">
      <body className="bg-gray-50 flex min-h-screen">
        {showNavbar && <Navbar />}
        <main className={`flex-1 p-6 ${showNavbar ? '' : ''}`}>{children}</main>
      </body>
    </html>
  );
}
