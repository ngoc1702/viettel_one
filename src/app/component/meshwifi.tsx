"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

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

export default function MESH_WIFI({ posts = [] }: { posts: Post[] }) {
  const subCategoryTitles = [
    ...new Set(
      (posts ?? []).flatMap((post) =>
        post.sub_categories?.map((sub) => sub.title) ?? []
      )
    ),
  ];

  return (
    <div className="max-content py-20 mx-auto">
      <h1 className="text-black uppercase mb-6">
        Các gói cước tốc độ cao, tích hợp giải pháp Mesh wifi
      </h1>

      <div className="content block">
        {subCategoryTitles.map((title) => {
          const filteredPosts = posts.filter(
            (post: Post) =>
              post.sub_categories?.some(
                (subCategory: Sub_Category) => subCategory.title === title
              )
          );
          console.log("🎯 All subCategoryTitles:", subCategoryTitles);
          if (filteredPosts.length === 0) return null;

          return (
            <div className="mt-4" key={title}>
              <h3 className="uppercase font-semibold text-neutral-700 text-[20px] leading-[40px] mb-2">
                Gói cước {title}
              </h3>

              <Swiper
                spaceBetween={8}
                slidesPerView={4}
                autoplay={{ delay: 100 }}
                freeMode={true}
                modules={[FreeMode]}
                className="mySwiper"
              >
                {filteredPosts.map((post: Post) => (
                  <SwiperSlide
                    key={post._id}
                    className="flex justify-center items-center"
                  >
                    <div className="w-full">
                      <div className="min-h-[265px] justify-between items-center h-full p-4 rounded-[40px] flex flex-col relative bg-white light-pink-shadow my-2 mx-[2px]">
                        <a
                          href={`/package/${post?.slug.current}`}
                          aria-label="Xem chi tiết"
                        >
                          <span className="bg-[#CE2127] text-white px-3 py-1 text-sm font-bold tracking-tight absolute right-[50%] translate-x-1/2 top-0 rounded-b-[15px]">
                            {post?.title}
                          </span>
                        </a>

                            {/* Traffic and Free info */}
                            <h1 className="mt-6 text-lg font-bold text-gray-900 leading-none flex items-end pb-2 mb-2 border-b border-gray-200">
                              <span className="text-[#CE2127] mb-1">
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
                            {/* Price and Time */}
                            <h2 className="mt-2 font-bold text-gray-900 leading-none flex items-end pb-1 mb-2 border-b border-gray-200">
                              <span className="text-lg text-gray-900">
                                {post?.price}
                              </span>
                              <span className="text-sm ml-1 mb-1 font-semibold text-gray-900">
                                /{post?.time}
                              </span>
                            </h2>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                              <button className="text-sm flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-4 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold">
                                <a
                                  aria-label="Xem chi tiết"
                                  className="w-full h-full flex items-center justify-center"
                                  href={`sms:290?body=${encodeURIComponent(`${post.title} ${post.globalField}`)}`}
                                >
                                  Đăng ký
                                </a>
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              );
            })}
          </div>
        </div>
  );
}