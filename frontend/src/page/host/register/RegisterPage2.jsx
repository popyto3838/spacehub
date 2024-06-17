import React from "react";
import {Box, FormControl, FormLabel} from "@chakra-ui/react";
import KakaoPostcode from "../../../component/KakaoPostcode.jsx";
import KakaoMap from "../../../component/KakaoMap.jsx";

const RegisterPage2 = ({ formData, setFormData }) => {
  const handleLocationChange = (e) => setFormData({...formData, location: e.target.value});
  // ... (다른 필드에 대한 onChange 핸들러 추가)

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-location">주소</FormLabel>
        <KakaoPostcode/>
        <KakaoMap/>
      </FormControl>
    </Box>
  );
};

export default RegisterPage2;
