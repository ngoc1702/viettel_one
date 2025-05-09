import { client } from "@/sanity/lib/client";
import { POSTS_QUERY2 } from "../(sanity)/lib/queries";
import TRUYENHINH from "./truyenhinh";

export default async function DATA_INTERNET_TRUYENHINH() {
  const posts = await client.fetch(POSTS_QUERY2); 
  return <TRUYENHINH posts={posts}/>
}