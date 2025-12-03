'use client';

import Card from '../../components/Card';
import Input from '../../components/Input';
import { useState } from 'react';
import Button from '../../components/Button';

export default function Settings() {
  const [username, setUsername] = useState('JohnDoe');

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
    </div>
  );
}
