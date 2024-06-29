import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  useToast
} from '@chakra-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons';
import axios from "axios";

const RegisterPage5 = ({formData, setFormData}) => {
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const [startThumbnailIndex, setStartThumbnailIndex] = useState(0);
  const toast = useToast();
  const thumbnailContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]); // 기존 이미지 미리보기 URL

  // 썸네일 너비 및 보이는 썸네일 개수 계산
  const thumbnailWidth = 150; // 썸네일 이미지 너비 (margin 포함)
  const visibleThumbnails = containerWidth ? Math.floor(containerWidth / thumbnailWidth) : 5;

  // handleResize 함수 정의
  const handleResize = () => {
    if (thumbnailContainerRef.current) {
      setContainerWidth(thumbnailContainerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (formData.files) {
      Promise.all(
        formData.files.map(async file => {
          if (typeof file === 'string') {
            try {
              const response = await axios.get(file, {responseType: 'blob'});
              return URL.createObjectURL(response.data);
            } catch (error) {
              console.error("Error fetching image:", error);
              toast({
                title: '이미지 불러오기 오류',
                description: '이미지를 불러오는 중 오류가 발생했습니다.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              return null; // 오류 발생 시 null 반환
            }
          } else {
            return URL.createObjectURL(file.file); // file.file에서 URL 생성
          }
        })
      )
        .then(newUrls => setPreviewUrls(newUrls.filter(url => url !== null))); // null 값 제거
    }
  }, [formData.files, toast]);

  useEffect(() => {
    // 썸네일 컨테이너 ref가 변경될 때마다 handleResize 함수 호출
    if (thumbnailContainerRef.current) {
      handleResize();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [thumbnailContainerRef]);

  const handleNewFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls(urls);
  };

  const handleDeleteImage = (index, isNewFile = false) => {
    const updatedFiles = isNewFile
      ? newFiles.filter((_, i) => i !== index)
      : formData.files.filter((_, i) => i !== index);
    const updatedUrls = isNewFile
      ? newPreviewUrls.filter((_, i) => i !== index)
      : previewUrls.filter((_, i) => i !== index);

    if (isNewFile) {
      setNewFiles(updatedFiles);
      setNewPreviewUrls(updatedUrls);
    } else {
      setFormData({...formData, files: updatedFiles});
    }
  };

  const handleAddImages = () => {
    const newFilesWithSrc = newFiles.map(file => ({src: URL.createObjectURL(file), file}));
    setFormData(prevFormData => ({
      ...prevFormData,
      files: [...prevFormData.files, ...newFilesWithSrc],
    }));
    setNewFiles([]);
    setNewPreviewUrls([]);
  };

  const goToPreviousThumbnails = () => {
    setStartThumbnailIndex((prevIndex) =>
      Math.max(0, prevIndex - visibleThumbnails)
    );
  };

  const goToNextThumbnails = () => {
    setStartThumbnailIndex((prevIndex) =>
      Math.min(formData.files.length - visibleThumbnails, prevIndex + visibleThumbnails)
    );
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>기존 이미지</Heading>
      <Alert status="info" mb={4}>
        <AlertIcon/>
        <AlertTitle>기존 이미지는 삭제만 가능합니다.</AlertTitle>
      </Alert>
      <HStack spacing={4} overflowX="auto" ref={thumbnailContainerRef}>
        {formData.files.slice(startThumbnailIndex, startThumbnailIndex + visibleThumbnails).map((file, index) => (
          <Box key={index} position="relative">
            <Image src={file.src} alt={`Image ${index + 1}`} maxW="150px"/>
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
      </HStack>
      <HStack justify="space-between" mt={4}>
        <IconButton
          icon={<ChevronLeftIcon/>}
          onClick={goToPreviousThumbnails}
          isDisabled={startThumbnailIndex === 0}
        />
        <IconButton
          icon={<ChevronRightIcon/>}
          onClick={goToNextThumbnails}
          isDisabled={startThumbnailIndex >= formData.files.length - visibleThumbnails} // previewUrls.length 사용
        />
      </HStack>

      <Heading as="h3" size="lg" mt={8} mb={4}>새로운 이미지 업로드</Heading>
      <Alert status="warning" mb={4}>
        <AlertIcon/>
        <AlertTitle>4:3 비율 또는 16:9 비율의 이미지를 권장합니다. 다른 비율의 이미지는 원하시는 형태로 표시되지 않을 수 있습니다.</AlertTitle>
      </Alert>
      <FormControl>
        <FormLabel htmlFor="newImages">사진 업로드</FormLabel>
        <input
          type="file"
          id="newImages"
          multiple
          onChange={handleNewFileChange}
        />
      </FormControl>

      <Box mt={4}>
        <HStack spacing={4} overflowX="auto">
          {newPreviewUrls.map((url, index) => (
            <Box key={index} position="relative">
              <Image src={url} alt={`New Image ${index + 1}`} maxW="150px"/>
              <Button
                size="xs"
                position="absolute"
                top={1}
                right={1}
                onClick={() => handleDeleteImage(index, true)}
              >
                X
              </Button>
            </Box>
          ))}
        </HStack>
      </Box>

      <Button mt={4} colorScheme="teal" onClick={handleAddImages} isDisabled={newFiles.length === 0}>
        이미지 추가
      </Button>
    </Box>
  );
};

export default RegisterPage5;
