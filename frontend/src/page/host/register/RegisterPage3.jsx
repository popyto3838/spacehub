import React from "react";
import { Box, TextField } from "@mui/material";

const RegisterPage3 = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    setFormData({ ...formData, page3Data: event.target.value });
  };

  return (
    <Box>
      <TextField
        label="비밀번호"
        variant="outlined"
        type="password"
        value={formData.page3Data}
        onChange={handleChange}
        fullWidth
      />
    </Box>
  );
};

export default RegisterPage3;
