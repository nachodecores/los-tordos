"use client";
import Link from "next/link";

export default function Tab() {
  return (
    <div 
      className="fixed z-50"
      style={{
        bottom: "0vw",
        right: "0vw"
      }}
    >
      <Link 
        href="/subscriptions"
        className="bg-coloryellow6 hover:bg-coloryellow4 text-colorblack font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl mobile-tab-font"
        style={{
          padding: "2vw 3vw"
        }}
      >
        QUE NO FALTE
      </Link>
    </div>
  );
}
