'use client';

import { useState } from 'react';
import REGISTRATION_FORM from "./registration_form";

export default function RegisterButton() {
    const [isOpen, setIsOpen] = useState(false);
  
    const togglePopup = () => setIsOpen((prev) => !prev);
  
    return (
      <>
        {/* Nút Đăng ký mở popup */}
        <button
          className="text-sm flex gap-1 items-center mt-auto text-white bg-[#CE2127] border-0 py-2 px-4 focus:outline-none hover:bg-[#AA0000] rounded-[25px] font-semibold"
          onClick={togglePopup}
        >
          Đăng ký
        </button>
  
        {/* Popup hiển thị khi isOpen = true */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 md:p-16 relative md:min-w-[800px] mx-2">
              {/* Nút X để đóng popup */}
              <button
                onClick={togglePopup}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                aria-label="Đóng"
              >
                ✕
              </button>
              <REGISTRATION_FORM />
            </div>
          </div>
        )}
      </>
    );
  }