"use client";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import image1 from "../../public/image1.jpg";
import image2 from "../../public/image2.jpg";
import image3 from "../../public/image3.jpg";
import image4 from "../../public/image4.jpg";
import image5 from "../../public/image5.jpg";
import image6 from "../../public/image6.jpg";
import image7 from "../../public/image7.jpg";
import image8 from "../../public/image8.jpg";
import image9 from "../../public/image9.jpg";

export default function Slider() {
  var settings = {
    adaptiveHeight: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  return (
    <Slick {...settings}>
      <div className="w-full h-1/2">
        <Image src={image1} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image2} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image3} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image4} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image5} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image6} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image7} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image8} alt="Imagen uno" />
      </div>
      <div className="w-full h-1/2">
        <Image src={image9} alt="Imagen uno" />
      </div>
    </Slick>
  );
}
