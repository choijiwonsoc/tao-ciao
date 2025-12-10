"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function ItemsSwiper() {
  const [items, setItems] = useState([]);
  const params = useSearchParams();
  const startId = params.get("start");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [reload, setReload] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const u = JSON.parse(stored);
    setUser(u);

    fetch(`/api/items/getItems?userId=${u._id}`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || [];
        setItems(items);

        const index = items.findIndex((i) => i._id === startId);
        setInitialSlide(index >= 0 ? index : 0);
      });
  }, []);

  if (items.length === 0) return <p>No items yet.</p>;

  const prevItem = () => {
    setCurrentIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  };

  // Move to next item
  const nextItem = () => {
    setCurrentIndex((i) => (i === items.length - 1 ? 0 : i + 1));
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Handle adding new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const price = parseFloat(form.price.value);
    const link = form.link.value;
    let base64Image = "";
    if (form.picture.files[0]) {
      base64Image = await fileToBase64(form.picture.files[0]);
    }
    const status = "waiting";
    const waitTime = form.waitTime.value;
    const emotion =
      Array.from(form.emotion)

        .filter((i) => i.checked)
        .map((i) => i.value)
        .join(",") || "Not sure";
    const category = form.category.value;
    const timeOfImpulse = form.timeOfImpulse.value;

    const res = await fetch("/api/items/create", {
      method: "POST",
      body: JSON.stringify({
        userId: user._id,
        name,
        picture: base64Image,
        link,
        price,
        status: "waiting",
        waitTime,
        emotion,
        category,
        timeOfImpulse,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      setItems((prev) => [...prev, data]);
      setShowModal(false);
      setReload((prev) => prev + 1);
      const updatedUser = {
        ...user,
        items: [...user.items, data._id],
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      form.reset();

      router.push(`/items/swipe?start=${data.itemId}`);
    } else {
      alert(data.error || "Failed to add item");
    }
  };

  return (
    <div className="relative w-screen flex flex-col items-center justify-center ">
      {/* Floating Add Button */}
      <Button
        onClick={() => setShowModal(true)}
        className="fixed z-50 top-5 right-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                 p-4 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md"
      >
        <HiPlus className="w-5 h-5" /> <span>Add Item</span>
      </Button>

      {/* LEFT BUTTON */}
      <button
        onClick={prevItem}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg"
      >
        ◀
      </button>

      {/* CURRENT ITEM */}
      <div className="w-full max-w-xl">
        <ItemCard item={items[currentIndex]} />
      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextItem}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg"
      >
        ▶
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Dim background */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal container */}
          <div
            className="
      relative w-full max-w-md 
      bg-white/90 backdrop-blur-xl 
      rounded-3xl shadow-2xl 
      p-6 space-y-5 animate-[fadeIn_0.2s_ease-out]
    "
          >
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Add Item
            </h2>

            <form className="space-y-5" onSubmit={handleAddItem}>
              {/* Inputs */}
              <div className="space-y-3">
                <input
                  name="name"
                  placeholder="Item Name"
                  required
                  className="native-input"
                />
                <input
                  type="url"
                  name="link"
                  placeholder="Product Link"
                  className="native-input"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price $"
                  required
                  className="native-input"
                />
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  className="native-input"
                />
                <input
                  name="waitTime"
                  placeholder="Wait Time (dd:hh:mm)"
                  required
                  className="native-input"
                />

                <select name="category" className="native-input" required>
                  <option value="Clothing">Clothing</option>
                  <option value="Tech">Tech</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Food">Food</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Others">Others</option>
                </select>

                <select name="timeOfImpulse" className="native-input" required>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              {/* Emotion Pills */}
              <div className="space-y-2">
                <p className="text-gray-800 font-medium text-sm">Emotion</p>
                <div className="flex flex-wrap gap-2">
                  {["Bored", "Stressed", "Excited", "Routine", "Not sure"].map(
                    (em) => (
                      <label
                        key={em}
                        className="
                flex items-center px-3 py-1.5 rounded-full 
                bg-gray-200/60 text-gray-900 text-sm 
                shadow-inner active:scale-95
              "
                      >
                        <input
                          type="checkbox"
                          name="emotion"
                          value={em}
                          className="mr-1"
                        />
                        {em}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold shadow-lg active:scale-[0.98]"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
