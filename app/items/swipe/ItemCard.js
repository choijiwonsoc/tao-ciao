"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ItemCard({ item }) {
  const [countdown, setCountdown] = useState("00:00:00");
  const [finish, setFinish] = useState(null);
  const [progress, setProgress] = useState(0);

  /* ---------------- COUNTDOWN LOGIC ---------------- */
  useEffect(() => {
    if (!item) return;

    const [d, h, m] = item.waitTime.split(":").map(Number);
    const waitMs = (d * 24 * 60 + h * 60 + m) * 60 * 1000;
    const created = new Date(item.createdAt);
    const deadline = created.getTime() + waitMs;

    setFinish(
      new Date(deadline).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = deadline - now;

      const total = deadline - created.getTime();
      const elapsed = now - created.getTime();
      const ratio = Math.min(Math.max(elapsed / total, 0), 1);
      setProgress(ratio * 100);

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

  /* ---------------- STATUS UPDATE ---------------- */
  const updateStatus = async (newStatus) => {
    await fetch("/api/items/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item._id, status: newStatus }),
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex justify-center w-full px-4 py-6 overflow-hidden">
      <div
        className="
        w-full max-w-md 
        rounded-3xl shadow-2xl border border-white/30 
        bg-white/20 backdrop-blur-xl
        p-6 space-y-6
      "
      >
        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={item.picture || "/cart.png"}
            alt={item.name}
            className="w-full max-w-xs h-56 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* TITLE + PRICE */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-black drop-shadow">
            {item.name}
          </h2>
          <p className="text-lg text-black/90 font-medium">${item.price}</p>
          <span className="inline-block mt-1 bg-white/30 px-3 py-1 text-sm rounded-full text-black/90">
            {item.category}
          </span>
        </div>
        {item.status === "waiting" && (
          <div className="w-full bg-white/20 backdrop-blur-md rounded-full h-10 border border-white/30 overflow-hidden shadow-inner">
            <div className="relative w-full h-10 bg-white/30 backdrop-blur-md rounded-full overflow-hidden border border-white/30">
              {/* Filled section */}
              <div
                className="h-full bg-gradient-to-r from-pink-300/80 via-red-300/80 to-yellow-200/80 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>

              {/* Melting GIF icon */}
              <img
                src="/animations/melting.gif"
                alt="cursor"
                className="
    absolute 
    top-[-2px] 
    w-10 h-10 
    pointer-events-none 
    transition-all duration-500
    rounded-full 
    object-cover
    overflow-hidden
    border border-white/40
    shadow-md
  "
                style={{
                  left: `calc(${progress}% - 20px)`, // centers the gif at the end
                }}
              />
            </div>
          </div>
        )}

        {item.status === "waiting" && (
          <p className="text-center text-sm text-black/70 mt-1">
            {progress.toFixed(0)}% completed
          </p>
        )}

        {/* COUNTDOWN */}
        {item.status === "waiting" && (
          <div
            className="
            bg-white/25 p-4 rounded-xl 
            text-center border border-white/30 shadow-inner
          "
          >
            <p className="text-black/80 text-sm">⏳ Countdown Ends</p>
            <p className="text-3xl font-bold text-black mt-1">{countdown}</p>
          </div>
        )}

        {/* DETAILS */}
        <div className="text-black/90 text-center space-y-1">
          <p>Status: {item.status}</p>
          <p>Time left: {finish}</p>
          <p>Emotion: {item.emotion}</p>
          <p>Impulse: {item.timeOfImpulse}</p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              className="text-blue-200 underline hover:text-blue-100 block mt-1"
            >
              View product →
            </a>
          )}
        </div>

        {/* COMMENTS */}
        <div
          className="
          bg-white/20 p-4 rounded-xl 
          border border-white/25 backdrop-blur-md
          max-h-36 overflow-y-auto
        "
        >
          {item.comments?.length > 0 ? (
            item.comments.map((c, i) => (
              <div key={i} className="mb-3 border-b border-white/20 pb-2">
                <p className="text-black font-semibold">{c.authorName}</p>
                <p className="text-black/80 text-sm">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-black/80 text-center">No comments yet.</p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          <Button
            className="bg-red-500/80 hover:bg-red-500 text-black w-full"
            onClick={() => updateStatus("bought")}
          >
            Mark as Bought
          </Button>

          <Button
            className="bg-green-500/80 hover:bg-green-500 text-black w-full"
            onClick={() => updateStatus("stopped")}
          >
            Forgo Purchase
          </Button>
        </div>
      </div>
    </div>
  );
}
