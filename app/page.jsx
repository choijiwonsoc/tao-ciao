'use client';

import Card from '../components/Card';
import Button from '../components/Button';
import { useState } from 'react';

export default function Dashboard() {
  const [streak, setStreak] = useState(5);
  const [moneySaved, setMoneySaved] = useState(120);
  const [impulseStopped, setImpulseStopped] = useState(7);
  const [impulseBought, setImpulseBought] = useState(2);

  const handleMarkAttendance = () => setStreak(streak + 1);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-2">Daily Streak</h2>
        <p className="text-gray-600 mb-4">{streak} days</p>
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
