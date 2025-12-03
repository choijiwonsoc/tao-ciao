'use client';

import Card from '../../components/Card';
import Input from '../../components/Input';
import { useState } from 'react';

const sampleFriends = [
  { username: 'Alice' },
  { username: 'Bob' },
  { username: 'Charlie' },
];

export default function Friends() {
  const [search, setSearch] = useState('');

  const filtered = sampleFriends.filter(f =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Friends</h2>
      <Input placeholder="Search friends..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(friend => (
          <Card key={friend.username}>
            <p className="font-semibold">{friend.username}</p>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-gray-500">No friends found.</p>}
      </div>
    </div>
  );
}
