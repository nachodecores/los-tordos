import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Slider from "@/components/Slider";
// import Clients from "@/components/Clients";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Slider />
      {/* <Clients /> */}
      <Footer />
    </>
  );
}
