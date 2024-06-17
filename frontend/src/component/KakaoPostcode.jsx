import DaumPostcode from 'react-daum-postcode';
import {Box} from "@chakra-ui/react";

const KakaoPostcode = () => {

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


  return <Box>
    <DaumPostcode  theme={themeObj}/>
  </Box>
}

export default KakaoPostcode;