import Image from "next/image";
import Link from "next/link";
import provaca from "../../public/logos/provaca.svg";
import morondanga from "../../public/logos/morondanga.svg";
import osopardo from "../../public/logos/osopardo.svg";
import gourmeat from "../../public/logos/gourmeat.svg";

export default function Clients() {
  return (
    <>
      <div className="p-20 bg-colorpurple4 text-colorpurple5 font-bold ">
        <h2 className="pb-8 text-coloryellow2">
          Gente que trata bien a nuestros quesos...
        </h2>
        <div className="w-2/3 bg-colorpurple2 rounded-2xl grid grid-cols-3 gap-4 [&>div]:rounded-xl [&>div]:border [&>div]:h-40 [&>div]:w-40 [&>div:hover]:bg-coloryellow1 [&>div]:flex [&>div]:justify-center [&>div]:items-center">
          <div>
            <Link href={""}>
              <Image
                src={provaca}
                alt="Provaca - Los Tordos Quesos Artesanales"
                height={100}
              />
            </Link>
          </div>
          <div>
            <Link href={""}>
              <Image
                src={morondanga}
                alt="Morondanga - Los Tordos Quesos Artesanales"
                height={100}
              />
            </Link>
          </div>
          <div>
            <Link href={""}>
              <Image
                src={osopardo}
                alt="Oso Pardo - Los Tordos Quesos Artesanales"
                height={100}
              />
            </Link>
          </div>
          <div>
            <Link href={""}>
              <Image
                src={gourmeat}
                alt="Gourmeat - Los Tordos Quesos Artesanales"
                height={100}
              />
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Chiringuito</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Aleman</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>La Vaca</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Pantera</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Nuevo Pocitos</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Otro Cliente</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Otro Cliente</p>
            </Link>
          </div>
          <div>
            <Link href={""}>
              <p>Otro Cliente</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
