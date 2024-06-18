import React from "react";
import { Box, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const RegisterPage3 = ({ formData, setFormData }) => {
  const handleIntroChange = (e) => {
    setFormData({
      ...formData,
      page3Data: {
        ...(formData.page3Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        introduce: e.target.value,
      },
    });
  };
  const handleFacilityChange = (e) => {
    setFormData({
      ...formData,
      page3Data: {
        ...(formData.page3Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        facility: e.target.value,
      },
    });
  };
  const handleNoticeChange = (e) => {
    setFormData({
      ...formData,
      page3Data: {
        ...(formData.page3Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        notice: e.target.value,
      },
    });
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-intro">공간 소개</FormLabel>
        <Textarea
          id="space-intro"
          value={(formData.page3Data && formData.page3Data.introduce) || ''} // formData.page3Data가 존재할 때만 introduce 값을 사용
          onChange={handleIntroChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-facility">시설 안내</FormLabel>
        <Textarea
          id="space-facility"
          value={(formData.page3Data && formData.page3Data.facility) || ''} // formData.page3Data가 존재할 때만 facility 값을 사용
          onChange={handleFacilityChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-notice">유의 사항</FormLabel>
        <Textarea
          id="space-notice"
          value={(formData.page3Data && formData.page3Data.notice) || ''} // formData.page3Data가 존재할 때만 notice 값을 사용
          onChange={handleNoticeChange}
        />
      </FormControl>
    </Box>
  );
};

export default RegisterPage3;