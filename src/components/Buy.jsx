import Link from "next/link";

export default function Buy() {
  return (
    <section className="h-80 flex justify-center items-center text-xl font-bold text-colorpurple">
      <Link href={"/pedido"}>Encargá tu horma</Link>
    </section>
  );
}
