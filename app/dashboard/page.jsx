'use client';

import Card from '../../components/Card';
import Button from '../../components/Button';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        streak: 0,
        moneySaved: 0,
        impulseStopped: 0,
        impulseBought: 0
    });

    const [moneySaved, setMoneySaved] = useState(0);
    const [impulseStopped, setImpulseStopped] = useState(0);
    const [impulseBought, setImpulseBought] = useState(0);
    const [data, setData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) return;
        const u = JSON.parse(stored);
        setUser(u);

        async function getUserItemStats() {
            try {
                const res = await fetch(`/api/items/getItems?userId=${u._id}`);
                const data = await res.json();
                console.log(data);

                if (!res.ok) {
                    console.error(data.error);
                    return;
                }

                const items = data.items || [];
                console.log(items);

                const stopped = items.filter(i => i.status === "stopped");
                console.log(stopped.length);
                const bought = items.filter(i => i.status === "bought");

                setMoneySaved(
                    stopped.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
                );

                setImpulseStopped(stopped.length);
                setImpulseBought(bought.length);

            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }

        getUserItemStats();
        // fetch(`/api/users/${u._id}/stats`)
        //     .then(res => res.json())
        //     .then(data => setStats(data.stats))
        //     .catch(err => console.error(err));
    }, []);

    const [hasMarkedToday, setHasMarkedToday] = useState(false);

    const handleMarkAttendance = async () => {
        if (!user) return;

        console.log(user._id);
        const res = await fetch(`/api/users/update-streak?id=${user._id}`, {
            method: "POST"
        });

        const data = await res.json();

        setStats(prev => ({ ...prev, streak: data.streak }));

        if (data.alreadyMarked) {
            setHasMarkedToday(true);
        } else {
            setHasMarkedToday(true);
        }

        const updatedUser = {
            ...user,
            streak: data.streak,
            lastAttendance: new Date().toISOString()
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    if (!user) return <p className="text-center mt-10">Please login to view your dashboard.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-2">Welcome, {user.username}</h2>
            <Card>
                <Card>
                    <h2 className="text-xl font-bold mb-2">Daily Streak</h2>
                    <p className="text-gray-600 mb-4">{stats.streak} days</p>

                    {/* Streak Circles */}
                    <div className="flex space-x-2 mb-4">
                        {[...Array(Math.min(stats.streak, 7))].map((_, i) => (
                            <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-yellow-400 animate-pulse"
                            ></div>
                        ))}
                    </div>

                    <Button
                        disabled={hasMarkedToday}
                        className={`${hasMarkedToday ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
                            }`}
                        onClick={handleMarkAttendance}
                    >
                        {hasMarkedToday ? "Already Marked Today" : "Mark Attendance"}
                    </Button>
                </Card>
            </Card>
            <div className="space-y-10">

                {/* --- STATS SECTION 1 --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            💰 Money Saved
                        </h3>
                        <p className="text-2xl font-bold text-green-500 mt-1">${moneySaved}</p>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            🛑 Stopped Purchases
                        </h3>
                        <p className="text-2xl font-bold text-green-500 mt-1">{impulseStopped}</p>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            ⏳ Waiting Purchases
                        </h3>
                        <p className="text-2xl font-bold text-yellow-500 mt-1">{impulseStopped}</p>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            🛒 Bought Purchases
                        </h3>
                        <p className="text-2xl font-bold text-red-500 mt-1">{impulseBought}</p>
                    </Card>

                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* --- STATS SECTION 2 --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <Card className="p-5 bg-white border shadow-sm hover:shadow-md transition">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            📂 Category Breakdown
                        </h3>
                        <p className="text-lg text-gray-600 mt-2">
                            {moneySaved} saved across categories
                        </p>
                    </Card>

                    <Card className="p-5 bg-white border shadow-sm hover:shadow-md transition">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            🎯 Purchasing Factor
                        </h3>
                        <p className="text-lg text-gray-600 mt-2">{impulseStopped}</p>
                    </Card>

                    <Card className="p-5 bg-white border shadow-sm hover:shadow-md transition">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            ⏰ Time of Impulse
                        </h3>
                        <p className="text-lg text-gray-600 mt-2">{impulseBought}</p>
                    </Card>

                </div>

            </div>

        </div>
    );
}
