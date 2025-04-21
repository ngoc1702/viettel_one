"use client";
import { useState, useEffect, useCallback } from "react";
import AddressForm, { AddressData } from "./api_address";
import emailjs from "emailjs-com";

type FormData = {
  name: string;
  phone: string;
  serviceOption: string;
  addressOption: string;
  cityName: string;
  districtName: string;
  wardName: string;
  detail: string;
};

type ErrorMessages = {
  name: string;
  phone: string;
  serviceOption: string;
  addressOption: string;
  cityName: string;
  districtName: string;
  wardName: string;
  detail: string;
};

export default function REGISTRATION_FORM() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [address, setAddress] = useState<AddressData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    serviceOption: "",
    addressOption: "",
    cityName: "",
    districtName: "",
    wardName: "",
    detail: "",
  });

  const [errors, setErrors] = useState<ErrorMessages>({
    name: "",
    phone: "",
    serviceOption: "",
    addressOption: "",
    cityName: "",
    districtName: "",
    wardName: "",
    detail: "",
  });

  const getErrorMessage = (key: string, value: string): string => {
    if (!value || value.trim() === "") {
      if (["cityName", "districtName", "wardName", "detail"].includes(key)) {
        return "Vui lòng nhập đầy đủ địa chỉ lắp đặt.";
      }

      switch (key) {
        case "name":
          return "Vui lòng nhập họ tên.";
        case "phone":
          return "Vui lòng nhập số điện thoại.";
        case "serviceOption":
          return "Vui lòng chọn hình thức đăng ký.";
        case "addressOption":
          return "Vui lòng chọn địa chỉ lắp đặt.";
        default:
          return "Trường này là bắt buộc.";
      }
    }

    // Advanced validation for phone number
    if (key === "phone") {
      const phoneRegex = /^0\d{9}$/; // Starts with 0 and followed by exactly 9 digits
      if (!phoneRegex.test(value.trim())) {
        return "Số điện thoại phải bắt đầu 0 và đủ 10 số.";
      }
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

  const handleAddressChange = useCallback((value: AddressData) => {
    setAddress(value);

    setFormData((prev) => ({
      ...prev,
      cityName: value.cityName || "",
      districtName: value.districtName || "",
      wardName: value.wardName || "",
      detail: value.detail || "",
    }));

    setErrors((prev) => ({
      ...prev,
      cityName: value.cityName ? "" : prev.cityName,
      districtName: value.districtName ? "" : prev.districtName,
      wardName: value.wardName ? "" : prev.wardName,
      detail: value.detail?.trim() ? "" : prev.detail,
    }));
  }, []);

  useEffect(() => {
    if (address) {
      setFormData((prev) => ({
        ...prev,
        cityName: address.cityName || "",
        districtName: address.districtName || "",
        wardName: address.wardName || "",
        detail: address.detail || "",
      }));
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  
    let hasError = false;
    const newErrors: ErrorMessages = { ...errors };
  
    // Chỉ kiểm tra các trường cơ bản ở đây
    const baseFields: (keyof typeof formData)[] = [
      "name",
      "phone",
      "serviceOption",
      "addressOption",
    ];
  
    for (const key of baseFields) {
      const value = formData[key];
      const error = getErrorMessage(key, value);
      if (error) {
        newErrors[key] = error;
        hasError = true;
        break;
      } else {
        newErrors[key] = "";
      }
    }
  
    if (hasError) {
      setErrors(newErrors);
      return;
    }
  
    // Nếu bạn muốn validate địa chỉ sau khi form cơ bản ok, có thể gọi hàm validate từ file phụ
    // Ví dụ: if (!isAddressValid()) return;
  
    const readableData = `Tên: ${formData.name}
  Số điện thoại: ${formData.phone}
  Hình thức đăng ký: ${formData.serviceOption}
  Địa chỉ lắp đặt: ${formData.addressOption}
  Địa chỉ chi tiết: ${formData.detail}, ${formData.wardName}, ${formData.districtName}, ${formData.cityName}`;
  
    alert(`Đăng ký thành công!\n${readableData}`);
  
    emailjs
      .send(
        "service_d3cl9zs",
        "template_ujn0z5a",
        formData,
        "V1jsomCPawnaiuZv0"
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
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
              value="Cá nhân"
              checked={formData.serviceOption === "Cá nhân"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">Cá nhân</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="serviceOption"
              value="Doanh nghiệp"
              checked={formData.serviceOption === "Doanh nghiệp"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">Doanh nghiệp</span>
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
              value="Nhà riêng"
              checked={formData.addressOption === "Nhà riêng"}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-900">Nhà riêng</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="addressOption"
              value="Khu đô thị / Chung cư"
              checked={formData.addressOption === "Khu đô thị / Chung cư"}
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
        <AddressForm onChange={handleAddressChange} isSubmitted={isSubmitted} />
      </div>
      <pre className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-800 hidden">
        {address ? JSON.stringify(address, null, 2) : "Chưa có dữ liệu"}
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
