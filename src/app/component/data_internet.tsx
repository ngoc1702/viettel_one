import { client } from "@/sanity/lib/client";
import { POSTS_QUERY2 } from "../(sanity)/lib/queries";
import MESH_WIFI from "./meshwifi";

export default async function DATA_INTERNET() {
  const posts = await client.fetch(POSTS_QUERY2); 
  return <MESH_WIFI posts={posts}/>
}