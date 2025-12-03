'use client';

import { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

const sampleItems = [
  { id: 1, name: 'Headphones', price: 100, status: 'pending', img: '/headphones.jpg', waitTime: '2d 5h', emotion: 'Excited' },
  { id: 2, name: 'Sneakers', price: 150, status: 'stopped', img: '/sneakers.jpg', waitTime: '1d 3h', emotion: 'Bored' },
];

export default function Items() {
  const [items, setItems] = useState(sampleItems);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Items</h1>
        <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
          <HiPlus className="w-5 h-5" /> <span>Add Item</span>
        </Button>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Link key={item.id} href={`/items/${item.id}`}>
            <Card className="flex items-center space-x-4">
              <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg"/>
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <p className={`font-semibold ${item.status === 'stopped' ? 'text-green-500' : 'text-yellow-500'}`}>
                  Status: {item.status}
                </p>
                <p className="text-sm text-gray-500">Time left: {item.waitTime}</p>
                <p className="text-sm text-gray-500">Emotion: {item.emotion}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Item Name" className="w-full border p-2 rounded"/>
              <input type="url" placeholder="Item Link" className="w-full border p-2 rounded"/>
              <input type="number" placeholder="Price $" className="w-full border p-2 rounded"/>
              <input type="file" className="w-full"/>
              <input type="datetime-local" className="w-full border p-2 rounded"/>
              <div className="flex space-x-2">
                {['Bored','Stressed','Excited','Routine','Not sure'].map(em => (
                  <label key={em} className="flex items-center space-x-1">
                    <input type="checkbox" value={em}/> <span>{em}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-black">Cancel</Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
