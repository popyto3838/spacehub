import React, {useEffect, useState} from "react";
import { Box, Heading, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import AddressSearch from "../../../component/AddressSearch.jsx";
import KakaoMap from "../../../component/KakaoMap.jsx";

const RegisterPage2 = ({ formData, setFormData }) => {
  const [detailedAddress, setDetailedAddress] = useState({
    zonecode: formData.page2Data?.zonecode || '',
    address: formData.page2Data?.address || '',
    detailAddress: formData.page2Data?.detailAddress || '',
    extraAddress: formData.page2Data?.extraAddress || '',
  });

  const handleAddressChange = (newAddress) => {
    setDetailedAddress(newAddress);
    setFormData({
      ...formData,
      page2Data: {
        ...(formData.page2Data || {}),
        location: newAddress.address + newAddress.extraAddress,
        zonecode: newAddress.zonecode,
        address: newAddress.address,
        detailAddress: newAddress.detailAddress,
        extraAddress: newAddress.extraAddress,
      },
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedAddress = {
      ...detailedAddress,
      [name]: value,
    };
    setDetailedAddress(updatedAddress);
    setFormData({
      ...formData,
      page2Data: updatedAddress,
    });
  };

  useEffect(() => {
    if (detailedAddress.address) {
      const fullAddress = detailedAddress.address + (detailedAddress.extraAddress || '');
      // KakaoMap 컴포넌트로 주소 데이터를 전달하여 지도 업데이트
      window.dispatchEvent(new CustomEvent('updateMap', { detail: fullAddress }));
    }
  }, [detailedAddress]);

  return (
    <Box>
      <Heading>등록 공간 주소</Heading>
      <FormControl mb={4}>
        <FormLabel htmlFor="postcode">우편번호</FormLabel>
        <Input id="postcode" name="zonecode" placeholder="우편번호" value={detailedAddress.zonecode}  />
        <AddressSearch onAddressChange={handleAddressChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="address">주소</FormLabel>
        <Input id="address" name="address" placeholder="주소" value={detailedAddress.address}  />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="detailAddress">상세주소</FormLabel>
        <Input
          id="detailAddress"
          name="detailAddress"
          placeholder="상세주소"
          value={detailedAddress.detailAddress}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="extraAddress">참고항목</FormLabel>
        <Input id="extraAddress" name="extraAddress" placeholder="참고항목" value={detailedAddress.extraAddress}  />
      </FormControl>
      <KakaoMap address={detailedAddress.address + (detailedAddress.extraAddress || '')} />
    </Box>
  );
};

export default RegisterPage2;
