"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function ItemCard({ item }) {
  const router = useRouter();

  const [countdown, setCountdown] = useState("00:00:00");
  const [finish, setFinish] = useState(null);

  // COUNTDOWN EFFECT
  useEffect(() => {
    if (!item) return;

    // Parse `dd:hh:mm`
    const [d, h, m] = item.waitTime.split(":").map(Number);
    const waitMs = (d * 24 * 60 + h * 60 + m) * 60 * 1000;

    const created = new Date(item.createdAt);
    const deadline = created.getTime() + waitMs;

    // Human readable finish date
    setFinish(
      new Date(deadline).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    // Start countdown
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setCountdown("00:00:00");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(
          2,
          "0"
        )}:${String(secs).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [item]);

  // UPDATE STATUS
  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch("/api/items/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item._id,
          status: newStatus,
        }),
      });

      const data = await res.json();
      console.log(data);

      // Optional navigation
      // router.push("/items");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      //style={{ backgroundImage: "url('/animations/melting.gif')" }}
    >
      <Card className="p-6 sm:p-8 w-full max-w-xl bg-white/30 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/40">
        {/* IMAGE */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-sm">
            <img
              src={item.picture || "/cart.png"}
              alt={item.name}
              className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-lg"
            />
            <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
              {item.category || "Item"}
            </span>
          </div>
        </div>

        {/* ITEM NAME */}
        <div className="mt-6 text-center space-y-2">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            {item.name}
          </h2>
          <p className="text-xl font-semibold text-white/90">${item.price}</p>
        </div>

        {/* COUNTDOWN */}
        {item.status === "waiting" && (
          <div className="mt-6 bg-white/40 backdrop-blur-sm p-4 rounded-xl shadow-inner text-center border border-white/30">
            <p className="text-gray-100 text-sm">⏳ Countdown Ends</p>
            <p className="text-4xl font-bold text-white mt-1">{countdown}</p>
          </div>
        )}

        {/* DETAILS */}
        <div className="mt-6 space-y-1 text-center text-white">
          <p
            className={`font-semibold ${
              item.status === "stopped"
                ? "text-green-200"
                : "text-yellow-200"
            }`}
          >
            Status: {item.status}
          </p>

          <p>Time left to buy: {finish}</p>
          <p>Emotion: {item.emotion}</p>
          <p>Time of Impulse: {item.timeOfImpulse}</p>
          <p className="mb-2">Category: {item.category}</p>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline hover:text-blue-200"
            >
              View Product →
            </a>
          )}
        </div>

        {/* COMMENTS */}
        <div className="mt-6 bg-white/30 backdrop-blur-md p-4 rounded-xl border border-white/30">
          {item.comments?.length > 0 ? (
            item.comments.map((c, i) => (
              <div key={i} className="mb-3 border-b border-white/30 pb-2">
                <p className="font-semibold text-white">{c.authorName}</p>
                <p className="text-white/80 text-sm">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-white/80 text-center">No comments yet.</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            className="bg-red-500/80 hover:bg-red-500 text-white w-full"
            onClick={() => updateStatus("bought")}
          >
            Mark as Bought
          </Button>

          <Button
            className="bg-green-500/80 hover:bg-green-500 text-white w-full"
            onClick={() => updateStatus("stopped")}
          >
            Forgo Purchase
          </Button>
        </div>
      </Card>
    </div>
  );
}
