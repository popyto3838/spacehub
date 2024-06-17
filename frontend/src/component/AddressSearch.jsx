import React, {useState, useRef} from 'react';
import {useDaumPostcodePopup} from 'react-daum-postcode';
import {Input, Button, FormControl, FormLabel, Box} from '@chakra-ui/react';

function AddressSearch({onAddressSelect}) {

  const [address, setAddress] = useState({
    zonecode: '',
    address: '',
    detailAddress: '',
    extraAddress: '',
  });

  const handleComplete = (data) => {
    let fullAddress = data.address; // 주소 변수
    let extraAddress = ''; // 참고항목 변수

    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
      fullAddress = data.roadAddress;
    } else { // 사용자가 지번 주소를 선택했을 경우(J)
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

    setAddress({
      zonecode: data.zonecode,
      address: fullAddress,
      detailAddress: '',
      extraAddress: extraAddress,
    });
  };

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleClick = () => {
    window.daum.postcode.load(() => {
      const postcode = new window.daum.Postcode({
        oncomplete: handleComplete,
      });
      postcode.open();
    });
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="postcode">우편번호</FormLabel>
        <Input id="postcode" name="zonecode" placeholder="우편번호" value={address.zonecode} isReadOnly/>
        <Button onClick={handleClick}>우편번호 / 주소 찾기</Button>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="address">주소</FormLabel>
        <Input id="address" name="address" placeholder="주소" value={address.address} isReadOnly/>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="detailAddress">상세주소</FormLabel>
        <Input id="detailAddress" name="detailAddress" placeholder="상세주소" value={address.detailAddress}
               onChange={handleInputChange}/>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="extraAddress">참고항목</FormLabel>
        <Input id="extraAddress" name="extraAddress" placeholder="참고항목" value={address.extraAddress} isReadOnly/>
      </FormControl>
    </Box>
  );
}

export default AddressSearch;
