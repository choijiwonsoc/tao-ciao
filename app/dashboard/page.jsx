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

    const handleMarkAttendance = async () => {
        if (!user) return;

        // Update streak in DB
        const res = await fetch(`/api/users/${user._id}/update-streak`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment: 1 })
        });
        const data = await res.json();
        setStats(prev => ({ ...prev, streak: data.streak }));
    };

    if (!user) return <p className="text-center mt-10">Please login to view your dashboard.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-2">Welcome, {user.username}</h2>
            <Card>
                <h2 className="text-xl font-bold mb-2">Daily Streak</h2>
                <p className="text-gray-600 mb-4">{stats.streak} days</p>
                <Button onClick={handleMarkAttendance}>Mark Attendance</Button>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <h3 className="font-bold">Money Saved</h3>
                    <p className="text-gray-600">${moneySaved}</p>
                </Card>
                <Card>
                    <h3 className="font-bold">Impulse Purchases Stopped</h3>
                    <p className="text-gray-600">{impulseStopped}</p>
                </Card>
                <Card>
                    <h3 className="font-bold">Impulse Purchases Bought</h3>
                    <p className="text-gray-600">{impulseBought}</p>
                </Card>
            </div>
        </div>
    );
}
