"use client";
import Link from "next/link";
import Image from "next/image";
import logoinsta from "../../public/logos/logoinsta.svg";
import logofb from "../../public/logos/logofacebook.svg";

function LockIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 727 954"
      fill="currentColor"
      className={className}
    >
      <path d="M636.125 318H590.688V227.143C590.688 101.76 488.908 0 363.5 0C238.092 0 136.312 101.76 136.312 227.143V318H90.875C40.8937 318 0 358.886 0 408.857V863.143C0 913.114 40.8937 954 90.875 954H636.125C686.106 954 727 913.114 727 863.143V408.857C727 358.886 686.106 318 636.125 318ZM363.5 726.857C313.519 726.857 272.625 685.971 272.625 636C272.625 586.029 313.519 545.143 363.5 545.143C413.481 545.143 454.375 586.029 454.375 636C454.375 685.971 413.481 726.857 363.5 726.857ZM504.356 318H222.644V227.143C222.644 149.46 285.802 86.3143 363.5 86.3143C441.198 86.3143 504.356 149.46 504.356 227.143V318Z" />
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
