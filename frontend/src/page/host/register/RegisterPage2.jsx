import React from "react";
import { Box, TextField } from "@mui/material";

const RegisterPage2 = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    setFormData({ ...formData, page2Data: event.target.value });
  };

  return (
    <Box>
      <TextField
        label="이메일 주소"
        variant="outlined"
        value={formData.page2Data}
        onChange={handleChange}
        fullWidth
      />
    </Box>
  );
};

export default RegisterPage2;
