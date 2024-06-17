import DaumPostcode, {useDaumPostcodePopup} from 'react-daum-postcode';
import {Box, Button} from "@chakra-ui/react";
import {postcodeScriptUrl} from "react-daum-postcode/lib/loadPostcode.js";

const KakaoPostcode = () => {

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  // Postcode css
  const themeObj = {
    bgColor: "", 			// 바탕 배경색
    searchBgColor: "", 		// 검색창 배경색
    contentBgColor: "", 		// 본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
    pageBgColor: "", 		// 페이지 배경색
    textColor: "", 			// 기본 글자색
    queryTextColor: "", 		// 검색창 글자색
    postcodeTextColor: "", 	// 우편번호 글자색
    emphTextColor: "", 		// 강조 글자색
    outlineColor: "" 		// 테두리
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` ${extraAddress}` : '';
    }
  };

  const handleClick = () => {
    open({onComplete: handleComplete})
  };

  return <Button onClick={handleClick}>
    주소검색
  </Button>
}

export default KakaoPostcode;