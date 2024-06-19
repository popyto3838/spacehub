import React, {useEffect, useRef, useState} from 'react';
import {useDaumPostcodePopup} from 'react-daum-postcode';
import {Button} from '@chakra-ui/react';

function AddressSearch({ onAddressChange, value = {} }) {
  const open = useDaumPostcodePopup();
  const popupRef = useRef(null);

  const [address, setAddress] = useState({
    postcode: value.zonecode || '',
    address: value.address || '',
    detailAddress: value.detailAddress || '',
    extraAddress: value.extraAddress || '',
    latitude: value.latitude || '', // 위도 추가
    longitude: value.longitude || '', // 경도 추가
  });

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
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

    // 주소-좌표 변환
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(fullAddress + extraAddress, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const { x: longitude, y: latitude } = result[0];
        const newAddress = {
          zonecode: data.zonecode,
          address: fullAddress,
          detailAddress: '',
          extraAddress: extraAddress,
          latitude, // 위도 추가
          longitude, // 경도 추가
        };

        onAddressChange(newAddress); // 상위 컴포넌트에 변경된 주소 전달
      }

      if (popupRef.current) {
        popupRef.current.close();
      }
    });
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
      onOpen: (popup) => {
        popupRef.current = popup;
      },
    });
  };

  return (
    <Button onClick={handleClick}>우편번호 / 주소 찾기</Button>
  );
}

export default AddressSearch;
