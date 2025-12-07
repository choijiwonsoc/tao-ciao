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
  const [tab, setTab] = useState("items");
  const [leaderboardMoney, setLeaderboardMoney] = useState([]);
  const [leaderboardItems, setLeaderboardItems] = useState([]);
  const [loading, setLoading] = useState(false);


  const [selectedUser, setSelectedUser] = useState(null); // popup user

  function LeaderboardCard({ user, index }) {
    const medal = ["🥇", "🥈", "🥉"][index] || null;

    return (
      <div
        className={`flex items-center justify-between p-4 rounded-xl shadow-sm border 
        ${index === 0 ? "bg-yellow-50 border-yellow-300" : ""}
        ${index === 1 ? "bg-gray-100 border-gray-300" : ""}
        ${index === 2 ? "bg-orange-50 border-orange-300" : ""}
        ${index > 2 ? "bg-white border-gray-200" : ""}
        hover:shadow-md transition-all`}
      >
        {/* Rank */}
        <div className="text-xl font-bold w-10 text-center">
          {medal || index + 1}
        </div>

        {/* Name + Info */}
        <div className="flex flex-col flex-1 ml-3">
          <p className="font-semibold text-gray-800">{user.name}</p>

          {user.itemsStoppedCount !== undefined && (
            <p className="text-sm text-gray-500">
              {user.itemsStoppedCount} items stopped
            </p>
          )}

          {user.moneySaved !== undefined && (
            <p className="text-sm text-green-600 font-medium">
              ${user.moneySaved.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }


  // Load logged-in user
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      console.log(u);

      const loadFriendsAndLeaderboard = async () => {
        let friendList = [];

        if (u.friends && u.friends.length > 0) {
          const res = await fetch(`/api/users/bulk?ids=${u.friends.join(',')}`);
          const data = await res.json();
          friendList = Array.isArray(data.users) ? data.users : [];
          setFriends(friendList);
        }

        // Combine me + friends
        const allUsers = [u, ...friendList];
        console.log(allUsers);
        setLoading(true);

        const leaderboardData = await Promise.all(
          allUsers.map(async (user) => {
            // user.items = [ObjectId, ObjectId, …]
            // 1. fetch all items in parallel
            const fetchedItems = await Promise.all(
              (user.items || []).map(async (itemId) => {
                const res = await fetch(`/api/items/getOne?id=${itemId}`);
                const data = await res.json();
                return data.item; // return the item object
              })
            );
            console.log(fetchedItems);

            // 2. filter stopped items
            const stoppedItems = fetchedItems.filter(i => i?.status === "stopped");
            // 3. compute metrics
            return {
              id: user._id,
              name: user.name || user.username,
              itemsStoppedCount: stoppedItems.length,
              moneySaved: stoppedItems.reduce((sum, it) => sum + (it.price || 0), 0),
            };
          })
        );
        setLoading(false);

        // Sort & take top 5
        setLeaderboardItems(
          [...leaderboardData]
            .sort((a, b) => b.itemsStoppedCount - a.itemsStoppedCount)
            .slice(0, 5)
        );

        setLeaderboardMoney(
          [...leaderboardData]
            .sort((a, b) => b.moneySaved - a.moneySaved)
            .slice(0, 5)
        );
      };

      loadFriendsAndLeaderboard();
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
      <h3 className="text-lg font-semibold mt-6">Leaderboard</h3>
      <div>
        <div className="mt-6 w-full">
          {/* Tabs */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setTab("items")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
        ${tab === "items"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
      `}
            >
              🧺 Most Items Saved
            </button>

            <button
              onClick={() => setTab("money")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
        ${tab === "money"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
      `}
            >
              💰 Most Money Saved
            </button>
          </div>

          {/* Leaderboard */}
          {!loading ? (<div className="space-y-3">
            {tab === "items" &&
              leaderboardItems.map((u, i) => (
                <LeaderboardCard key={u.id} user={u} index={i} />
              ))
            }

            {tab === "money" &&
              leaderboardMoney.map((u, i) => (
                <LeaderboardCard key={u.id} user={u} index={i} />
              ))
            }
          </div>) : (
            <div className="space-y-3">Loading leaderboard...</div>
          )}
        </div>

      </div>
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

              {user?.friends?.includes(selectedUser._id) ? (
                <Link href={`/friends/${selectedUser._id}`}>
                  <Button>Visit Profile</Button>
                </Link>
              ) : (
                <Button onClick={() => addFriend(selectedUser._id)}>
                  Add Friend
                </Button>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
