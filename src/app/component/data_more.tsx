

import { client } from "@/sanity/lib/client";
import { POSTS_QUERY2 } from "../(sanity)/lib/queries";
import DATA_MORE_CLIENT from "./data_more_client";


export default async function DATA_MORE() {
  const posts = await client.fetch(POSTS_QUERY2, {}, {
    next: {
      revalidate: 30, // Tự động refetch lại sau 60 giây
    }
  });

  return <DATA_MORE_CLIENT posts={posts} />;
}
