import Background from "@public/assets/img/bg.png";
import Image from "next/image";
import MESH_WIFI from "../component/meshwifi";
export default function Page() {
    return (
        <>
   <div className="relative w-full h-[400px] rounded-full overflow-hidden mt-[88px]">
  <Image
    src={Background}
    alt="bg"
    fill
    className="object-cover object-center z-0"
    priority
  />
  
  {/* Text block */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center p-4 w-full max-w-[800px]">
    <h1 className="text-3xl font-bold text-white">
      Đăng ký Internet cho ngôi nhà của bạn
    </h1>
  </div>
</div>

<MESH_WIFI/>

        </>
    );
}