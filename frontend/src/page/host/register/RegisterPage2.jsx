import React from "react";
import {Box, FormControl, FormLabel} from "@chakra-ui/react";
import AddressSearch from "../../../component/AddressSearch.jsx";

const RegisterPage2 = ({formData, setFormData}) => {

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
    <Box >
      <FormControl mb={4}>
        <FormLabel>주소</FormLabel>
        <AddressSearch autoClose onAddressSelect={handleAddressSelect} theme={postCodeStyle}/>
      </FormControl>
    </Box>
  );
};

export default RegisterPage2;
