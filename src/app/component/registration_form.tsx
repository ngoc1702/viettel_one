"use client";
import { useState } from "react";
import AddressForm, { AddressData }  from "./api_address"; 

type FormData = {
    name: string;
    phone: string;
    serviceOption: string;
    addressOption: string;
  };
  
  type ErrorMessages = {
    name: string;
    phone: string;
    serviceOption: string;
    addressOption: string;
    address: string;
  };
  
  export default function REGISTRATION_FORM() {
    const [address, setAddress] = useState<AddressData | null>(null);
  
    const handleAddressChange = (value: AddressData) => {
      setAddress(value);
      console.log("Dữ liệu địa chỉ đầy đủ:", value);
    };
  
    const [formData, setFormData] = useState<FormData>({
      name: "",
      phone: "",
      serviceOption: "",
      addressOption: "",
    });
  
    const [errors, setErrors] = useState<ErrorMessages>({
      name: "",
      phone: "",
      serviceOption: "",
      addressOption: "",
      address: "", // Lỗi cho địa chỉ
    });
  
    const getErrorMessage = (name: string, value: string): string => {
      if (name === "name") {
        if (!value.trim()) return "Vui lòng nhập họ và tên";
      }
  
      if (name === "phone") {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(value))
          return "Số điện thoại phải bắt đầu bằng 0 và gồm 10 số";
      }
  
      if (name === "serviceOption") {
        if (!value) return "Vui lòng chọn một hình thức đăng ký";
      }
  
      if (name === "addressOption") {
        if (!value) return "Vui lòng chọn một địa chỉ lắp đặt";
      }
  
      return "";
    };
  
    // Kiểm tra lỗi địa chỉ
    const getAddressError = () => {
      if (!address) {
        return "Vui lòng nhập đầy đủ địa chỉ lắp đặt";
      }
  
      if (!address.cityCode || !address.districtCode || !address.wardCode || !address.detail) {
        return "Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã và Địa chỉ chi tiết";
      }
  
      return "";
    };
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      // Kiểm tra lỗi cho tất cả các trường trong form
      for (const [key, value] of Object.entries(formData)) {
        const error = getErrorMessage(key, value);
        if (error) {
          setErrors((prev) => ({
            ...prev,
            [key]: error,
          }));
          return;
        }
      }
  
      // Kiểm tra lỗi cho địa chỉ
      const addressError = getAddressError();
      if (addressError) {
        setErrors((prev) => ({
          ...prev,
          address: addressError,
        }));
        return;
      }
  
      const readableData = `
      Họ tên: ${formData.name}
      Số điện thoại: ${formData.phone}
      Hình thức đăng ký: ${
        formData.serviceOption === "new" ? "Đăng kí mới" : "Đăng kí thêm"
      }
      Địa chỉ lắp đặt: ${
        formData.addressOption === "private"
          ? "Nhà riêng"
          : "Khu đô thị / Chung cư"
      }
      ${address ? `
      Địa chỉ chi tiết: ${address.cityName}, ${address.districtName}, ${address.wardName}, ${address.detail}
      ` : ''}
      `;
  
      console.log("Dữ liệu hợp lệ:", formData);
      alert(`Đăng ký thành công!\n${readableData}`);
    };
  

  return (
    <form className="mx-auto" onSubmit={handleSubmit}>
      <div className="flex justify-center items-center">
        <h3 className="text-black uppercase mb-1">THÔNG TIN ĐĂNG KÝ</h3>
      </div>

      <div className="block mb-3 text-base font-semibold text-gray-700">
        Thông tin cá nhân
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
        {/* Họ và tên */}
        <div className="mb-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="mb-5">
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Đăng ký dịch vụ */}
      <div className="mb-5">
        <div className="block mb-3 text-base font-semibold text-gray-700">
          Đăng ký dịch vụ
        </div>
        <div className="flex flex-row gap-12">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="serviceOption"
              value="new"
              checked={formData.serviceOption === "new"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">Đăng kí mới</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="serviceOption"
              value="additional"
              checked={formData.serviceOption === "additional"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">Đăng kí thêm</span>
          </label>
        </div>
        {errors.serviceOption && (
          <p className="text-red-500 text-sm mt-1">{errors.serviceOption}</p>
        )}
      </div>

      {/* Địa chỉ lắp đặt */}
      <div className="mb-5">
        <div className="block mb-3 text-base font-semibold text-gray-600">
          Địa chỉ lắp đặt
        </div>
        <div className="flex flex-row gap-12">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="addressOption"
              value="private"
              checked={formData.addressOption === "private"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">Nhà riêng</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="addressOption"
              value="apartment"
              checked={formData.addressOption === "apartment"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">
              Khu đô thị / Chung cư
            </span>
          </label>
        </div>
        {errors.addressOption && (
          <p className="text-red-500 text-sm mt-1">{errors.addressOption}</p>
        )}
      </div>

      <div className=" mb-5">
      <AddressForm onChange={handleAddressChange} />
      </div>
      <pre className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-800 hidden">
        {address ? JSON.stringify(address, null, 2) : 'Chưa có dữ liệu'}
      </pre>

      <button
        type="submit"
        className="text-white bg-[#CE2127] hover:bg-[#AA0000] focus:ring-4 focus:outline-none 
          focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
          text-center dark:bg-[#CE2127] dark:hover:bg-[#AA0000] dark:focus:ring-blue-800"
      >
        Gửi
      </button>
    </form>
  );
}
