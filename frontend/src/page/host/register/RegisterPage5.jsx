import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Text, Button, Image } from '@chakra-ui/react';

const RegisterPage5 = ({ formData, setFormData }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    setFormData({ ...formData, images: files }); // FormData에 images 추가
  };

  const handleDeleteImage = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <FormControl>
        <FormLabel htmlFor="images">사진 업로드</FormLabel>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleFileChange}
        />
      </FormControl>

      <Box mt={4}>
        {previewUrls.map((url, index) => (
          <Box key={index} display="inline-block" mr={2} position="relative">
            <Image src={url} alt={`Image ${index + 1}`} maxW="150px" />
            <Button
              size="xs"
              position="absolute"
              top={1}
              right={1}
              onClick={() => handleDeleteImage(index)}
            >
              X
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RegisterPage5;