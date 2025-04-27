"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AddressForm, { AddressData, AddressFormHandle } from "./api_address";
import emailjs from "emailjs-com";
import Swal from 'sweetalert2';

type FormData = {
  name: string;
  phone: string;
  serviceOption: string;

  cityName: string;
  districtName: string;
  wardName: string;
  detail: string;
};

type ErrorMessages = {
  [K in keyof FormData]: string;
};
const initialErrors: ErrorMessages = {
  name: "",
  phone: "",
  serviceOption: "",
  cityName: "",
  districtName: "",
  wardName: "",
  detail: "",
};



export default function REGISTRATION_FORM() {
  const addressFormRef = useRef<AddressFormHandle>(null);

  const [address, setAddress] = useState<AddressData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    serviceOption: "",
    cityName: "",
    districtName: "",
    wardName: "",
    detail: "",
  });
  const [errors, setErrors] = useState<ErrorMessages>(initialErrors);

  const getErrorMessage = (key: string, value: string): string => {
    if (!value || value.trim() === "") {
      switch (key) {
        case "name":
          return "Vui lòng nhập họ tên.";
        case "phone":
          return "Vui lòng nhập số điện thoại.";
        case "serviceOption":
          return "Vui lòng chọn hình thức đăng ký.";
        case "cityName":
          return "Vui lòng chọn tỉnh/thành phố.";
        case "districtName":
          return "Vui lòng chọn quận/huyện.";
        case "wardName":
          return "Vui lòng chọn phường/xã.";
        case "detail":
          return "Vui lòng nhập địa chỉ chi tiết.";
        default:
          return "Trường này bắt buộc.";
      }
    }

    if (key === "phone") {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(value.trim())) {
        return "Số điện thoại phải bắt đầu bằng số 0 và có 10 số.";
      }
    }

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    let hasError = false;
    const newErrors: ErrorMessages = { ...errors };

    const baseFields: (keyof FormData)[] = ["name", "phone", "serviceOption"];
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

    const addressFields: (keyof FormData)[] = [
      "cityName",
      "districtName",
      "wardName",
      "detail",
    ];

    for (const key of addressFields) {
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

    // Send email
    emailjs
      .send(
        "service_d3cl9zs",
        "template_ujn0z5a",
        formData,
        "V1jsomCPawnaiuZv0"
      )
      .then((response) => {
        console.log("Email sent successfully:", response);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Thông tin của bạn đã được gửi!',
        }).then(() => {
          // Reset the form data after success
          setFormData({
            name: '',
            phone: '',
            serviceOption: '',
            cityName: '',  // reset address fields
            districtName: '',
            wardName: '',
            detail: '',
          });
          setErrors(initialErrors);  
          addressFormRef.current?.reset();
        });
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


      <div className=" mb-5">
      <AddressForm
  ref={addressFormRef}
  value={formData}
  onChange={(data) => handleAddressChange(data as AddressData)}
  errors={{
    cityName: errors.cityName,
    districtName: errors.districtName,
    wardName: errors.wardName,
    detail: errors.detail,
  }}
/>


      </div>

      <button
        type="submit"
        className="text-white bg-[#CE2127] hover:bg-[#AA0000]  focus:outline-none 
          font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
          text-center"
      >
        Gửi
      </button>
    </form>
  );
}
