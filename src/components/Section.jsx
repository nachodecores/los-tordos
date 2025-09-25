import Image from "next/image";
import zlatanImage from "../../public/images/Zlatan.jpg";

export default function Section() {
  return (
    <div className="w-full h-screen bg-colorpurple4 flex justify-center items-center px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-7xl">
        {/* Texto de la cita */}
        <div className="text-center flex-1">
          <h2 className="text-coloryellow6 text-3xl md:text-6xl font-bold mb-4 md:mb-8 px-4">
            "El queso es la respuesta, 
            <br />
            cualquiera sea la pregunta"
          </h2>
          <p className="text-coloryellow2 text-lg md:text-2xl opacity-80">
            Zlatan Ibrahimovic
          </p>
        </div>

        {/* Imagen de Zlatan */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={zlatanImage}
              alt="Zlatan Ibrahimovic con queso"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
