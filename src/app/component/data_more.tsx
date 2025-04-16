

import { client } from "@/sanity/lib/client";
import { POSTS_QUERY2 } from "../(sanity)/lib/queries";
import DATA_MORE_CLIENT from "./data_more_client";

export default async function DATA_MONTH() {
  const posts = await client.fetch(POSTS_QUERY2); 
  return <DATA_MORE_CLIENT posts={posts} />;
}
