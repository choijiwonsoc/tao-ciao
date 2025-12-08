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
  const [finish, setFinish] = useState(null);

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
    const deadlineDate = new Date(deadline);
    const readable = deadlineDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    setFinish(readable);

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

  if (!item) return <p>Loading...</p>;

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
      <Card className="p-4 sm:p-6 space-y-6">

        {/* Image Section */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <img
              src={item.picture ? item.picture : "/cart.png"}
              alt={item.name}
              className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-md"
            />

            {/* Optional overlay label */}
            <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
              {item.category || "Item"}
            </span>
          </div>
        </div>

        {/* Item Information */}
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold">{item.name}</h2>
          <p className="text-gray-700 text-lg">${item.price}</p>

          {/* Melting Animation */}
          {item.status=="waiting"?<div className="flex justify-center my-4">
            <img src="/animations/melting.gif" className="w-32 sm:w-40 opacity-80" />
          </div>:<p>Item purchase has already been {item.status}</p>}
        </div>

        {/* Countdown */}
        {item.status=="waiting"?<div className="bg-gray-100 rounded-xl p-4 sm:p-5 shadow-inner text-center">
          <p className="text-gray-700 text-sm sm:text-md">⏳ Countdown Ends</p>
          <p className="text-3xl sm:text-4xl font-bold mt-1">{countdown}</p>
        </div>:<div></div>}

        {/* Item Details */}
        <div className="space-y-1 text-center sm:text-left">
          <p className={`font-semibold ${item.status === 'stopped' ? 'text-green-600' : 'text-yellow-500'}`}>
            Status: {item.status}
          </p>

          <p className="text-gray-600">Time left to buy: {finish}</p>
          <p className="text-gray-600">Emotion: {item.emotion}</p>
          <p className="text-gray-600">Time of Impulse: {item.timeOfImpulse}</p>
          <p className="text-gray-600 mb-2">Category: {item.category}</p>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Product →
            </a>
          )}
        </div>

        {item.comments?.length > 0 ? (
          item.comments.map((c, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <p className="font-semibold">{c.authorName}</p>
              <p className="text-gray-600 text-sm">{c.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            className="bg-red-400 hover:bg-red-500 text-black w-full"
            onClick={() => updateStatus("bought")}
          >
            Mark as Bought
          </Button>

          <Button
            className="bg-green-400 hover:bg-green-500 text-black w-full"
            onClick={() => updateStatus("stopped")}
          >
            Forgo Purchase
          </Button>
        </div>
      </Card>

    </div>
  );
}
