"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import banner1 from "@public/assets/img/Banner1.webp";
import banner2 from "@public/assets/img/Banner2.webp";

export default function Banner() {
  return (
    <div className="slider-container mt-[77px] md:mt-[90px] z-1">
      <Swiper
      effect="slide" 
        spaceBetween={50}
        slidesPerView={1}
        loop={true} 
        autoplay={{
          delay: 3000, 
          disableOnInteraction: false, 
        }}
        
      >
        <SwiperSlide>
  <Image
    src={banner1}
    alt="Slide 1"
    width={1920}
    height={600}
    className="w-full h-auto object-cover"
    priority
    sizes="(max-width: 768px) 100vw, 1920px"
/>
</SwiperSlide>
<SwiperSlide>
  <Image
    src={banner2}
    alt="Slide 2"
    width={1920}
    height={600}
    className="w-full h-auto object-cover"
    loading="lazy" // ✅ các ảnh khác lazy thôi
/>
</SwiperSlide>

      </Swiper>
    </div>
  );
}
