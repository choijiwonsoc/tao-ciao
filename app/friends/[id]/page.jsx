'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import React from 'react';

export default function FriendItems({ params }) {
    console.log(React.use(params));
    const { id } = React.use(params);
    const friend_eye = id;
    console.log("friendid", id);

    const [friend, setFriend] = useState(null);
    const [items, setItems] = useState([]);

    // Fetch friend user info
    useEffect(() => {

        fetch(`/api/users/getUser?id=${id}`)
            .then(res => res.json())
            .then(data => setFriend(data.user || null))
            .catch(err => console.error(err));
    }, [id]);

    // Fetch friend's items
    useEffect(() => {
        fetch(`/api/items/getItems?userId=${id}`)
            .then(res => res.json())
            .then(data => setItems(data.items || []))
            .catch(err => console.error(err));
    }, [id]);


    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    {friend ? `${friend.username}'s Items` : "Loading..."}
                </h1>

                <Link href="/friends">
                    <p className="text-blue-600 underline cursor-pointer">Back</p>
                </Link>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.length === 0 && (
                    <p className="text-gray-500">Loading user items...</p>
                )}

                {items.map(item => (
                    <Link key={item._id} href={`/friends/${friend_eye}/${item._id}`}>
                    <Card key={item._id} className="flex items-center space-x-4 cursor-pointer">
                        <img
                            src={item.picture?item.picture:"/cart.png"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-gray-600">Price: ${item.price}</p>
                            <p className={`font-semibold ${item.status === 'bought' ? 'text-red-500' : (item.status === 'stopped' ? 'text-green-500':'text-yellow-500')
                                }`}>
                                Status: {item.status}
                            </p>
                            <p className="text-sm text-gray-500">Time left: {item.waitTime}</p>
                            <p className="text-sm text-gray-500">Emotion: {item.emotion}</p>
                        </div>
                    </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
