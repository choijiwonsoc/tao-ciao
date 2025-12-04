import clientPromise from '../../../../lib/mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const client = await clientPromise;
    const db = client.db('TaoCiao');

    const users = await db
      .collection('users')
      .find({ username: { $regex: query, $options: 'i' } })
      .project({ passwordHash: 0 })
      .toArray();

    // For each user, count their "waiting" items
    const items = db.collection('items');

    const results = await Promise.all(
      users.map(async (u) => {
        const count = await items.countDocuments({
          userId: u._id,
          status: 'waiting'
        });

        return {
          ...u,
          waitingCount: count
        };
      })
    );

    return new Response(JSON.stringify({ users: results }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
