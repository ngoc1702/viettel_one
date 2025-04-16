"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/assets/img/viettel.svg";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="fixed top-0 left-0 right-0 w-full z-10 bg-[white]  box-shadow-basic text-gray-600 body-font ">
      <div className=" bg-[white] container max-content mx-auto flex md:flex-wrap p-5 flex-row justify-between items-start md:items-center">
        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-0 cursor-pointer">
          <Image src={logo} alt="Logo" width={170} className="w-[120px] md:w-[170px] md:mt-0 mt-1"/>
        </Link>
        <nav className="md:ml-auto md:mr-auto hidden md:flex flex-wrap items-center text-lg font-medium justify-center">
          <Link href="/" className="mr-12 hover:text-gray-900 cursor-pointer">
            Trang chủ
          </Link>
          <Link href="/internet" className="mr-12 hover:text-gray-900 cursor-pointer">
            Internet
          </Link>
          <Link
            href="/news"
            className="mr-5 hover:text-gray-900 cursor-pointer"
          >
            Tin tức
          </Link>
        </nav>

        <a href="https://viettel.vn/lan-toa/goi-cuoc?kh=VANLTH_HNI_HKD" aria-label="Đăng nhập"><button
          className="hidden md:inline-flex items-center bg-[#CE2127] text-white border-0 py-3 px-6 focus:outline-none hover:bg-[#AA0000] rounded text-base mt-4 md:mt-0"
        >
          Đăng nhập
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button></a>
        {/* Header mobile */}
        <div className="block md:hidden">
      <div>
        <div
          onClick={openModal}
          style={{ display: isModalOpen ? "none" : "flex" }}
          id="open_menu"
          className="min-sm:block md:block lg:hidden cursor-pointer pt-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0_372_1645)">
              <path
                fill="#222"
                d="M23 10.9998H1C0.447715 10.9998 0 11.4475 0 11.9998C0 12.552 0.447715 12.9998 1 12.9998H23C23.5523 12.9998 24 12.552 24 11.9998C24 11.4475 23.5523 10.9998 23 10.9998Z"
              />
              <path
                fill="#222"
                d="M23 4.00024H1C0.447715 4.00024 0 4.44796 0 5.00024C0 5.55253 0.447715 6.00024 1 6.00024H23C23.5523 6.00024 24 5.55253 24 5.00024C24 4.44796 23.5523 4.00024 23 4.00024Z"
              />
              <path
                fill="#222"
                d="M23 18H1C0.447715 18 0 18.4477 0 19C0 19.5523 0.447715 20 1 20H23C23.5523 20 24 19.5523 24 19C24 18.4477 23.5523 18 23 18Z"
              />
            </g>
            <defs>
              <clipPath id="clip0_372_1645">
                <rect width={24} height={24} fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        
        {/* Modal */}
        <div
          className="modal"
          id="modalContainer"
          style={{ display: isModalOpen ? "flex" : "none" }}
        >
          <div
            onClick={closeModal}
            style={{ display: isModalOpen ? "flex" : "none", zIndex: 99 }}
            id="close_menu"
            className="pt-2 absolute top-[17px] right-3"
          >
            <svg
              width={32}
              height={32}
              viewBox="0 0 16 16"
              fill="#222"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99999 7.05732L11.3 3.75732L12.2427 4.69999L8.94266 7.99999L12.2427 11.3L11.3 12.2427L7.99999 8.94266L4.69999 12.2427L3.75732 11.3L7.05732 7.99999L3.75732 4.69999L4.69999 3.75732L7.99999 7.05732Z"
                fill="#222"
              />
            </svg>
          </div>
          <div className="h-screen mt-[13px] p-8 absolute z-50 bg-white top-14 left-0 right-0 md:relative md:top-0 md:bg-transparent items-stretch flex flex-col md:flex-row gap-5">
            <div className="text-gray-700 text-[18px] font-medium leading-6 whitespace-nowrap">
              <Link href="/" onClick={closeModal}>Trang chủ</Link>
            </div>

            <div className="text-gray-700 text-[18px] font-medium leading-6 whitespace-nowrap">
              <Link href="/news" onClick={closeModal}>Tin tức</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
