import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import React from 'react';

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("TaoCiao");
  const users = db.collection("users");

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  console.log("PARAMS", id);

  const user = await users.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let last = user.lastAttendance ? new Date(user.lastAttendance) : null;

  if (last) last.setHours(0, 0, 0, 0);

  // Already marked today → block
  if (last && last.getTime() === today.getTime()) {
    return new Response(JSON.stringify({
      streak: user.streak,
      alreadyMarked: true
    }), { status: 200 });
  }

  let streak = 1;

  // Yesterday?
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (last && last.getTime() === yesterday.getTime()) {
    streak = user.streak + 1;
  }

  // Update DB
  await users.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        streak,
        lastAttendance: new Date()
      }
    }
  );

  return new Response(JSON.stringify({
    streak,
    alreadyMarked: false
  }), { status: 200 });
}