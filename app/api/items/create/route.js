import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  try {
    const { userId, name, picture, link, price, status, waitTime, emotion } = await req.json();

    if (!userId || !name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('TaoCiao');
    const items = db.collection('items');
    const users = db.collection('users');

    const ObjectId = require('mongodb').ObjectId;

    // Create item
    const result = await items.insertOne({
      userId: new ObjectId(userId),       // link to user
      name,
      picture,
      link,
      price,
      status: 'waiting', // default
      waitTime: waitTime || '0:0:0',
      emotion: emotion || 'not sure',
      createdAt: new Date()
    });

    // Add itemId to user's items array
    await users.updateOne(
      { _id: new Object(userId) },
      { $push: { items: result.insertedId } }
    );

    return new Response(JSON.stringify({ message: 'Item created', itemId: result.insertedId }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
