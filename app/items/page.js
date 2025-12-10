'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Items() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/items/getItems?userId=${user._id}`)
      .then(res => res.json())
      .then(data => {
        const items = data.items || [];
        setItems(items);

        if (items.length === 0) return;

        const latest = items[items.length - 1]._id;

        router.replace(`/items/swipe?start=${latest}`);
      });
  }, [user]);

  return <p>Loading your items...</p>;
}
