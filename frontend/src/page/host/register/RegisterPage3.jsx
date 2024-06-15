import React from "react";
import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const RegisterPage3 = ({ formData, setFormData }) => {
  const handleIntroChange = (e) => setFormData({ ...formData, intro: e.target.value });
  // ... (다른 필드에 대한 onChange 핸들러 추가)

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-intro">공간 소개</FormLabel>
        <Textarea id="space-intro" onChange={handleIntroChange} />
      </FormControl>
      {/* ... (나머지 입력 필드: facilityInfo, rules 등) */}
    </Box>
  );
};

export default RegisterPage3;
