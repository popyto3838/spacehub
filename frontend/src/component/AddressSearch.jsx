import React from 'react';
import { Button } from '@chakra-ui/react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

function AddressSearch({ onAddressChange }) {
  const open = useDaumPostcodePopup();

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

    onAddressChange(newAddress); // 상위 컴포넌트에 변경된 주소 전달
  };

  const handleClick = () => {
    open({
      onComplete: handleComplete,
    });
  };

  return (
    <Button onClick={handleClick}>우편번호 / 주소 찾기</Button>
  );
}

export default AddressSearch;
