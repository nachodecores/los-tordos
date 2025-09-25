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
    { src: image1, alt: "Queso Los Tordos 1", speed: 0.1, size: "w-[26vw] h-[26vw]" },
    { src: image2, alt: "Queso Los Tordos 2", speed: 0.05, size: "w-[23.4vw] h-[23.4vw]" },
    { src: image3, alt: "Queso Los Tordos 3", speed: 0.15, size: "w-[31.2vw] h-[31.2vw]" },
    { src: image4, alt: "Queso Los Tordos 4", speed: 0.08, size: "w-[24.7vw] h-[24.7vw]" },
    { src: image5, alt: "Queso Los Tordos 5", speed: 0.12, size: "w-[28.6vw] h-[28.6vw]" },
    { src: image6, alt: "Queso Los Tordos 6", speed: 0.03, size: "w-[20.8vw] h-[20.8vw]" },
    { src: image7, alt: "Queso Los Tordos 7", speed: 0.18, size: "w-[26vw] h-[26vw]" },
    { src: image8, alt: "Queso Los Tordos 8", speed: 0.2, size: "w-[27.3vw] h-[27.3vw]" },
    { src: image9, alt: "Queso Los Tordos 9", speed: 0.02, size: "w-[22.1vw] h-[22.1vw]" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current && typeof window !== 'undefined') {
        const rect = sliderRef.current.getBoundingClientRect();
        const elementScrollY = window.scrollY - rect.top;
        setScrollY(elementScrollY);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
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
        height: "200vh",
        backgroundColor: "#fef3c7"
      }}
    >
      {images.map((image, index) => {
        // Posiciones distribuidas uniformemente en toda la altura
        const positions = [
          { top: '5%', left: '10%' },
          { top: '15%', left: '70%' },
          { top: '25%', left: '30%' },
          { top: '35%', left: '80%' },
          { top: '45%', left: '20%' },
          { top: '55%', left: '60%' },
          { top: '65%', left: '40%' },
          { top: '75%', left: '90%' },
          { top: '85%', left: '50%' }
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
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className={`${image.size} rounded-full overflow-hidden`}>
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
