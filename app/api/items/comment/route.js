import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db('TaoCiao');

  const items = db.collection('items');
  const users = db.collection('users');
  const ObjectId = require('mongodb').ObjectId;

  const { itemId, authorId, text } = await req.json();

  if (!text || !text.trim()) {
    return new Response(JSON.stringify({ error: "Empty comment" }), { status: 400 });
  }

  // Fetch user (author of comment)
  const user = await users.findOne({ _id: new ObjectId(authorId) });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Construct comment object
  const comment = {
    authorId,
    authorName: user.username,
    text,
    createdAt: new Date()
  };

  // Push comment into item's comments array
  const result = await items.updateOne(
    { _id: new ObjectId(itemId) },
    { $push: { comments: comment } }
  );

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ comment }), { status: 200 });
}
