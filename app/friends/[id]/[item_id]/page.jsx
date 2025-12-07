'use client';

import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';

export default function FriendItemPage({ params }) {
  const param = React.use(params);
  const friendId = param.id;
  const itemId = param.item_id;

  const [item, setItem] = useState(null);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);
  useEffect(() => {

    fetch(`/api/users/getUser?id=${friendId}`)
      .then(res => res.json())
      .then(data => setFriend(data.user || null))
      .catch(err => console.error(err));
  }, [itemId]);

  // Fetch item
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const res = await fetch(`/api/items/getOne?id=${itemId}`);
      const data = await res.json();
      if (res.ok) {
        setItem(data.item);
        setLoading(false);

      }
    }
    fetchData();
  }, [itemId]);

  if (!item) return <p>Loading...</p>;

  async function submitComment() {
    if (!user || !comment.trim()) return;

    const res = await fetch('/api/items/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        authorId: user._id,
        text: comment
      })
    });

    const data = await res.json();
    if (res.ok) {
      setItem(prev => ({
        ...prev,
        comments: [...(prev.comments || []), data.comment]
      }));
      setComment('');
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">
        {friend ? `${friend.username}'s Items` : "Loading..."}
      </h1>
      <Link href={`/friends/${friendId}`}>
        <p className="text-blue-600 underline cursor-pointer">← Back</p>
      </Link>

      {!loading ?
        <div><Card>
          <div className="flex flex-col sm:flex-row sm:space-x-6">
            <img
              src={item.picture ? item.picture : "/cart.png"}
              alt={item.name}
              className="w-full sm:w-64 h-64 object-cover rounded-lg"
            />
            <div className="mt-4 sm:mt-0">
              <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-1">Price: ${item.price}</p>
              <p className={`font-semibold mb-1 ${item.status === 'bought' ? 'text-red-500' : (item.status === 'stopped' ? 'text-green-500' : 'text-yellow-500')
                }`}>
                Status: {item.status}
              </p>
              <p className="text-gray-500 mb-1">Time left to buy: {item.waitTime}</p>
              <p className="text-gray-500 mb-1">Emotion: {item.emotion}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Go to product
              </a>
            </div>
          </div>
        </Card>

          {/* Comments Section */}
          <Card className="p-4">
            <h2 className="font-bold mb-2">Comments</h2>

            {/* Existing comments */}
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

            {/* Add comment */}
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full border p-2 rounded mt-3"
              placeholder="Write a comment..."
            />

            <Button className="mt-2" onClick={submitComment}>
              Submit Comment
            </Button>
          </Card>
        </div> : <p>Loading details...</p>}
    </div>
  );
}
