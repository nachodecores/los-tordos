"use client";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import image1 from "../../public/images/image1.jpg";
import image2 from "../../public/images/image2.jpg";
import image3 from "../../public/images/image3.jpg";
import image4 from "../../public/images/image4.jpg";
import image5 from "../../public/images/image5.jpg";
import image6 from "../../public/images/image6.jpg";
import image7 from "../../public/images/image7.jpg";
import image8 from "../../public/images/image8.jpg";
import image9 from "../../public/images/image9.jpg";

export default function Slider() {
  var settings = {
    adaptiveHeight: true,
    arrows: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToScroll: 1,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <div className="flex flex-col justify-evenly h-96 bg-gray-200 text-colorpurple5 text-6xl">
      <h3 className="self-start ms-10">Tostalo, fundilo, rallalo, picalo...</h3>
      <Slick {...settings} className="w-full">
        <Image src={image1} alt="Imagen uno" className="h-1/2" />

        <Image src={image2} alt="Imagen uno" className="h-1/2" />

        <Image src={image3} alt="Imagen uno" className="h-1/2" />

        <Image src={image4} alt="Imagen uno" className="h-1/2" />

        <Image src={image5} alt="Imagen uno" className="h-1/2" />

        <Image src={image6} alt="Imagen uno" className="h-1/2" />

        <Image src={image7} alt="Imagen uno" className="h-1/2" />

        <Image src={image8} alt="Imagen uno" className="h-1/2" />

        <Image src={image9} alt="Imagen uno" className="h-1/2" />
      </Slick>
      <h3 className="self-end me-10">...tenés queso</h3>
    </div>
  );
}
