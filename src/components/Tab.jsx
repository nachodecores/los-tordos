"use client";
import Link from "next/link";

export default function Tab() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-end pr-4 pointer-events-none">
      <Link
        href="/subscriptions"
        className="pointer-events-auto bg-coloryellow6 hover:bg-coloryellow4 text-colorblack font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl mobile-tab-font"
        style={{
          padding: "2vw 3vw"
        }}
      >
        QUE NO FALTE
      </Link>
    </div>
  );
}
