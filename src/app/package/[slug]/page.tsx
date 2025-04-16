import { client } from "../../../sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Price from "@public/assets/img/cuoc.svg";
import Clock from "@public/assets/img/clock.svg";
import Traffic from "@public/assets/img/data.svg";
import SMS from "@public/assets/img/sms (1).svg";
import SmsButton from "@/app/component/button";
import PACKAGE_SIMILAR from "@/app/component/package_similar";
// import type { Metadata } from "next";

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
  body: PortableTextBlock[];
  slug: {
    current: string;
  };
  globalField: string;
  categories: { title: string }[];
  sub_categories: { title: string }[];
  gallery: {
    asset: { url: string; _id: string };
    caption?: string;
  }[];
}



type PageProps = {
  params: Promise<{ slug: string }>;
};
const fetchPost = async (slug: string): Promise<Post | null> => {
  const query = `
    *[_type == "package" && slug.current == $slug][0]{
      title,
      traffic,
      price,
      time,
      timeTraffic,
      mainImage {
        asset-> {
          url
        },
        alt
      },
      categories[]-> { title },
      sub_categories[]-> { title },
      gallery[] {
        asset-> {
          _id,
          url
        },
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


const extractText = (
  blocks: PortableTextBlock[] | undefined,
  maxLength: number = 180
) => {
  if (!blocks) return "Mô tả mặc định nếu không có";

  const text = blocks
    .map(
      (block) => block.children?.map((child) => child.text).join(" ") || ""
    )
    .join(" ");

  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // Resolve the Promise
  const post = await fetchPost(resolvedParams.slug);
  if (!post) return <div>Không tìm thấy gói cước</div>;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: post.title,
    // description: extractText(post.body),
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: post.price,
      availability: "https://schema.org/InStock",
    },
    sku: post.slug?.current,
    category: post.categories?.[0]?.title || "MobileDataPlan",
    brand: {
      "@type": "Brand",
      name: "Viettel",
    },
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Gói ${post.title} có gì nổi bật?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Gói ${post.title} với ${post.traffic}, giá chỉ ${post.price}đ/tháng.`,
        },
      },
      {
        "@type": "Question",
        name: `Làm sao để đăng ký gói ${post.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Soạn tin: ${post.slug.current} UP gửi 290.`,
        },
      },
      {
        "@type": "Question",
        name: `Gói ${post.title} có tự động gia hạn không?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Có. Gói sẽ tự động gia hạn nếu tài khoản đủ tiền. Soạn HUY ${post.slug.current} gửi 191 để hủy.`,
        },
      },
    ],
  };
  

  return (
    <>
    <title>{post.title}</title>
    <meta name="description" content={extractText(post?.body)} />
    <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(productSchema),
    }}
  />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(faqSchema),
    }}
  />
      <div className="max-content px-3">
        <div className="relative">
          <div className="max-content md:px-0 py-12 m:py-20 mt-20 relative">
            <h1 className="text-4xl font-bold title-font text-gray-900 mb-3">
              GÓI CƯỚC <span className="text-[#CE2127]"> {post.title}</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mt-4">
              {/* Displaying info blocks */}
              <div className="h-full bg-white p-4 md:p-6 rounded-xl">
                <a aria-label="image" className="inline-flex items-center">
                  <Image
                    alt="testimonial"
                    src={Price}
                    className="w-14 h-14 rounded-full flex-shrink-0 object-cover object-center"
                  />
                  <span className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-gray-600">
                      Cước phí
                    </span>
                    <span className="text-gray-900 text-xl md:text-3xl font-bold mt-1">
                      {post.price}
                    </span>
                  </span>
                </a>
              </div>
              <div className="h-full bg-white p-4 md:p-6 rounded-xl">
                <a  aria-label="image" className="inline-flex items-center">
                  <Image
                    alt="testimonial"
                    src={Clock}
                    className="w-14 h-14 rounded-full flex-shrink-0 object-cover object-center"
                  />
                  <span className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-gray-600">
                      Thời hạn sử dụng
                    </span>
                    <span className="text-gray-900 text-xl md:text-3xl font-bold mt-1">
                      {post.time}
                    </span>
                  </span>
                </a>
              </div>
              <div className="h-full bg-white p-4 md:p-6 rounded-xl">
                <a aria-label="image" className="inline-flex items-center">
                  <Image 
                    alt="testimonial"
                    src={Traffic}
                    className="w-14 h-14 rounded-full flex-shrink-0 object-cover object-center"
                  />
                  <span className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-gray-600">
                      Dung lượng tốc độ cao
                    </span>
                    <span className="text-gray-900 text-xl md:text-3xl font-bold mt-1">
                      {post.traffic}
                      {post?.timeTraffic && (
                        <span className="text-gray-900 text-base md:text-base font-bold mt-1">
                          / {post.timeTraffic}
                        </span>
                      )}
                    </span>
                  </span>
                </a>
              </div>
              <div className="h-full bg-white p-4 md:p-6 rounded-xl">
                <a aria-label="image" className="inline-flex items-center">
                  <Image 
                    alt="testimonial"
                    src={SMS}
                    className="w-14 h-14 rounded-full flex-shrink-0 object-cover object-center"
                  />
                  <button className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-gray-600">
                      Cú pháp đăng ký SMS
                    </span>
                    <span className="text-gray-900 text-xl md:text-3xl font-bold mt-1">
                      {post.title} {post.globalField}
                      <span className="text-base text-[#CE2127]"> gửi 290</span>
                    </span>
                  </button>
                </a>
              </div>
            </div>
            <div className="block md:hidden ">
              <div className="z-10 fixed bottom-0 left-0 w-full bg-white px-4 pt-4 pb-5 flex justify-between items-center shadow-top">
                <span className="text-xl font-semibold">
                  {post.price}
                  <span className="text-sm font-normal">/{post.time}</span>
                </span>
                <SmsButton
                  postTitle={post.title}
                  globalField={post.globalField}
                />
              </div>
            </div>
          </div>

          <img
            className="lg:h-[50vh] md:h-36 w-full md:w-[70%] mx-auto object-contain object-center "
            src={urlFor(post.mainImage).url()}
            alt={post.mainImage?.alt}
          />
          {/* PortableText Rendering */}
          <div className="mb-8 max-content mt-6">
            <PortableText
              value={post.body}
              // components={PortableTextComponents}
            />
          </div> 
        </div>
      </div>
      <PACKAGE_SIMILAR slug={resolvedParams.slug} />

    </>
  );
}