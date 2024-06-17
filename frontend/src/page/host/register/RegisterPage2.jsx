import React from "react";
import {Box, Button, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Stack} from "@chakra-ui/react";
import KakaoMap from "../../../component/KakaoMap.jsx";
import KakaoPostcode from "../../../component/KakaoPostcode.jsx";

const RegisterPage2 = ({formData, setFormData}) => {
  const handleLocationChange = (e) => setFormData({...formData, location: e.target.value});

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel>주소</FormLabel>
        <Stack spacing={4}>
          <InputGroup>
            <InputLeftAddon>우편번호</InputLeftAddon>
            <Input/>
            <KakaoPostcode/>
          </InputGroup>
        </Stack>
        <KakaoMap/>
      </FormControl>
    </Box>
  );
};

export default RegisterPage2;
