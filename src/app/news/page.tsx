"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import { client } from "../(sanity)/lib/client";
import { POSTS_QUERY } from "../(sanity)/lib/queries";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLeftLong,faRightLong } from "@fortawesome/free-solid-svg-icons";
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

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts: Post[] = await client.fetch(POSTS_QUERY);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.slice(1);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );
  return (
    <div className="max-content mt-16">
      <title>Đăng Ký 4G Viettel - Cách Đăng Ký Gói Cước 4G Nhanh Chóng</title>
      <meta
        name="description"
        content="Đăng Ký 4G Viettel - Cách Đăng Ký Gói Cước 4G Nhanh Chóng"
      />
      <section className="text-gray-600 body-font max-content ">
        <div className="container px-5 py-12 md:py-20 mx-auto">
          <h1 className="uppercase font-bold text-[45px] leading-[80px] max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
            <span className=" text-[#CE2127]">Tin Nổi Bật</span>
          </h1>
          <div className="flex -m-4  mt-4">
            {posts &&
              posts
                .sort(
                  (a, b) =>
                    new Date(b._createdAt).getTime() -
                    new Date(a._createdAt).getTime()
                )
                .slice(0, 1)
                .map((post: Post) => (
                  <div key={post._id}>
                    <div className="px-4 ">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 h-full overflow-hidden">
                        <div className="relative w-full lg:h-80 md:h-36 h-[30vh] rounded-lg overflow-hidden">
                          <Image
                            src={post.mainImage?.asset?.url}
                            alt="blog"
                            fill
                            className="object-cover object-center"
                            sizes="100vw"
                          />
                        </div>

                        <div className="md:p-6">
                          <div className="flex justify-between">
                            <h2 className="tracking-widest text-base title-font font-medium text-gray-400 mb-1">
                              {post.categories
                                ?.map((cat: Category) => cat.title)
                                .join(", ") || "No categories"}
                            </h2>
                            <p className="tracking-widest text-base title-font font-medium text-gray-400 mb-1">
                              {new Date(post?._createdAt)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")}
                            </p>
                          </div>
                          <h1 className="mt-2 md:mt-4 title-font text-3xl md:text-4xl font-semibold text-gray-900 mb-3  line-clamp-2">
                            <a
                              aria-label="Xem chi tiết"
                              className="hover:text-[#CE2127]"
                              href={`/posts/${post?.slug.current}`}
                            >
                              {post?.title}
                            </a>
                          </h1>

                          <p className="mt-2 md:mt-4 italic  leading-relaxed mb-3 text-lg">
                            {post.authorName || "No author"}
                          </p>
                          <div className="flex items-center flex-wrap mt-2 ">
                            <a
                              aria-label="Xem chi tiết"
                              href={`/posts/${post?.slug.current}`}
                              className="text-[#CE2127] text-lg inline-flex items-center md:mb-2 lg:mb-0"
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
                    </div>
                  </div>
                ))}
          </div>

          {/* Swiper chỉ xuất hiện trên mobile (max-width: 768px) */}
        </div>
      </section>
      <section className="text-gray-600 body-font max-content ">
        <div className="container px-5 py-10 md:py-20 mx-auto">
          <h1 className="uppercase font-bold text-[45px] leading-[80px] max-md:max-w-full max-md:text-4xl max-md:leading-[50px]">
            <span className=" text-[#CE2127]">Tin Mới Nhất</span>
          </h1>
          <div className="md:block hidden">
            <div className="md:grid md:grid-cols-3 -m-4 mt-2">
              {paginatedPosts.map((post) => (
                <div key={post._id}>
                  <div className="p-4 ">
                    <div className="h-full border-opacity-60 rounded-lg overflow-hidden  bg-white box-shadow-basic">
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
                          <a
                            aria-label="Xem chi tiết"
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
                          <a
                            aria-label="Xem chi tiết"
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
                  </div>
                </div>
              ))}
            </div>
            {/* Điều hướng phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                {/* <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faLeftLong} />
              </button> */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{
                      padding: "5px 12px",
                      backgroundColor:
                        currentPage === index + 1 ? "#CE2127" : "#ddd",
                      color: currentPage === index + 1 ? "white" : "black",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    className="mx-1"
                  >
                    {index + 1}
                  </button>
                ))}
                {/* <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
              >
                 <FontAwesomeIcon icon={faRightLong}  />
              </button> */}
              </div>
            )}
          </div>

          {/* Swiper chỉ xuất hiện trên mobile (max-width: 768px) */}
          <div className="block md:hidden mt-8">
            <Swiper
              spaceBetween={30}
              slidesPerView={1.5}
              freeMode={true}
              modules={[FreeMode]}
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
                  .slice(1)
                  .map((post: Post) => (
                    <div key={post._id}>
                      <SwiperSlide className="flex justify-center items-center ">
                        <div className="h-full  border-opacity-60 rounded-lg overflow-hidden  bg-white box-shadow-basic">
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
                            <h1 className="mt-2 title-font text-lg font-medium text-gray-900 mb-3 md:h-[50px] line-clamp-2">
                              <a
                                aria-label="Xem chi tiết"
                                className="hover:text-[#CE2127]"
                                href={`/posts/${post?.slug.current}`}
                              >
                                {post?.title}
                              </a>
                            </h1>

                            <p className="mt-1 leading-relaxed mb-3">
                              {post.authorName || "No author"}
                            </p>
                            <div className="flex items-center flex-wrap ">
                              <a
                                aria-label="Xem chi tiết"
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
    </div>
  );
}
