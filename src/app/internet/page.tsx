import Background from "@public/assets/img/bginterne.jpg";
import Image from "next/image";
import DATA_INTERNET from "../component/data_internet";
import DATA_INTERNET_TRUYENHINH from "../component/data_internet_truyenhinh";
export default function Page() {
  return (
    <>
      <div className="relative w-full h-[200px]  overflow-hidden mt-[77px] md:mt-[88px]">
        <Image
          src={Background}
          alt="bg"
          fill
          className="object-cover object-center z-0"
          priority
        />

        {/* Text block */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center p-4 w-full max-w-[800px]">
          <h1 className="text-xl md:text-3xl font-bold text-white uppercase">
            Đăng ký Internet cho ngôi nhà của bạn
          </h1>
        </div>
      </div>

      <DATA_INTERNET />
      <DATA_INTERNET_TRUYENHINH/>
    </>
  );
}
