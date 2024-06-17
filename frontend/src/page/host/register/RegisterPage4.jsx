import React from "react";
import {Box, FormControl, FormLabel, Textarea} from "@chakra-ui/react";

const RegisterPage4 = ({formData, setFormData}) => {
  const handlePriceChange = (e) =>
    setFormData({
      ...formData,
      page4: {...formData.page4, price: e.target.value}
    });
  const handleCapacityChange = (e) =>
    setFormData({
      ...formData,
      page4: {...formData.page4, capacity: e.target.value}
    });
  const handleFloorChange = (e) =>
    setFormData({
      ...formData,
      page4: {...formData.page4, floor: e.target.value}
    });
  const handleParkingSpaceChange = (e) => setFormData({
    ...formData,
    page4: {...formData.page4, parkingSpace: e.target.value}
  });

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-intro">시간 당 가격</FormLabel>
        <Textarea id="space-intro" onChange={handlePriceChange}/>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-facility">수용 인원</FormLabel>
        <Textarea id="space-facility" onChange={handleCapacityChange}/>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-notice">층 수</FormLabel>
        <Textarea id="space-notice" onChange={handleFloorChange}/>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-parkingSpace">주차가능 차량 수</FormLabel>
        <Textarea id="space-parkingSpace" onChange={handleParkingSpaceChange}/>
      </FormControl>
    </Box>
  );
};

export default RegisterPage4;