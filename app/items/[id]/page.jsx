'use client';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ItemPage({ params }) {

  console.log(React.use(params));
  const { id } = React.use(params);   // Server Component: params is directly accessible
  console.log("Id", id);
  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState("00:00:00");
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`/api/items/getOne?id=${id}`);
      const data = await res.json();

      if (res.ok) setItem(data.item);
      else console.error(data.error);
    }
    fetchItem();
  }, [id]);


  useEffect(() => {
    if (!item) return;
    // Parse "day:hour:min"
    const [d, h, m] = item.waitTime.split(':').map(Number);

    // Convert to ms
    const waitMs = (d * 24 * 60 + h * 60 + m) * 60 * 1000;

    const created = new Date(item.createdAt);
    const deadline = created.getTime() + waitMs;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setCountdown("00:00:00");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [item]);

  if (!item) return <p>Item not found</p>;

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch("/api/items/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item._id,     // or however you store the current item's id
          status: newStatus,
        }),
      });

      const data = await res.json();
      console.log(data);
      router.push("/items");

      // Optional: refresh UI
      // router.refresh();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <img src={item.img} alt={item.name} className="w-full sm:w-64 h-64 object-cover rounded-lg" />
          <div className="mt-4 sm:mt-0">
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-1">Price: ${item.price}</p>
            <div className=" justify-center items-center">
              <img src="/animations/melting.gif" className="w-40 h-40 opacity-80" />
            </div>
            <div className="mt-6 p-4 bg-gray-100 rounded-xl text-center shadow-inner">
              <p className="text-gray-700 text-md">⏳ Time left to buy:</p>
              <p className="text-3xl font-bold text-gray-900">{countdown}</p>
            </div>
            <p className={`font-semibold mb-1 ${item.status === 'stopped' ? 'text-green-500' : 'text-yellow-500'}`}>
              Status: {item.status}
            </p>
            <p className="text-gray-500 mb-1">Time left to buy: {item.waitTime}</p>
            <p className="text-gray-500 mb-1">Emotion: {item.emotion}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Go to product</a>
            <div className="flex">
              <Button className="bg-red-300 text-black" onClick={() => {
                updateStatus("bought");
                
              }}>
                Mark as Bought
              </Button>

              <Button
                className="bg-green-300 text-black"
                onClick={() => updateStatus("stopped")}
              >
                Forgo Purchase
              </Button>
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
}
