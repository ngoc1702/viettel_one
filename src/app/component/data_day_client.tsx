"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
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

export default function DATA_MONTH_CLIENT({ posts }: { posts: Post[] }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleOpenPopup = (post: Post) => {
    setSelectedPost(post);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedPost(null);
  };
  const toggleContent = () => setIsContentVisible((prev) => !prev);

  const subCategoryTitles = [
    ...new Set(
      posts.flatMap(
        (post) => post.sub_categories?.map((sub) => sub.title) ?? []
      )
    ),
  ];



  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Viettelone",
                url: "https://viettelone.vn",
              },
              ...posts.map((post) => ({
                "@type": "Product",
                name: post.title,
                description: `${post.title} là gói cước Viettel tháng với ưu đãi ${post.traffic}. Giá chỉ ${post.price}/tháng.`,
                sku: post.slug.current,

                offers: {
                  "@type": "Offer",
                  priceCurrency: "VND",
                  price: post.price.replace(/\D/g, ""),
                  availability: "https://schema.org/InStock",
                },
              })),
            ],
          }),
        }}
      />
      <div className="max-content px-3 md:px-0 mb-20  z-1">
        <div className="flex justify-between items-center">
          <h1 className="uppercase md:px-0 font-bold text-[45px] leading-[80px] max-md:max-w-full max-md:text-2xl max-md:leading-[36px]">
            <span className=" text-[#141718]">Gói Cước</span>
            <span className=" text-[#CE2127]"> Data 4G 5G</span>
            <span className=" text-[#141718]"> Viettel Ngày</span>
          </h1>
          <button
            onClick={toggleContent}
            className="md:w-12 md:h-12   md:bg-gray-200  rounded-full items-center"
            aria-label="Toogle"
          >
            {isContentVisible ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </button>
        </div>
        {isContentVisible && (
          <div className="content  hidden md:block gap-4  w-full ">
            <section className="text-gray-600 body-font overflow-hidden">
              <div>
                {subCategoryTitles.map((title) => {
                  // Filter posts by category and sub-category title
                  const filteredPosts = posts.filter(
                    (post: Post) =>
                      post.categories?.some(
                        (category: Category) => category.title === "Ngày"
                      ) &&
                      post.sub_categories?.some(
                        (subCategory: Sub_Category) =>
                          subCategory.title === title
                      )
                  );

                  // Only render if there are filtered posts for the title
                  if (filteredPosts.length === 0) return null;

                  return (
                    <div className="mt-6" key={title}>
                      {/* Tên sub_category.title */}
                      <h3 className="uppercase font-semibold text-neutral-700 md:px-0 text-[32px] leading-[80px] max-md:max-w-full max-md:text-[24px] max-md:leading-[32px] mb-4">
                        Gói cước {title}
                      </h3>

                      <div className="grid xl:grid-cols-4 md:grid-cols-2 -m-4 z-1 mb-4">
                        {filteredPosts.map((post: Post) => (
                          <div key={post._id}>
                            <div className="p-4 w-full  ">
                              <div className="min-h-[370px] justify-between items-center  p-6 rounded-[40px] flex flex-col relative bg-white light-pink-shadow my-2 mx-[2px]">
                                <div className="bg-[#CE2127] text-white px-3 py-1 text-2xl font-bold tracking-tight absolute right-[50%] translate-x-1/2 top-0 rounded-b-[15px]">
                                  {post.title}
                                </div>

                                <h1 className="mt-10 text-4xl font-bold text-gray-900 leading-none flex items-end pb-4 mb-4 border-b border-gray-200">
                                  <span className="text-[#CE2127]">
                                    {post?.traffic}
                                  </span>
                                  {post?.timeTraffic && (
                                    <span className="text-lg ml-1 font-semibold text-gray-900">
                                      / {post.timeTraffic}
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
                                            alt={"Gallery Image"}
                                            width={30}
                                            height={30}
                                            style={{ objectFit: "cover" }}
                                          />
                                        </div>
                                      ))}
                                    </span>
                                  </>
                                )}

                                <h2 className="mt-4 font-bold text-gray-900 leading-none flex items-end pb-4 mb-4">
                                  <span className="text-3xl text-gray-900">
                                    {post?.price}
                                  </span>
                                  <span className="text-base ml-1 font-semibold text-gray-900 uppercase">
                                    /{post?.time}
                                  </span>
                                </h2>

                                <div className="flex gap-6">
                                  <button
                                    onClick={() => handleOpenPopup(post)}
                                    className="flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-6 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
                                  >
                                    Đăng ký
                                  </button>
                                  <a
                                    href={`/package/${post?.slug.current}`}
                                    aria-label="Xem chi tiết gói cước"
                                  >
                                    <button className="min-w-[100px] flex justify-center items-center gap-1 text-center text-[#CE2127] bg-[#FFFFFF] border-[#CE2127] border-[1px] py-2 focus:outline-none hover:bg-gray-100 rounded-[25px] font-semibold">
                                      Chi tiết
                                    </button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Swiper mobile */}
        {isContentVisible && (
          <div className="content block md:hidden ">
            {subCategoryTitles.map((title) => {
              // Filter posts by category and sub-category title
              const filteredPosts = posts.filter(
                (post: Post) =>
                  post.categories?.some(
                    (category: Category) => category.title === "Ngày"
                  ) &&
                  post.sub_categories?.some(
                    (subCategory: Sub_Category) => subCategory.title === title
                  )
              );

              // Only render if there are filtered posts for the title
              if (filteredPosts.length === 0) return null;

              return (
                <div className="mt-4" key={title}>
                  {/* Subcategory title */}
                  <h3 className="uppercase font-semibold text-neutral-700 text-[20px] leading-[40px] mb-2">
                    Gói cước {title}
                  </h3>

                  {/* Swiper for displaying posts */}
                  <Swiper
                    spaceBetween={8}
                    slidesPerView={2.2}
                    autoplay={{ delay: 100 }}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="mySwiper "
                  >
                    {filteredPosts.map((post: Post) => (
                      <SwiperSlide
                        key={post._id}
                        className="flex justify-center items-center"
                      >
                        <div className="w-full ">
                          <div className="min-h-[265px] justify-between items-center h-full p-4 rounded-[40px] flex flex-col relative bg-white light-pink-shadow my-2 mx-[2px]">
                            {/* Post Title */}
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
        )}
        {/* Popup */}
        {isPopupVisible && selectedPost && (
          <div className="fixed inset-0 z-50 px-5 flex items-center justify-center bg-black bg-opacity-50">
            <div className="absolute inset-0 "></div>
            <div className="relative z-10 bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-center">Thông báo</h2>
              <span className="mb-4">
                Để đăng ký gói cước, vui lòng soạn tin nhắn trên điện thoại theo
                cú pháp
                <span className="text-[#CE2127]">
                  {" "}
                  {selectedPost?.title} {selectedPost?.globalField}
                </span>{" "}
                gửi <span className="text-[#CE2127]">290</span>. Để xem các thuê
                bao áp dụng gói cước trên, vui lòng kiểm tra tại link dưới.
              </span>
              <div className="flex justify-center gap-6 mt-6 text-center items-center">
                <button
                  onClick={handleClosePopup}
                  className="min-w-[120px] flex justify-center items-center gap-1 text-center text-[#CE2127] bg-[#FFFFFF] border-[#CE2127] border-[1px] py-2 focus:outline-none hover:bg-gray-100 rounded-[25px] font-semibold"
                >
                  Đóng
                </button>
                <a
                  href="https://viettel.vn/lan-toa/goi-cuoc?kh=VANLTH_HNI_HKD"
                  aria-label="Kiểm tra ngay"
                >
                  <button className="min-w-[120px] flex justify-center items-center gap-1 text-white bg-[#CE2127] border-0 py-[8.5px] px-6 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold">
                    Kiểm tra ngay
                  </button>
                </a>
              </div>

              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <FontAwesomeIcon icon={faXmark} width={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
