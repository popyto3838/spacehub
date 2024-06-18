import React, { useState } from 'react';
import { Input, Button, FormControl, FormLabel, Box } from '@chakra-ui/react';
// import { useDaumPostcodePopup } from 'react-daum-postcode';

function AddressSearch({ onAddressChange, value = {} }) {
  const open = useDaumPostcodePopup();

  const [address, setAddress] = useState({
    zonecode: value.zonecode || '',
    address: value.address || '',
    detailAddress: value.detailAddress || '',
    extraAddress: value.extraAddress || '',
  });

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.userSelectedType === 'R') {
      fullAddress = data.roadAddress;
    } else {
      fullAddress = data.jibunAddress;
    }
    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
      extraAddress += data.bname;
    }
    if (data.buildingName !== '' && data.apartment === 'Y') {
      extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
    }
    if (extraAddress !== '') {
      extraAddress = ` (${extraAddress})`;
    }

    const newAddress = {
      zonecode: data.zonecode,
      address: fullAddress,
      detailAddress: '',
      extraAddress: extraAddress,
    };

    setAddress(newAddress);
    onAddressChange(newAddress); // 상위 컴포넌트에 변경된 주소 전달
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newAddress = {
      ...address,
      [name]: value,
    };
    setAddress(newAddress);
    onAddressChange(newAddress); // 상위 컴포넌트에 변경된 주소 전달
  };

  const handleClick = () => {
    open({
      onComplete: handleComplete,
    });
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="postcode">우편번호</FormLabel>
        <Input id="postcode" name="zonecode" placeholder="우편번호" value={address.zonecode} readOnly />
        <Button onClick={handleClick}>우편번호 / 주소 찾기</Button>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="address">주소</FormLabel>
        <Input id="address" name="address" placeholder="주소" value={address.address} readOnly />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="detailAddress">상세주소</FormLabel>
        <Input
          id="detailAddress"
          name="detailAddress"
          placeholder="상세주소"
          value={address.detailAddress}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="extraAddress">참고항목</FormLabel>
        <Input id="extraAddress" name="extraAddress" placeholder="참고항목" value={address.extraAddress} readOnly />
      </FormControl>
    </Box>
  );
}

export default AddressSearch;
