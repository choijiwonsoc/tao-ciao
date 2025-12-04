'use client';

import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

export default function Items() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch items when user is loaded
  useEffect(() => {
    if (!user) return;
    fetch(`/api/items/getItems?userId=${user._id}`)
      .then(res => res.json())
      .then(data => setItems(data.items || []))
      .catch(err => console.error(err));
  }, [user]);

  // Handle adding new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const price = parseFloat(form.price.value);
    const link = form.link.value;
    const picture = form.picture.value; // For simplicity, assume URL
    const status = 'waiting';
    const waitTime = form.waitTime.value;
    const emotion = Array.from(form.emotion)
      .filter(i => i.checked)
      .map(i => i.value)
      .join(',') || 'Not sure';

    const res = await fetch('/api/items/create', {
      method: 'POST',
      body: JSON.stringify({ userId: user._id, name, price, link, picture, status, waitTime, emotion }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (res.ok) {
      setItems(prev => [...prev, data]);
      setShowModal(false);
      form.reset();
    } else {
      alert(data.error || 'Failed to add item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Items</h1>
        <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
          <HiPlus className="w-5 h-5" /> <span>Add Item</span>
        </Button>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Link key={item._id} href={`/items/${item._id}`}>
            <Card className="flex items-center space-x-4 cursor-pointer">
              <img src={item.picture} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <p className={`font-semibold ${item.status === 'bought' ? 'text-green-500' : 'text-yellow-500'}`}>
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
            <form className="space-y-4" onSubmit={handleAddItem}>
              <input type="text" name="name" placeholder="Item Name" className="w-full border p-2 rounded" required />
              <input type="url" name="link" placeholder="Item Link" className="w-full border p-2 rounded" />
              <input type="number" name="price" placeholder="Price $" className="w-full border p-2 rounded" required />
              <input type="url" name="picture" placeholder="Item Image URL" className="w-full border p-2 rounded" />
              <input type="text" name="waitTime" placeholder="Time to wait (dd:hh:mm)" className="w-full border p-2 rounded" />
            

              <div className="flex space-x-2">
                {['Bored', 'Stressed', 'Excited', 'Routine', 'Not sure'].map(em => (
                  <label key={em} className="flex items-center space-x-1">
                    <input type="checkbox" name="emotion" value={em} /> <span>{em}</span>
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
