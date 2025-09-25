import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Tab from "@/components/Tab";

export default function Subscriptions() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-colorpurple4 pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-coloryellow6 text-6xl font-bold mb-6">
              Suscripciones
            </h1>
            <p className="text-coloryellow2 text-2xl max-w-3xl mx-auto">
              Descubre nuestros planes de suscripción para disfrutar de los mejores quesos artesanales de Los Tordos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan Básico */}
            <div className="bg-colorwhite rounded-xl p-8 text-center shadow-lg">
              <h3 className="text-colorblack text-3xl font-bold mb-4">Plan Básico</h3>
              <div className="text-coloryellow4 text-4xl font-bold mb-6">$2,500</div>
              <ul className="text-colorblack space-y-3 mb-8">
                <li>✓ 2 quesos artesanales por mes</li>
                <li>✓ Envío gratis</li>
                <li>✓ Recetas exclusivas</li>
                <li>✓ Soporte por email</li>
              </ul>
              <button className="bg-coloryellow6 hover:bg-coloryellow4 text-colorblack font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105">
                Suscribirse
              </button>
            </div>

            {/* Plan Premium */}
            <div className="bg-coloryellow6 rounded-xl p-8 text-center shadow-lg transform scale-105 border-4 border-coloryellow2">
              <div className="bg-coloryellow2 text-coloryellow5 px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                MÁS POPULAR
              </div>
              <h3 className="text-colorblack text-3xl font-bold mb-4">Plan Premium</h3>
              <div className="text-coloryellow5 text-4xl font-bold mb-6">$4,500</div>
              <ul className="text-colorblack space-y-3 mb-8">
                <li>✓ 4 quesos artesanales por mes</li>
                <li>✓ Envío gratis</li>
                <li>✓ Recetas exclusivas</li>
                <li>✓ Degustaciones especiales</li>
                <li>✓ Soporte prioritario</li>
                <li>✓ Descuentos en tienda</li>
              </ul>
              <button className="bg-colorblack hover:bg-coloryellow5 text-colorwhite font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105">
                Suscribirse
              </button>
            </div>

            
          </div>

          
        </div>
      </div>
    </>
  );
}
