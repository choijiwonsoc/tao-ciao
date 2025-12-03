import './globals.css';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 ">{children}</main>
      </body>
    </html>
  );
}
