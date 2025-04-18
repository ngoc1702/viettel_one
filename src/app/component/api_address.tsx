import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


// Define the types for address and errors
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

// AddressFieldError type to track field-specific errors
interface AddressFieldError {
  field: string | null;
  message: string;
}

type AddressErrors = Partial<{
  city: AddressFieldError;
  district: AddressFieldError;
  ward: AddressFieldError;
  detail: AddressFieldError;
}>;

export default function AddressForm({
  onChange,
  error,
  // getAddressError,
}: {
  onChange: (address: AddressData) => void;
  error?: AddressErrors;
  getAddressError: (field: keyof AddressData) => string;
}) {
  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get<Location[]>('https://provinces.open-api.vn/api/?depth=1');
        setCities(res.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    fetchCities();
  }, []);

  // Fetch districts when city is selected
  const fetchDistricts = useCallback(async (cityCode: string) => {
    if (cityCode) {
      try {
        const res = await axios.get<Province>(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
        setDistricts(res.data.districts);
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchDistricts(selectedCityCode);
  }, [selectedCityCode, fetchDistricts]);

  // Fetch wards when district is selected
  const fetchWards = useCallback(async (districtCode: string) => {
    if (districtCode) {
      try {
        const res = await axios.get<District>(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        setWards(res.data.wards);
      } catch (err) {
        console.error('Error fetching wards:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchWards(selectedDistrictCode);
  }, [selectedDistrictCode, fetchWards]);

  // Update parent component when address changes
  useEffect(() => {
    const cityName = cities.find((c) => c.code.toString() === selectedCityCode)?.name || '';
    const districtName = districts.find((d) => d.code.toString() === selectedDistrictCode)?.name || '';
    const wardName = wards.find((w) => w.code.toString() === selectedWardCode)?.name || '';

    const addressData: AddressData = {
      cityCode: selectedCityCode,
      cityName,
      districtCode: selectedDistrictCode,
      districtName,
      wardCode: selectedWardCode,
      wardName,
      detail: detailAddress,
    };

    if (onChange) {
      onChange(addressData);
    }
  }, [selectedCityCode, selectedDistrictCode, selectedWardCode, detailAddress, cities, districts, wards, onChange]);


  return (
    <div>
      <div className="block mb-3 text-base font-semibold text-gray-700">Nhập địa chỉ</div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 md:gap-y-4 gap-4">
        <div>
          <select
            value={selectedCityCode}
            onChange={(e) => setSelectedCityCode(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
          {error?.city && <span className="text-red-500 text-sm mt-1">{error.city.message}</span>}
        </div>

        <div>
          <select
            value={selectedDistrictCode}
            onChange={(e) => setSelectedDistrictCode(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
            disabled={!selectedCityCode}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
          {error?.district && <span className="text-red-500 text-sm mt-1">{error.district.message}</span>}
        </div>

        <div>
          <select
            value={selectedWardCode}
            onChange={(e) => setSelectedWardCode(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
            disabled={!selectedDistrictCode}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
          {error?.ward && <span className="text-red-500 text-sm mt-1">{error.ward.message}</span>}
      </div>
     
      <div className="">
        <input
          type="text"
          placeholder="Địa chỉ cụ thể"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full"
        />
        {error?.detail && <span className="text-red-500 text-sm mt-1">{error.detail.message}</span>}
      </div>
    </div>
    </div>
  );
}
