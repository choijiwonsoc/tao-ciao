import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const client = await clientPromise;
    const db = client.db('TaoCiao');
    const users = db.collection('users');

    // Check if user exists
    const existing = await users.findOne({ username });
    if (existing) return new Response(JSON.stringify({ error: 'Username taken' }), { status: 400 });

    // Hash password & insert
    const hash = await bcrypt.hash(password, 10);
    await users.insertOne({ username,
      passwordHash: hash,
      streak: 0,
      friends: [],   // array of user ObjectIds
      items: [] 
     });

    return new Response(JSON.stringify({ message: 'User created' }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
