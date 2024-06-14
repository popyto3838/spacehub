import React from "react";
import {Box, TextField} from "@mui/material";

const RegisterPage1 = ({formData, setFormData}) => {
  const handleChange = (event) => {
    setFormData({...formData, nickname: event.target.value});
  };

  return (
    <>
      <Box mb={6}>
        <TextField
          label="등록 공간 이름"
          variant="outlined"
          value={formData.nickname}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box mt={6}>
        <TextField
          label="공간에 대한 한 줄 소개"
          variant="outlined"
          value={formData.nickname}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <Box mt={6}>
        <TextField
          label="시간 당 가격"
          variant="outlined"
          value={formData.nickname}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </>
  );
};

export default RegisterPage1;
