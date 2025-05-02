"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { client } from "../(sanity)/lib/client";
import { POSTS_QUERY2 } from "../(sanity)/lib/queries";
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
  title: string;
  traffic: string;
  price: string;
  time: string;
  timeTraffic: string;
  mainImage: {
    asset: {
      url: string;
    };
    alt: string;
  };
  _createdAt: string;
  slug: {
    current: string;
  };
  globalField: string;
  categories: Category[];
  sub_categories: Sub_Category[];
  gallery: Image[];
}

const fetchPost = async (slug: string): Promise<Post | null> => {
  const query = `
    *[_type == "package" && slug.current == $slug][0]{
      title,
      traffic,
      price,
      time,
      timeTraffic,
      mainImage {
        asset-> { url },
        alt
      },
      categories[]-> { title },
      sub_categories[]-> { title },
      gallery[] {
        asset-> { _id, url },
        caption
      },
      _createdAt,
      body,
      slug,
      "globalField": *[_type == "global"][0].globalField
    }
  `;
  return await client.fetch(query, { slug });
};

// ✅ Đây là component hiển thị gói tương tự
export default function INTERNET_SIMILAR({ slug }: { slug: string }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup(!showPopup);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const post = await fetchPost(slug);
        setSelectedPost(post);

        if (!post?.categories) {
          setPosts([]);
          return;
        }

        const fetchedPosts = await client.fetch<Post[]>(POSTS_QUERY2);

        const filteredPosts = fetchedPosts.filter((fetchedPost) => {
          const sameCategory =
            fetchedPost.categories?.some((fetchedCategory) =>
              post.categories.some(
                (selectedCategory) =>
                  selectedCategory.title === fetchedCategory.title
              )
            ) ?? false;

          const sameSubCategory =
            fetchedPost.sub_categories?.some((fetchedSubCategory) =>
              post.sub_categories?.some(
                (selectedSubCategory) =>
                  selectedSubCategory.title === fetchedSubCategory.title
              )
            ) ?? false;

          // Ưu tiên lọc theo sub_categories nếu có, nếu không có thì lọc theo categories
          const isSimilar =
            post.sub_categories?.length > 0 ? sameSubCategory : sameCategory;

          return isSimilar && fetchedPost.slug.current !== post.slug.current;
        });

        setPosts(filteredPosts);
      } catch (err) {
        console.error("Lỗi khi fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedPost) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <div className="max-content px-3 pb-16">
        <div className="mb-10 max-content ">
          <button
            onClick={togglePopup}
            className="hidden md:flex mt-6 gap-1 items-center  text-white bg-[#CE2127] border-0 py-3 px-12 focus:outline-none hover:bg-[#AA0000] rounded-[5px] font-semibold"
          >
            Đăng ký
          </button>

          <button  onClick={togglePopup} className="text-sm flex md:hidden gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-3 px-8 focus:outline-none hover:bg-[#AA0000] rounded-[5px] font-semibold">
           
              Đăng ký
            
          </button>
        </div>
        <h1 className="uppercase md:px-0 font-bold text-[36px] leading-[80px] max-md:max-w-full max-md:text-2xl max-md:leading-[36px]">
          <span className=" text-[#141718]">Gói Cước Tương Tự</span>
        </h1>

        <div className="hidden md:grid xl:grid-cols-4 md:grid-cols-2 -m-4 z-1 mt-2">
          {posts
            .sort((a, b) => {
              // Sắp xếp theo _createdAt (giả sử _createdAt là trường ngày tạo của bài viết)
              return (
                new Date(a._createdAt).getTime() -
                new Date(b._createdAt).getTime()
              ); // Sắp xếp giảm dần
            })
            .slice(0, 4)
            .map((post) => (
              <div key={post.slug.current}>
                <div className="p-4 w-full">
                  <div className="min-h-[370px] justify-between items-center p-6 rounded-[40px] flex flex-col relative bg-white light-pink-shadow my-2 mx-[2px]">
                    <div className="bg-[#CE2127] text-white px-3 py-1 text-2xl font-bold tracking-tight absolute right-[50%] translate-x-1/2 top-0 rounded-b-[15px]">
                      {post.title}
                    </div>

                    <h1 className="mt-10 text-4xl font-bold text-gray-900 leading-none flex items-end pb-4 mb-4 border-b border-gray-200">
                      <span className="text-[#CE2127]">{post?.traffic}</span>
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

                    <h2 className="mt-4 font-bold text-gray-900 leading-none flex items-end pb-4 mb-4">
                      <span className="text-3xl text-gray-900">
                        {post?.price}
                      </span>
                      <span className="text-base ml-1 font-semibold text-gray-900 uppercase">
                        /{post?.time}
                      </span>
                    </h2>

                    <div className="flex gap-[22px]">
                      <button
                        onClick={togglePopup}
                        className="flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-6 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
                      >
                        Đăng ký
                      </button>
                      <a
                        href={`/internet_truyenhinh/${post?.slug.current}`}
                        aria-label="Xem chi tiết"
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

        <div className="block md:hidden overflow-x-hidden mt-4 z-0">
          <Swiper
            spaceBetween={8}
            slidesPerView={2.2}
            autoplay={{ delay: 100 }}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper"
          >
            {posts
              .sort((a, b) => {
                // Sort by _createdAt (descending)
                return (
                  new Date(a._createdAt).getTime() -
                  new Date(b._createdAt).getTime()
                );
              })
              .slice(0, 4) // Only show 4 latest posts
              .map((post) => (
                <SwiperSlide
                  style={{ width: "100%" }}
                  key={post.slug.current}
                  className="flex justify-center items-center w-[100%]"
                >
                  <div className="w-full">
                    <div className=" min-w-[170px] min-h-[275px] justify-between items-center h-full p-4 rounded-[40px] flex flex-col relative bg-white light-pink-shadow my-2 mx-[2px]">
                      {/* Post Title */}
                      <a
                        href={`/internet_truyenhinh/${post?.slug.current}`}
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
                            {post.gallery.map((image) => (
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
                        {/* Register Button */}
                        <button
                          className="text-sm flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-4 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
                          onClick={togglePopup}
                        >
                          Đăng ký
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
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
