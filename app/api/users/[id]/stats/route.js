import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const userId = params.id;
  if (!userId) return new Response('Missing userId', { status: 400 });

  const client = await clientPromise;
  const db = client.db('TaoCiao');

  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) return new Response('User not found', { status: 404 });

  const items = await db.collection('items').find({ userId: new ObjectId(userId) }).toArray();

  const stats = {
    streak: user.streak || 0,
    moneySaved: items.filter(i => i.status === 'forego').reduce((acc, i) => acc + i.price, 0),
    impulseStopped: items.filter(i => i.status === 'forego').length,
    impulseBought: items.filter(i => i.status === 'bought').length,
  };

  return new Response(JSON.stringify({ stats, items }), { status: 200 });
}
