
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY2 } from "../(sanity)/lib/queries";
import DATA_DAY_CLIENT from "./data_day_client";

export default async function DATA_DAY () {
  const posts = await client.fetch(POSTS_QUERY2); 
  return <DATA_DAY_CLIENT posts={posts} />;
}