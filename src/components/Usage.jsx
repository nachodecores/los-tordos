export default function Usage() {
  return (
    <>
      <div className="p-20 bg-black text-white font-bold ">
        <div className="grid grid-cols-3 gap-6 [&>div]:rounded-xl [&>div]:border [&>div]:h-48  [&>div:hover]:bg-colorpurple">
          <div>Plancha</div>
          <div>Crudo para picadas</div>
          <div>Para relleno de tartas o empanadas</div>
          <div>Rallado grueso sobre una pizza</div>
          <div>Rallado fino para comer con pasta</div>
          <div>Lasqueado en el desayuno</div>
          <div>Derretido en la provolonera</div>
          <div>Derretido arriba de una hamburguesa</div>
          <div>Martín Fierro</div>
        </div>
        <p>
          Presentarlo como un grid con imágenes y que onhover explicite la forma
        </p>
      </div>
    </>
  );
}
