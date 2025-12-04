'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Items', href: '/items' },
    { name: 'Friends', href: '/friends' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 flex flex-col transition-all duration-300
        ${open ? 'w-64' : 'w-14'}`}>
        
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="m-4 p-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none"
        >
          {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>

        {/* Menu items */}
        <nav className="flex flex-col mt-8 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 text-gray-700 hover:text-blue-500 font-medium transition-colors duration-200
                ${!open ? 'justify-center' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className={`${open ? '' : 'sr-only'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Page content wrapper */}
      <div className={`transition-all duration-300 ml-14 ${open ? 'md:ml-64' : 'md:ml-14'}`}>
        {/* Your <main> content goes here */}
      </div>
    </>
  );
}
