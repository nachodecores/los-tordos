"use client";
import Link from "next/link";
import Image from "next/image";
import logochico from "../../public/logos/logochico.svg";
import logoinsta from "../../public/logos/logoinsta.svg";
import logofb from "../../public/logos/logofacebook.svg";

export default function Footer() {
  return (
    <nav className="flex justify-center items-center px-10 py-6 bg-coloryellow1">
      <Link href="https://www.facebook.com/lostordosquesos">
        <Image
          src={logofb}
          alt="Facebook - Los Tordos Quesos"
          width={30}
          height={30}
          className="mx-8"
        />
      </Link>
      <Image
        src={logochico}
        alt="Logo Los Tordos Quesos"
        width={20}
        height={20}
        className="mx-8"
      />
      <Link href="https://www.instagram.com/lostordosquesos/">
        <Image
          src={logoinsta}
          alt="Insta - Los Tordos Quesos"
          width={30}
          height={30}
          className="mx-8"
        />
      </Link>
    </nav>
  );
}
