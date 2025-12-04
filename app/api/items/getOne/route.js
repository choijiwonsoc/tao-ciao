import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const client = await clientPromise;
    const db = client.db('TaoCiao');

    const items = db.collection('items');

    const item = await items.findOne({ _id: new ObjectId(id) });

    if (!item)
      return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });

    return new Response(JSON.stringify({ item }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
