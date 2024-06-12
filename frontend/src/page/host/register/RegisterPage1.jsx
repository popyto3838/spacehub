import React from "react";
import { Box, TextField } from "@mui/material";

const RegisterPage1 = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    setFormData({ ...formData, nickname: event.target.value });
  };

  return (
    <Box>
      <TextField
        label="사용자 이름"
        variant="outlined"
        value={formData.nickname}
        onChange={handleChange}
        fullWidth
      />
    </Box>
  );
};

export default RegisterPage1;
