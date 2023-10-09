"use client";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../../public/asado.jpg";
import image2 from "../../public/asado2.jpg";
import image3 from "../../public/postre.jpg";

export default function Slider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <Slick {...settings}>
      <div
        style={{ backgroundImage: `url('${image1}')` }}
        className="bg-slate-400 w-full h-[100vh]"
      >
        1
      </div>
      <div className="bg-slate-600 w-full h-[100vh]">1</div>
      <div className="bg-slate-800 w-full h-[100vh]">1</div>
      {/* <div
        style={{ backgroundImage: `url('${image1}')` }}
        className="h-[100vh] w-full bg-cover bg-center"
      ></div>
      <div
        style={{ backgroundImage: `url('${image2}')` }}
        className="relative h-[100vh] w-full bg-cover bg-center tablet:bg-fixed grid justify-center tablet:justify-end items-end"
      ></div>
      <div
        style={{ backgroundImage: `url('${image3}')` }}
        className="relative h-[100vh] w-full bg-cover bg-center tablet:bg-fixed grid justify-center tablet:justify-end items-end"
      ></div> */}
    </Slick>
  );
}
