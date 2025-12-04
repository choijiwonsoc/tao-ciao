'use client';

import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Link from 'next/link';
export default function Friends() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]); // search results
  const [friends, setFriends] = useState([]); // saved friends
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // popup user

  // Load logged-in user
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);

      // Fetch full friend objects
      if (u.friends && u.friends.length > 0) {
        fetch(`/api/users/bulk?ids=${u.friends.join(',')}`)
          .then(res => res.json())
          .then(data => {
            setFriends(data.users);   // full objects
          });
      }
    }
  }, []);

  // Live search for users
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/users/search?query=${search}`);
      const data = await res.json();

      if (res.ok) setResults(data.users);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const addFriend = async (friendId) => {
    const res = await fetch('/api/users/add-friend', {
      method: 'POST',
      body: JSON.stringify({ userId: user._id, friendId }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }

    // Update UI friend list locally
    const updatedFriends = [...friends, data.friend];
    setFriends(updatedFriends);

    // Update localStorage user
    const updatedUser = { ...user, friends: updatedFriends };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setSelectedUser(null); // close modal
    setShowModal(false);

  };

  return (
    <div className="space-y-6 max-w-xl">

      <h2 className="text-2xl font-bold">Friends</h2>

      {/* Search bar */}
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Search results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((u) => (
            <Card
              key={u._id}
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setSelectedUser(u);
                console.log("Selected", u);
                setShowModal(true);   // You must open the modal here!!
              }}
            >
              <p className="font-semibold">{u.username}</p>
            </Card>
          ))}
        </div>
      )}

      {/* FRIENDS LIST */}
      <h3 className="text-lg font-semibold mt-6">My Friends</h3>
      <div className="space-y-2">
        {friends.length === 0 && (
          <p className="text-gray-500">You haven't added any friends yet.</p>
        )}

        {friends.map((f) => (
          <Card key={f._id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{f.username}</p>
                <Button>
                  <Link href={`/friends/${f._id}`}>
                    Visit Profile
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* USER POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 space-y-4">
            <h3 className="text-xl font-bold">{selectedUser.username}</h3>

            <p className="text-gray-600">
              Waiting items: {selectedUser.waitingCount}
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                className="bg-gray-300 text-black"
                onClick={() => {
                  setSelectedUser(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>

              <Button onClick={() => addFriend(selectedUser._id)}>
                Add Friend
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
