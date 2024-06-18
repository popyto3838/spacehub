import React, {useState} from "react";
import { Box, Heading } from "@chakra-ui/react";
import AddressSearch from "../../../component/AddressSearch.jsx";

const RegisterPage2 = ({ formData, setFormData }) => {
  const [detailedAddress, setDetailedAddress] = useState({
    zonecode: '',
    address: '',
    detailAddress: '',
    extraAddress: '',
  });

  const handleAddressChange = (newAddress) => {
    setDetailedAddress(newAddress);
    setFormData({
      ...formData,
      page2Data: {
        ...(formData.page2Data || {}),
        location: newAddress.address + newAddress.extraAddress,
        zonecode: newAddress.zonecode, // 우편번호 추가
        address: newAddress.address,   // 기본 주소 추가
        detailAddress: newAddress.detailAddress, // 상세 주소 추가
        extraAddress: newAddress.extraAddress,   // 참고 항목 추가
      },
    });
  };

  return (
    <Box>
      <Heading>등록 공간 주소</Heading>
      <AddressSearch
        onAddressChange={handleAddressChange}
        value={formData.page2Data?.location || ''} // 현재 주소 데이터를 전달
      />

    </Box>
  );
};

export default RegisterPage2;
