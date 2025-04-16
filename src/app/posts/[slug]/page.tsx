import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import {
  PortableTextComponentProps,
  PortableTextBlock,
} from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface Post {
  title: string;
  traffic: string;
  price: string;
  time: string;
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
}

type ImageValue = {
  _type: string;
  asset: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
};

const fetchPost = async (slug: string): Promise<Post | null> => {
  const query = groq`*[_type == "post" && slug.current == $slug][0]`;
  const post = await client.fetch(query, { slug });
  return post;
};

const PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <div className="my-6">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "Image"}
          className="w-full h-auto object-cover"
        />
        {value.caption && (
          <p className="text-sm text-gray-500 mt-2">{value.caption}</p>
        )}
      </div>
    ),
  },
  block: {
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <p className="mb-4">{children}</p>
    ),
  },
};

// Update PageProps to ensure params is a Promise<SegmentParams>
export interface PageProps {
  params: Promise<{ slug: string }>;
}

const PostPage = async ({ params }: PageProps) => {
  const resolvedParams = await params; // Resolve the Promise
  const post = await fetchPost(resolvedParams.slug);

  if (!post) {
    return <div>Post not found</div>;
  }
  console.log(post.title, "FFFFFF");

  const extractText = (
    blocks: PortableTextBlock[] | undefined,
    maxLength: number = 160
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
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={extractText(post?.body)} />

      <div className="max-content px-5 md:px-0 py-12 md:py-20 mt-20">
        <h1 className="text-4xl font-bold title-font text-gray-900 mb-3">
          {post.title}
        </h1>
        <span className="mt-1 text-gray-500 text-base">
          {new Date(post._createdAt)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")}
        </span>
        <img
          className="lg:h-[50vh] md:h-36 w-full md:w-[70%] mx-auto object-contain object-center mt-6"
          src={urlFor(post.mainImage).url() || ""}
          alt={post.mainImage?.alt || "Post image"}
        />
        <div className="mt-6">
          <PortableText value={post.body} components={PortableTextComponents} />
        </div>
      </div>
    </>
  );
};

export default PostPage;