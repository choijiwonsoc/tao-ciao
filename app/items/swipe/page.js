// app/items/swipe/page.js
import { Suspense } from "react";
import ItemsSwiper from "./ItemsSwiper";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ItemsSwiper />
    </Suspense>
  );
}
