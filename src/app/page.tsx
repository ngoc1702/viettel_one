
import "swiper/css";
import Banner from "./component/banner";
import DATA_MONTH from "./component/data_month";
import DATA_DAY from "./component/data_day";
import DATA_MORE from "./component/data_more";
import POSTS from "./component/posts";


export default async function Home() {

  return (
    <div>
      <title>Đăng Ký 4G Viettel - Cách Đăng Ký Gói Cước 4G Nhanh Chóng</title>
      <meta name="description" content="Đăng Ký 4G Viettel - Cách Đăng Ký Gói Cước 4G Nhanh Chóng" />
      <Banner />
      <section className="mt-6 mb-6 px-3 md:px-0 mx-auto text-center">
        <p className="uppercase font-bold text-[20px] leading-[50px] max-md:max-w-full max-md:text-lg max-md:leading-[50px]">
          GÓI CƯỚC DATA 4G 5G VIETTEL
        </p>
        <p className=" text-[16px] leading-[32px] max-md:max-w-full max-md:text-[14px] max-md:leading-[24px]">
          Đăng ký gói cước data 4G 5G tốc độ cao dễ dàng cùng Viettel.one!
        </p>
        <p className=" text-[16px] leading-[32px] max-md:max-w-full max-md:text-[14px] max-md:leading-[24px]">
          Viettelone là website phù hợp với giới trẻ, cung cấp thông tin đầy
          đủ và chính xác mọi dịch vụ, khuyến mại của Viettel.
        </p>
      </section>
      <DATA_MONTH />
      <DATA_DAY />
      <DATA_MORE />
      <POSTS />
    </div>
  );
}
