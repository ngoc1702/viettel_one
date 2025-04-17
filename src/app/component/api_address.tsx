'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Location {
  code: number;
  name: string;
}

interface Province {
  code: number;
  name: string;
  districts: Location[];
}

interface District {
  code: number;
  name: string;
  wards: Location[];
}

export interface AddressData {
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  detail: string;
}

export default function AddressForm({
  onChange,
}: {
  onChange?: (address: AddressData) => void;
}) {
  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    axios
      .get<Location[]>('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => setCities(res.data))
      .catch((err) => console.error('Error fetching cities:', err));
  }, []);

  // Khi chọn tỉnh, load quận/huyện tương ứng
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = e.target.value;
    setSelectedCityCode(cityCode);
    setSelectedDistrictCode('');
    setSelectedWardCode('');
    setDistricts([]);
    setWards([]);

    axios
      .get<Province>(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`)
      .then((res) => setDistricts(res.data.districts))
      .catch((err) => console.error('Error fetching districts:', err));
  };

  // Khi chọn quận, load phường/xã tương ứng
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    setSelectedDistrictCode(districtCode);
    setSelectedWardCode('');
    setWards([]);

    axios
      .get<District>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => setWards(res.data.wards))
      .catch((err) => console.error('Error fetching wards:', err));
  };

  // Gửi dữ liệu ra ngoài mỗi khi có thay đổi
  useEffect(() => {
    if (onChange) {
      const cityName = cities.find((c) => c.code.toString() === selectedCityCode)?.name || '';
      const districtName = districts.find((d) => d.code.toString() === selectedDistrictCode)?.name || '';
      const wardName = wards.find((w) => w.code.toString() === selectedWardCode)?.name || '';

      onChange({
        cityCode: selectedCityCode,
        cityName,
        districtCode: selectedDistrictCode,
        districtName,
        wardCode: selectedWardCode,
        wardName,
        detail: detailAddress,
      });
    }
  }, [selectedCityCode, selectedDistrictCode, selectedWardCode, detailAddress]);

  return (
    <div style={{ margin: 'auto' }}>
      <div className="block mb-3 text-base font-semibold text-gray-700">
        Nhập địa chỉ
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 md:gap-y-4 gap-4">
        <select
          value={selectedCityCode}
          onChange={handleCityChange}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
        >
          <option value="" style={{ color: '#9ca3af' }}>Chọn Tỉnh/Thành phố</option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
          value={selectedDistrictCode}
          onChange={handleDistrictChange}
          disabled={!selectedCityCode}
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>

        <select
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
          value={selectedWardCode}
          onChange={(e) => setSelectedWardCode(e.target.value)}
          disabled={!selectedDistrictCode}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        id="address"
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full mt-4"
        placeholder="Địa chỉ cụ thể"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
      />
    </div>
  );
}
