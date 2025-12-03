'use client';

import { useRouter } from 'next/router';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useEffect, useState } from 'react';

// For demo purposes: in real app, fetch from backend
const sampleItems = [
  {
    id: 1,
    name: 'Headphones',
    price: 100,
    link: 'https://example.com/headphones',
    status: 'pending',
    image: '/sample-headphones.jpg', // use a placeholder
    timeLeftInMs: 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000, // 3 days + 2 hours
    emotions: ['bored', 'excited'],
  },
  {
    id: 2,
    name: 'Sneakers',
    price: 150,
    link: 'https://example.com/sneakers',
    status: 'stopped',
    image: '/sample-sneakers.jpg',
    timeLeftInMs: 0,
    emotions: ['stressed'],
  },
];

export default function ItemPage() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!id) return;

    const foundItem = sampleItems.find(it => it.id === parseInt(id));
    setItem(foundItem);

    if (foundItem) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date().getTime() + foundItem.timeLeftInMs;
        const diff = target - now;

        if (diff <= 0) {
          setTimeLeft('Time over');
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [id]);

  if (!item) return <p className="text-center mt-10">Loading item...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 object-cover rounded-lg shadow-md"
            />
          )}
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-gray-600">Price: ${item.price}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Product
              </a>
            )}
            <p className="font-semibold text-gray-800">Status: {item.status}</p>
            <p className="text-gray-600 font-medium">Time left: {timeLeft}</p>

            {item.emotions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.emotions.map((emo) => (
                  <span
                    key={emo}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {emo}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => alert('Here you can implement countdown start/stop or mark as bought!')}
          >
            Mark as Bought / Stop Countdown
          </Button>
        </div>
      </Card>
    </div>
  );
}
