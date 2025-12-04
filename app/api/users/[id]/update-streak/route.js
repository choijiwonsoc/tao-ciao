import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const userId = params.id;
  if (!userId) return new Response('Missing userId', { status: 400 });

  const client = await clientPromise;
  const db = client.db('TaoCiao');

  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) return new Response('User not found', { status: 404 });

  const streak= user.streak || 0;

  return new Response(JSON.stringify({ streak }), { status: 200 });
}
