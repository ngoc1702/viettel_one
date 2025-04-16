"use client";
import { client } from "../(sanity)/lib/client";
import React, { useState, useEffect } from "react";
import { POSTS_QUERY } from "../(sanity)/lib/queries";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

interface Category {
  title: string;
}
interface Post {
  sort(arg0: (a: number, b: number) => number): unknown;
  _id: number;
  slug: {
    current: string;
  };
  title: string;
  categories: Category[];
  _createdAt: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  authorName: string;
}
export default function POSTS() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts: Post[] = await client.fetch(POSTS_QUERY);

        if (!posts) {
          throw new Error("Failed to fetch posts");
        }
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        console.log("Fetch posts process complete");
      }
    };

    fetchPosts();
  }, []);
  return (
    <section className="text-gray-600 body-font max-content ">
      <div className="container px-3 py-16 md:py-20 mx-auto">
        <div className="flex justify-between">
          <h1 className="uppercase font-bold text-[45px] leading-[80px] max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
            <span className=" text-[#141718]">Tin tức</span>
          </h1>
          <a href="/news" aria-label="Xem tất cả">
            <button className="min-w-[120px] flex justify-center items-center gap-1 text-center text-[#CE2127] bg-[#FFFFFF] border-[#CE2127] border-[1px] py-2 focus:outline-none hover:bg-gray-100 rounded-[25px] font-semibold">
              Xem tất cả
            </button>
          </a>
        </div>
        <div className="md:grid md:grid-cols-3 hidden -m-4 mt-2">
          {posts &&
            posts
              .sort(
                (a, b) =>
                  new Date(b._createdAt).getTime() -
                  new Date(a._createdAt).getTime()
              )
              .slice(0, 3)
              .map((post: Post) => (
                <div key={post._id}>
                  <div className="p-4 ">
                    <div className="h-full  border-opacity-60 rounded-lg overflow-hidden bg-white box-shadow-basic">
                      <div className="relative w-full lg:h-60 md:h-36 h-36">
                        <Image
                          src={post.mainImage?.asset?.url}
                          alt="blog"
                          fill
                          className="object-cover object-center"
                          sizes="100vw"
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between">
                          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                            {post.categories
                              ?.map((cat: Category) => cat.title)
                              .join(", ") || "No categories"}
                          </h2>
                          <p className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                            {new Date(post?._createdAt)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")}
                          </p>
                        </div>
                        <h1 className="mt-2 title-font text-lg font-medium text-gray-900 mb-3 md:h-[55px] line-clamp-2">
                          <a aria-label="Xem chi tiết"
                            className="hover:text-[#CE2127]"
                            href={`/posts/${post?.slug.current}`}
                          >
                            {post?.title}
                          </a>
                        </h1>

                        <p className="mt-1  italic leading-relaxed mb-3">
                          {post.authorName || "No author"}
                        </p>
                        <div className="flex items-center flex-wrap ">
                          <a aria-label="Xem chi tiết"
                            href={`/posts/${post?.slug.current}`}
                            className="text-[#CE2127] inline-flex items-center md:mb-2 lg:mb-0"
                          >
                            <span>Xem thêm </span>
                            <svg
                              className="w-4 h-4 ml-2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5l7 7-7 7" />
                            </svg>
                          </a>
                          {/* <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                            <svg
                              className="w-4 h-4 mr-1"
                              stroke="currentColor"
                              strokeWidth={2}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx={12} cy={12} r={3} />
                            </svg>
                            1.2K
                          </span>
                          <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                            <svg
                              className="w-4 h-4 mr-1"
                              stroke="currentColor"
                              strokeWidth={2}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                            </svg>
                            6
                          </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Swiper chỉ xuất hiện trên mobile (max-width: 768px) */}
        <div className="block md:hidden mt-8">
          <Swiper
            spaceBetween={30}
            slidesPerView={1.5}
            // loop={true}
            autoplay={{ delay: 2500 }}
            className="mySwiper"
          >
            {posts &&
              posts
                .sort(
                  (a, b) =>
                    new Date(b._createdAt).getTime() -
                    new Date(a._createdAt).getTime()
                )
                .slice(0, 3)
                .map((post: Post) => (
                  <div key={post._id}>
                    <SwiperSlide className="flex justify-center items-center ">
                      <div className="h-full  border-opacity-60 rounded-lg overflow-hidden bg-white box-shadow-basic">
                        <div className="relative w-full lg:h-60 md:h-36 h-36">
                          <Image
                            src={post.mainImage?.asset?.url}
                            alt="blog"
                            fill
                            className="object-cover object-center"
                            sizes="100vw"
                          />
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between">
                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                              {post.categories
                                ?.map((cat: Category) => cat.title)
                                .join(", ") || "No categories"}
                            </h2>
                            <p className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                              {new Date(post?._createdAt)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")}
                            </p>
                          </div>
                          <h1 className="mt-2 title-font text-lg font-medium text-gray-900 mb-3 md:h-[55px] line-clamp-2">
                            <a aria-label="Xem chi tiết"
                              className="hover:text-[#CE2127]"
                              href={`/posts/${post?.slug.current}`}
                            >
                              {post?.title}
                            </a>
                          </h1>

                          <p className="mt-1 italic leading-relaxed mb-3">
                            {post.authorName || "No author"}
                          </p>
                          <div className="flex items-center flex-wrap ">
                            <a aria-label="Xem chi tiết"
                              href={`/posts/${post?.slug.current}`}
                              className="text-[#CE2127] inline-flex items-center md:mb-2 lg:mb-0"
                            >
                              <span>Xem thêm </span>
                              <svg
                                className="w-4 h-4 ml-2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </div>
                ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
