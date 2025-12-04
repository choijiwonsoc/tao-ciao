import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const client = await clientPromise;
    const db = client.db('TaoCiao');
    const users = db.collection('users');

    const user = await users.findOne({ username });
    if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
