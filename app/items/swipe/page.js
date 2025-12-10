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

  const [initialSlide, setInitialSlide] = useState(0);

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

      const latest = items[items.length - 1]._id;
      router.push(`/items/swipe?start=${latest}`);
    } else {
      alert(data.error || "Failed to add item");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Swiper
        initialSlide={initialSlide}
        spaceBetween={30}
        slidesPerView={1}
        className="w-screen h-screen overflow-hidden"
      >
        {items.map((item) => (
          <SwiperSlide key={item._id} className="!w-screen overflow-hidden flex justify-center">
            <ItemCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowModal(true)}
        className="fixed top-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-xl"
      >
        <HiPlus className="w-5 h-5" /> <span>Add Item</span>
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <form className="space-y-4" onSubmit={handleAddItem}>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="url"
                name="link"
                placeholder="Item Link"
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price $"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="file"
                name="picture"
                accept="image/*"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="waitTime"
                placeholder="Time to wait (dd:hh:mm)"
                className="w-full border p-2 rounded"
                required
              />

              <select
                name="category"
                className="w-full border p-2 rounded"
                required
              >
                <option value="Clothing">Clothing</option>
                <option value="Tech">Tech</option>
                <option value="Skincare">Skincare</option>
                <option value="Food">Food</option>
                <option value="Accessories">Accessories</option>
                <option value="Others">Others</option>
              </select>

              {/* Time of Impulse */}
              <select
                name="timeOfImpulse"
                className="w-full border p-2 rounded"
                required
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
              <div className="flex space-x-2">
                {["Bored", "Stressed", "Excited", "Routine", "Not sure"].map(
                  (em) => (
                    <label key={em} className="flex items-center space-x-1">
                      <input type="checkbox" name="emotion" value={em} />{" "}
                      <span>{em}</span>
                    </label>
                  )
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black"
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
