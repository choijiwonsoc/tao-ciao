import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { itemId, status } = await req.json();

    if (!itemId || !status) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("TaoCiao");
    const items = db.collection("items");

    const result = await items.updateOne(
      { _id: new ObjectId(itemId) },                 // IF you're using ObjectId, I'll adjust below
      { $set: { status: status } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.log(error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
