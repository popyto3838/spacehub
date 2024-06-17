import React from "react";
import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const RegisterPage3 = ({ formData, setFormData }) => {
  const handleIntroChange = (e) => setFormData({ ...formData, introduce: e.target.value });
  const handleFacilityChange = (e) => setFormData({ ...formData, facility: e.target.value });
  const handleNoticeChange = (e) => setFormData({ ...formData, notice: e.target.value });

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-intro">공간 소개</FormLabel>
        <Textarea id="space-intro" onChange={handleIntroChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-facility">시설 안내</FormLabel>
        <Textarea id="space-facility" onChange={handleFacilityChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-notice">유의 사항</FormLabel>
        <Textarea id="space-notice" onChange={handleNoticeChange} />
      </FormControl>
    </Box>
  );
};

export default RegisterPage3;
