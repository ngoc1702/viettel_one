import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export interface Location {
  code: number;
  name: string;
}
export type Ward = Location;

export interface District extends Location {
  wards: Ward[];
}

export interface Province extends Location {
  districts: District[];
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

export interface AddressErrors {
  cityCode?: string;
  districtCode?: string;
  wardCode?: string;
  detail?: string;
}

export default function AddressForm({
  onChange,
  isSubmitted,
}: {
  onChange: (address: AddressData) => void;
  isSubmitted: boolean;
}) {
  const [cities, setCities] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get<Location[]>(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setCities(res.data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  const fetchDistricts = useCallback(async (cityCode: string) => {
    if (cityCode) {
      try {
        const res = await axios.get<Province>(
          `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
        );
        setDistricts(res.data.districts);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    }
  }, []);

  const fetchWards = useCallback(async (districtCode: string) => {
    if (districtCode) {
      try {
        const res = await axios.get<District>(
          `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        setWards(res.data.wards);
      } catch (err) {
        console.error("Error fetching wards:", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchDistricts(selectedCityCode);
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setDistricts([]);
    setWards([]);
  }, [selectedCityCode, fetchDistricts]);

  useEffect(() => {
    fetchWards(selectedDistrictCode);
    setSelectedWardCode("");
    setWards([]);
  }, [selectedDistrictCode, fetchWards]);

  useEffect(() => {
    const cityName =
      cities.find((c) => c.code.toString() === selectedCityCode)?.name || "";
    const districtName =
      districts.find((d) => d.code.toString() === selectedDistrictCode)?.name ||
      "";
    const wardName =
      wards.find((w) => w.code.toString() === selectedWardCode)?.name || "";

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
  }, [
    selectedCityCode,
    selectedDistrictCode,
    selectedWardCode,
    detailAddress,
    cities,
    districts,
    wards,
    onChange,
  ]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCityCode(e.target.value);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictCode(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardCode(e.target.value);
  };

  return (
    <div>
      <div className="block mb-3 text-base font-semibold text-gray-700">
        Nhập địa chỉ
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 md:gap-y-4 gap-4">
        {/* Tỉnh/Thành phố */}
        <div>
          <select
            name="cityName"
            value={selectedCityCode}
            onChange={handleCityChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
          {isSubmitted && !selectedCityCode && (
            <p className="text-red-500 text-sm mt-1">
              Vui lòng chọn Tỉnh/Thành phố
            </p>
          )}
        </div>

        {/* Quận/Huyện */}
        <div>
          <select
            name="districtName"
            value={selectedDistrictCode}
            onChange={handleDistrictChange}
            className="w-full border rounded px-3 py-2"
            disabled={!selectedCityCode}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
          {isSubmitted && selectedCityCode && !selectedDistrictCode && (
            <p className="text-red-500 text-sm mt-1">
              Vui lòng chọn Quận/Huyện
            </p>
          )}
        </div>

        {/* Phường/Xã */}
        <div>
          <select
            name="wardName"
            value={selectedWardCode}
            onChange={handleWardChange}
            className="w-full border rounded px-3 py-2"
            disabled={!selectedDistrictCode}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
          {isSubmitted && selectedDistrictCode && !selectedWardCode && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn Phường/Xã</p>
          )}
        </div>

        {/* Địa chỉ chi tiết */}
        <div>
          <input
            type="text"
            name="detail"
            placeholder="Số nhà, tên đường..."
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {isSubmitted && selectedCityCode && selectedDistrictCode && selectedWardCode && !detailAddress && (
            <p className="text-red-500 text-sm mt-1">
              Vui lòng nhập địa chỉ chi tiết
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


