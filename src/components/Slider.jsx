"use client";
import { useState, useEffect, useRef } from "react";
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
  const [scrollY, setScrollY] = useState(0);
  const sliderRef = useRef(null);

  const images = [
    { src: image1, alt: "Queso Los Tordos 1", speed: 0.05, size: "w-[26vw] h-[26vw]" }, //provo
    { src: image2, alt: "Queso Los Tordos 2", speed: 0.8, size: "w-[40vw] h-[40vw]" }, //ensalada
    { src: image3, alt: "Queso Los Tordos 3", speed: 0.25, size: "w-[31.2vw] h-[31.2vw]" },
    { src: image4, alt: "Queso Los Tordos 4", speed: 0.6, size: "w-[24.7vw] h-[24.7vw]" },
    { src: image5, alt: "Queso Los Tordos 5", speed: 0.35, size: "w-[28.6vw] h-[28.6vw]" },
    { src: image6, alt: "Queso Los Tordos 6", speed: 0.02, size: "w-[31.2vw] h-[31.2vw]" },
    { src: image7, alt: "Queso Los Tordos 7", speed: 0.45, size: "w-[26vw] h-[26vw]" },
    { src: image8, alt: "Queso Los Tordos 8", speed: 0.7, size: "w-[27.3vw] h-[27.3vw]" },
    { src: image9, alt: "Queso Los Tordos 9", speed: 0.15, size: "w-[31.2vw] h-[31.2vw]" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current && typeof window !== 'undefined') {
        const rect = sliderRef.current.getBoundingClientRect();
        const elementScrollY = Math.max(0, window.scrollY - rect.top);
        setScrollY(elementScrollY);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div 
      ref={sliderRef} 
      className="w-full relative overflow-x-hidden overflow-y-visible"
      style={{
        height: "150vh",
        backgroundImage: "url('/images/sinfingris.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "10vw",
        backgroundColor: "#fef3c7"
      }}
    >
      {images.map((image, index) => {
        // Posiciones distribuidas uniformemente en toda la altura
        const positions = [
          { top: '5%', left: '5%' }, //provo
          { top: '10%', left: '45%' }, //ensalada
          { top: '40%', left: '30%' }, //hamburguesa
          { top: '35%', left: '80%' }, //tostada
          { top: '88%', left: '4%' }, //pizza
          { top: '55%', left: '60%' },
          { top: '55%', left: '8%' },
          { top: '75%', left: '78%' }, //tarta
          { top: '95%', left: '30%' } //scones
        ];
        
        const position = positions[index];
        
        return (
          <div
            key={index}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              transform: `translateY(${-scrollY * image.speed}px)`,
              willChange: 'transform'
            }}
          >
            <div className={`${image.size} rounded-full overflow-hidden mobile-scale`}>
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
