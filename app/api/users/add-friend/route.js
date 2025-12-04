import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { userId, friendId } = await req.json();
    if (!userId || !friendId) return new Response('Missing ids', { status: 400 });

    const client = await clientPromise;
    const db = client.db('TaoCiao');
    const users = db.collection('users');

    // Add each other as friends (simple undirected friendship)
    await users.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { friends: new ObjectId(friendId) } });
    await users.updateOne({ _id: new ObjectId(friendId) }, { $addToSet: { friends: new ObjectId(userId) } });

    const friend = await users.findOne({ _id: new ObjectId(friendId) });
    return new Response(JSON.stringify({ friend:friend  }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
