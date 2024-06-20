import React, {useState} from 'react';
import {Box, FormControl, FormLabel, Text, Button, Image} from '@chakra-ui/react';

const RegisterPage5 = ({formData, setFormData}) => {
  // selectedFiles 상태를 formData.files와 동기화
  const [selectedFiles, setSelectedFiles] = useState(formData.files || []);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // files를 formData에 직접 저장
    setFormData({...formData, files: files});
  };

  const handleDeleteImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));

    // 삭제된 파일을 formData에서도 제거
    setFormData({...formData, files: updatedFiles});
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
            <Image src={url} alt={`Image ${index + 1}`} maxW="150px"/>
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