import clientPromise from '../../../../lib/mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // pass userId as query param

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('TaoCiao');
    const items = db.collection('items');
    console.log("Userid", userId);
    const ObjectId = require('mongodb').ObjectId;

    const userItems = await items.find({ userId: new ObjectId(userId) }).toArray();

    return new Response(JSON.stringify({ items: userItems }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch items' }), { status: 500 });
  }
}
