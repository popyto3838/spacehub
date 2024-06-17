import React from "react";
import {Box, FormControl, FormLabel, Textarea} from "@chakra-ui/react";

const RegisterPage4 = ({formData, setFormData}) => {
  const handlePriceChange = (e) => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        price: e.target.value,
      },
    });
  };
  const handleCapacityChange = (e) => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        capacity: e.target.value,
      },
    });
  };
  const handleFloorChange = (e) => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        floor: e.target.value,
      },
    });
  };
  const handleParkingSpaceChange = (e) => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}), // formData.page3Data가 존재하지 않을 경우 빈 객체로 초기화
        parkingSpace: e.target.value,
      },
    });
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-price">시간 당 가격</FormLabel>
        <Textarea
          id="space-price"
          value={(formData.page4Data && formData.page4Data.price) || ''} // formData.page4Data가 존재할 때만 price 값을 사용
          onChange={handlePriceChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-capacity">수용 인원</FormLabel>
        <Textarea
          id="space-capacity"
          value={(formData.page4Data && formData.page4Data.capacity) || ''} // formData.page4Data가 존재할 때만 facility 값을 사용
          onChange={handleCapacityChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-floor">층 수</FormLabel>
        <Textarea
          id="space-floor"
          value={(formData.page4Data && formData.page4Data.floor) || ''} // formData.page4Data가 존재할 때만 floor 값을 사용
          onChange={handleFloorChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-parkingSpace">주차가능 차량 수</FormLabel>
        <Textarea
          id="space-parkingSpace"
          value={(formData.page4Data && formData.page4Data.parkingSpace) || ''} // formData.page4Data가 존재할 때만 parkingSpace 값을 사용
          onChange={handleParkingSpaceChange}
        />
      </FormControl>
    </Box>
  );
};

export default RegisterPage4;