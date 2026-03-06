"use client";
import Link from "next/link";
import Image from "next/image";
import logoinsta from "../../public/logos/logoinsta.svg";
import logofb from "../../public/logos/logofacebook.svg";

function LockIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v2.25a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-coloryellow1">
      <div className="flex items-center">
        <Link href="https://www.facebook.com/lostordosquesos">
          <Image
            src={logofb}
            alt="Facebook - Los Tordos Quesos"
            width={30}
            height={30}
            className="mr-6"
          />
        </Link>
        <Link href="https://www.instagram.com/lostordosquesos/">
          <Image
            src={logoinsta}
            alt="Insta - Los Tordos Quesos"
            width={30}
            height={30}
          />
        </Link>
      </div>
      <Link
        href="/admin"
        className="text-colorpurple4 hover:text-colorpurple5 transition-colors"
        title="Admin"
      >
        <LockIcon />
      </Link>
    </nav>
  );
}
