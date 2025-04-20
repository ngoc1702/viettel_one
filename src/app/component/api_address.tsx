import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
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

export type AddressData = {
  cityName: string;
  districtName: string;
  wardName: string;
  detail: string;
};

export interface AddressFormHandle {
  reset: () => void;
}

interface AddressFormProps {
  value: AddressData;
  onChange: (data: Partial<AddressData>) => void;
  errors?: {
    cityName?: string;
    districtName?: string;
    wardName?: string;
    detail?: string;
  };
  validateField?: (name: keyof AddressData, value: string) => void;
}

const AddressForm = forwardRef<AddressFormHandle, AddressFormProps>(
  ({ value, onChange, errors = {}, validateField }, ref: Ref<AddressFormHandle>) => {
    const [cities, setCities] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [wards, setWards] = useState<Location[]>([]);

    const [selectedCityCode, setSelectedCityCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [selectedWardCode, setSelectedWardCode] = useState("");
    const [detailAddress, setDetailAddress] = useState(value.detail || "");

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
        districts.find((d) => d.code.toString() === selectedDistrictCode)?.name || "";
      const wardName =
        wards.find((w) => w.code.toString() === selectedWardCode)?.name || "";
    
      const newAddressData: AddressData = {
        cityName,
        districtName,
        wardName,
        detail: detailAddress,
      };
    
      // So sánh trước khi gọi onChange để tránh update vô hạn
      if (
        newAddressData.cityName !== value.cityName ||
        newAddressData.districtName !== value.districtName ||
        newAddressData.wardName !== value.wardName ||
        newAddressData.detail !== value.detail
      ) {
        onChange(newAddressData);
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
      value.cityName,
      value.districtName,
      value.wardName,
      value.detail,
    ]);

    useImperativeHandle(ref, () => ({
      reset() {
        onChange({
          cityName: "",
          districtName: "",
          wardName: "",
          detail: "",
        });
        setSelectedCityCode("");
        setSelectedDistrictCode("");
        setSelectedWardCode("");
        setDetailAddress("");
      },
    }));

    return (
      <div>
        <div className="block mb-3 text-base font-semibold text-gray-700">
          Nhập địa chỉ
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 md:gap-y-4 gap-4">
          <div>
            <select
              name="cityName"
              value={selectedCityCode}
              onChange={(e) => {
                setSelectedCityCode(e.target.value);
                validateField?.("cityName", e.target.value);
              }}
              className="w-full border text-sm rounded-lg p-2.5"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityName && <div className="text-red-500 text-sm mt-1">{errors.cityName}</div>}
          </div>

          <div>
            <select
              name="districtName"
              value={selectedDistrictCode}
              onChange={(e) => {
                setSelectedDistrictCode(e.target.value);
                validateField?.("districtName", e.target.value);
              }}
              className="w-full border text-sm rounded-lg p-2.5"
              disabled={!selectedCityCode}
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.districtName && (
              <div className="text-red-500 text-sm mt-1">{errors.districtName}</div>
            )}
          </div>

          <div>
            <select
              name="wardName"
              value={selectedWardCode}
              onChange={(e) => {
                setSelectedWardCode(e.target.value);
                validateField?.("wardName", e.target.value);
              }}
              className="w-full border text-sm rounded-lg p-2.5"
              disabled={!selectedDistrictCode}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
            {errors.wardName && <div className="text-red-500 text-sm mt-1">{errors.wardName}</div>}
          </div>

          <div>
            <input
              type="text"
              name="detail"
              placeholder="Số nhà, tên đường..."
              value={detailAddress}
              onChange={(e) => {
                setDetailAddress(e.target.value);
                validateField?.("detail", e.target.value);
              }}
              className="w-full border text-sm rounded-lg p-2.5"
            />
            {errors.detail && <div className="text-red-500 text-sm rounded-lg p-2.5">{errors.detail}</div>}
          </div>
        </div>
      </div>
    );
  }
);
AddressForm.displayName = "AddressForm";
export default AddressForm;
