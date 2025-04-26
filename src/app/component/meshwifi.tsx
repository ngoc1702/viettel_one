"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay  } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import REGISTRATION_FORM from "./registration_form";

interface Category {
  title: string;
}
interface Sub_Category {
  title: string;
}
interface Image {
  asset: {
    url: string;
    _id: string;
  };
  caption?: string;
}
interface Post {
  _id: number;
  slug: {
    current: string;
  };
  title: string;
  traffic: string;
  timeTraffic: string;
  time: string;
  price: string;
  globalField: string;
  categories: Category[];
  sub_categories: Sub_Category[];
  gallery: Image[];
}
declare global {
  interface Window {
    dataLayer: { event: string; [key: string]: unknown }[];
  }
}

export default function MESH_WIFI({ posts }: { posts: Post[] }) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  // Lọc các posts có category là "Internet"
  const filteredPosts = posts.filter((post: Post) =>
    post.categories?.some((category: Category) => category.title === "Mesh wifi")
  );

  return (
    <>
      <div className="max-content px-3 md:px-0 py-20 z-1">
        <div className="flex justify-between items-center">
          <h1 className="text-black uppercase mb-6">
            Các gói cước tốc độ cao, tích hợp giải pháp Mesh wifi
          </h1>
        </div>

        <div className="content block">
          {filteredPosts.length > 0 && (
            <div className="mt-4 md:mt-6">
              {/* <h3 className="uppercase font-semibold text-neutral-700 text-[20px] md:text-[32px] leading-[40px] mb-2 md:mb-4">
                Gói cước Internet
              </h3> */}

              <Swiper
                freeMode={true}
                autoplay={{ delay: 2000 }}
                modules={[FreeMode, Autoplay]}
                breakpoints={{
                  0: {
                    slidesPerView: 2.2,
                    spaceBetween: 8,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 32,
                  },
                }}
                className="mySwiper"
              >
                {filteredPosts.map((post: Post) => (
                  <SwiperSlide key={post._id} className="flex justify-center items-center">
                    <div className="w-full">
                      <div className="min-h-[265px] md:min-h-[370px] justify-between items-center h-full md:p-6 p-4 rounded-[40px] flex flex-col relative bg-white light-pink-shadow my-2 mx-[2px]">
                        <a href={`/package/${post?.slug.current}`}>
                          <span className="bg-[#CE2127] text-white px-3 py-1 text-sm md:text-2xl font-bold tracking-tight absolute right-[50%] translate-x-1/2 top-0 rounded-b-[15px]">
                            {post?.title}
                          </span>
                        </a>

                        <h1 className="mt-6 text-lg font-bold text-gray-900 leading-none flex items-end pb-2 mb-2 border-b border-gray-200">
                          <span className="text-[#CE2127] mb-1 md:mb-0 md:text-4xl">
                            {post?.traffic}
                          </span>
                          {post?.timeTraffic && (
                            <span className="text-base ml-1 font-semibold text-gray-900">
                              / {post?.timeTraffic}
                            </span>
                          )}
                        </h1>

                        {post?.gallery?.length > 0 && (
                          <>
                            <h2 className="text-base tracking-widest title-font mb-1 font-medium">
                              MIỄN PHÍ
                            </h2>
                            <span className="mt-2 flex gap-2 bg-white border-[1px] border-solid border-gray-200 text-white px-4 py-2 text-2xl font-bold tracking-tight rounded-full">
                              {post.gallery.map((image: Image) => (
                                <div key={image.asset._id}>
                                  <Image
                                    loading="lazy"
                                    src={image.asset.url}
                                    alt={image.caption || "Gallery Image"}
                                    width={30}
                                    height={30}
                                    style={{ objectFit: "cover" }}
                                  />
                                  {image.caption && <p>{image.caption}</p>}
                                </div>
                              ))}
                            </span>
                          </>
                        )}

                        <h2 className="mt-2 font-bold text-gray-900 leading-none flex items-end pb-1 mb-2 border-b border-gray-200">
                          <span className="text-lg md:text-3xl text-gray-900">
                            {post?.price}
                          </span>
                          <span className="text-sm md:text-base ml-1 mb-1 font-semibold text-gray-900 md:uppercase">
                            /{post?.time}
                          </span>
                        </h2>

                        <div className="hidden md:flex gap-6">
                          <button
                            onClick={togglePopup}
                            className="flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-6 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
                          >
                            Đăng ký
                          </button>
                          <a href={`/package/${post?.slug.current}`} aria-label="Xem chi tiết gói cước">
                            <button className="min-w-[100px] flex justify-center items-center gap-1 text-center text-[#CE2127] bg-[#FFFFFF] border-[#CE2127] border-[1px] py-2 focus:outline-none hover:bg-gray-100 rounded-[25px] font-semibold">
                              Chi tiết
                            </button>
                          </a>
                        </div>

                        <div className="md:hidden flex flex-col gap-2">
                          <button
                            onClick={togglePopup}
                            className="text-sm flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-4 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
                          >
                            <a className="w-full h-full flex items-center justify-center">Đăng ký</a>
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 md:p-16 relative md:min-w-[800px] mx-2">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <REGISTRATION_FORM />
          </div>
        </div>
      )}
    </>
  );
}

