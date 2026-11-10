"use client";
import Link from "next/link";
import Image from "next/image";
import logoinsta from "../../public/logos/logoinsta.svg";
import logofb from "../../public/logos/logofacebook.svg";

export default function Footer() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-8 bg-coloryellow1">
      <div className="flex items-center gap-6">
        <Link
          href="https://www.facebook.com/lostordosquesos"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image
            src={logofb}
            alt="Facebook - Los Tordos Quesos"
            width={26}
            height={26}
          />
        </Link>
        <Link
          href="https://www.instagram.com/lostordosquesos/"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image
            src={logoinsta}
            alt="Insta - Los Tordos Quesos"
            width={26}
            height={26}
          />
        </Link>
      </div>
    </nav>
  );
}
