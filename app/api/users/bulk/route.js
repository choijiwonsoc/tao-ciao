import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const ids = url.searchParams.get('ids').split(',');

    const client = await clientPromise;
    const db = client.db('TaoCiao');
    const users = db.collection('users');

    const docs = await users
      .find({ _id: { $in: ids.map(id => new ObjectId(id)) } })
      .project({ passwordHash: 0 })
      .toArray();

    return new Response(JSON.stringify({ users: docs }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
