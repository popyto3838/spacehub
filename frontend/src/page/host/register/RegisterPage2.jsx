import React from "react";
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";

const RegisterPage2 = ({ formData, setFormData }) => {
  const handleCapacityChange = (e) => setFormData({ ...formData, capacity: e.target.value });
  // ... (다른 필드에 대한 onChange 핸들러 추가)

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-capacity">수용 인원</FormLabel>
        <Input id="space-capacity" type="number" onChange={handleCapacityChange} />
      </FormControl>
      {/* ... (나머지 입력 필드: floor, parkingSpaces, price 등) */}
    </Box>
  );
};

export default RegisterPage2;
