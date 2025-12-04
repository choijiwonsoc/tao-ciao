'use client';

import Card from '../../components/Card';
import Input from '../../components/Input';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [username, setUsername] = useState('JohnDoe');
  const [user, setUser] = useState(null);
  const router = useRouter(); // Add this

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      setUsername(JSON.parse(stored).username);
    }

  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/'); 
  };

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
