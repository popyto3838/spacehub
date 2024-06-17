import React from "react";
import {Box, FormControl, FormLabel, Heading} from "@chakra-ui/react";
import AddressSearch from "../../../component/AddressSearch.jsx";

const RegisterPage2 = ({formData, setFormData}) => {
  const handleLocationChange = (e) => setFormData({...formData, location: e.target.value});

  const postCodeStyle = {
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

  const handleAddressSelect = (selectedAddress) => {
    setFormData({...formData, location: selectedAddress});
  }

  return (
    <Box>
      <Heading>등록 공간 주소</Heading>
      <AddressSearch onChange={handleLocationChange} autoClose onAddressSelect={handleAddressSelect}
                     theme={postCodeStyle}/>
    </Box>
  );
};

export default RegisterPage2;