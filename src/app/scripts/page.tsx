"use client"; 
import { useState } from "react";
import sanityClient from "@sanity/client";
import type { PortableTextBlock } from "@portabletext/types";

// Khởi tạo Sanity client
const client = sanityClient({
  projectId: "zdm28162", // Thay bằng Project ID của bạn
  dataset: "viettel_media", // Thay bằng dataset của bạn
  useCdn: false,
  token: "skGPerenGURr8fnFTXIsPfiaJQtH9BTlfnrUbIQAx4p7onFy8SQcmvWlcTibhEObBz0gouxW29hgcbxCZYhA4kNLv8fWSA92nbMG8uZX89QMRNslgNSUEnKTJMGYXzJ6sGiwfCo2VWowo4NQjY5iqGVXPlBtAk8ED3Z3qNLC59gPxIZXFaDz", // Thay bằng token có quyền ghi dữ liệu
});

const ReplaceWord = () => {
  const [oldWord, setOldWord] = useState("");
  const [newWord, setNewWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const replaceWord = async () => {
    if (!oldWord || !newWord) {
      setMessage("Vui lòng nhập từ cũ và từ mới.");
      return;
    }

    setLoading(true);
    setMessage("🔍 Đang tìm bài viết chứa từ...");

    try {
      // Tìm tất cả bài viết chứa từ cần thay thế
      const posts = await client.fetch(`*[_type == "package" && defined(slug.current)][0...1000]`);
      console.log("posts", posts);
      
      if (posts.length === 0) {
        setMessage("❌ Không tìm thấy bài viết nào chứa từ cần thay thế.");
        setLoading(false);
        return;
      }

      // Cập nhật từng bài viết
      for (const post of posts) {
        // Check if body is a string, if not handle the content accordingly
        if (typeof post.body === 'string') {
          const updatedBody = post.body.replace(new RegExp(oldWord, "g"), newWord);
          await client.patch(post._id).set({ body: updatedBody }).commit();
        } else if (Array.isArray(post.body)) {
          // If body is an array (Portable Text), extract text and replace
          const updatedBody = post.body.map((block: PortableTextBlock) => {
            if (block._type === 'block' && Array.isArray(block.children)) {
              block.children = block.children.map((child) => {
                if ('text' in child && typeof child.text === 'string') {
                  return {
                    ...child,
                    text: child.text.replace(new RegExp(oldWord, 'g'), newWord),
                  };
                }
                return child;
              });
            }
            return block;
          });
          

          await client.patch(post._id).set({ body: updatedBody }).commit();
        }
      }

      setMessage(`✅ Đã thay thế "${oldWord}" bằng "${newWord}" trong ${posts.length} bài viết.`);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setMessage("❌ Lỗi khi cập nhật bài viết.");
    }

    setLoading(false);
  };

  return (
    <div className="max-content px-4 md:px-0 py-20">
      <h2 className="mt-20">Thay thế từ trong các gói Viettel</h2>
      <div className="mt-4">
  <input
    type="text"
    placeholder="Nhập từ cũ"
    value={oldWord}
    onChange={(e) => setOldWord(e.target.value)}
    className="border p-4 rounded-md mb-2 w-full"
  />
  <input
    type="text"
    placeholder="Nhập từ mới"
    value={newWord}
    onChange={(e) => setNewWord(e.target.value)}
    className="border mt-2 p-4 rounded-md mb-2 w-full"
  />
  <button
    onClick={replaceWord}
    disabled={loading}
    className={`w-full mt-2 py-4 rounded-md text-white ${
      loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#ce2127] hover:bg-[#AA0000]"
    } focus:outline-none focus:ring-2 focus:ring-[#AA0000]`}
  >
    {loading ? "Đang thay thế..." : "Thay thế từ"}
  </button>
</div>

      <p className="mt-4">{message}</p>
    </div>
  );
};

export default ReplaceWord;
