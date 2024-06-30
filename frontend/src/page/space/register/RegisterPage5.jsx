import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AlertDescription,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack,
  Text,
  Stack,
  Spacer,
  Divider,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

const RegisterPage5 = ({ formData, setFormData, deletedFiles, setDeletedFiles, newFiles, setNewFiles }) => {
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);
  const toast = useToast();
  const [previewUrls, setPreviewUrls] = useState([]); // 기존 이미지 미리보기 URL
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (formData.files) {
      setPreviewUrls(formData.files.map(file => URL.createObjectURL(file.file)));
    }
  }, [formData.files]);

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 URL 해제
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls, newPreviewUrls]);

  const handleNewFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = formData.files.length + newFiles.length + files.length;

    if (totalFiles > 10) {
      toast({
        title: '이미지 업로드 제한',
        description: '이미지는 최대 10장까지만 업로드할 수 있습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 중복 파일 검사
    const existingFileNames = new Set([...formData.files.map(f => f.file.name), ...newFiles.map(f => f.name)]);
    const nonDuplicateFiles = files.filter(file => !existingFileNames.has(file.name));

    if (nonDuplicateFiles.length !== files.length) {
      toast({
        title: '중복 파일 제외',
        description: '이미 추가된 파일은 업로드할 수 없습니다.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }

    setNewFiles([...newFiles, ...nonDuplicateFiles]);

    const urls = nonDuplicateFiles.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls([...newPreviewUrls, ...urls]);
  };

  const handleDeleteImage = useCallback((index, isNewFile = false) => {
    if (isNewFile) {
      URL.revokeObjectURL(newPreviewUrls[index]);
      const updatedNewFiles = newFiles.filter((_, i) => i !== index);
      const updatedNewPreviewUrls = newPreviewUrls.filter((_, i) => i !== index);
      setNewFiles(updatedNewFiles);
      setNewPreviewUrls(updatedNewPreviewUrls);
    } else {
      URL.revokeObjectURL(previewUrls[index]);
      const updatedFiles = formData.files.filter((_, i) => i !== index);
      const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
      setFormData({ ...formData, files: updatedFiles });
      setDeletedFiles([...deletedFiles, formData.files[index].id]); // 삭제된 파일 추가
      setPreviewUrls(updatedPreviewUrls);
    }
  }, [newFiles, newPreviewUrls, formData, previewUrls, deletedFiles, setFormData, setNewFiles, setNewPreviewUrls, setDeletedFiles]);

  const handleAddImages = () => {
    const newFilesWithSrc = newFiles.map(file => ({ file }));
    setFormData(prevFormData => ({
      ...prevFormData,
      files: [...prevFormData.files, ...newFilesWithSrc],
    }));
    setNewFiles([]);
    setNewPreviewUrls([]);
  };

  const openImageModal = (url) => {
    setSelectedImage(url);
    onOpen();
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>기존 이미지</Heading>
      <Alert status="info" mb={4}>
        <AlertIcon />
        <AlertTitle>기존 이미지는 삭제만 가능합니다.</AlertTitle>
        <AlertDescription>(이미지를 클릭하면 확대하여 볼 수 있습니다.)</AlertDescription>
      </Alert>
      <HStack spacing={4} wrap="wrap">
        {previewUrls.map((url, index) => (
          <Box key={index} position="relative" width="150px" height="150px" boxShadow="md" borderRadius="md" overflow="hidden">
            <Image src={url} alt={`Image ${index + 1}`} boxSize="150px" objectFit="cover" onClick={() => openImageModal(url)} cursor="pointer" />
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              position="absolute"
              top="2"
              right="2"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(index);
              }}
            />
          </Box>
        ))}
      </HStack>

      <Heading as="h3" size="lg" mt={8} mb={4}>새로운 이미지 업로드</Heading>
      <Alert status="warning" mb={4}>
        <AlertIcon />
        <AlertTitle>4:3 비율의 이미지를 권장합니다. 다른 비율의 이미지는 원하시는 형태로 표시되지 않을 수 있습니다.</AlertTitle>
      </Alert>
      <FormControl mb={4}>
        <FormLabel htmlFor="newImages">사진 업로드</FormLabel>
        <input
          type="file"
          id="newImages"
          multiple
          onChange={handleNewFileChange}
          style={{ display: 'none' }}
        />
        <Button as="label" htmlFor="newImages" leftIcon={<AddIcon />} colorScheme="teal">
          이미지 선택
        </Button>
        <Box mt={2} color="gray.500">
          최대 10장까지 이미지를 업로드할 수 있습니다.
        </Box>
      </FormControl>

      <HStack spacing={4} wrap="wrap">
        {newPreviewUrls.map((url, index) => (
          <Box key={index} position="relative" width="150px" height="150px" boxShadow="md" borderRadius="md" overflow="hidden">
            <Image src={url} alt={`New Image ${index + 1}`} boxSize="150px" objectFit="cover" onClick={() => openImageModal(url)} cursor="pointer" />
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              position="absolute"
              top="2"
              right="2"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(index, true);
              }}
            />
          </Box>
        ))}
      </HStack>

      <Button mt={4} colorScheme="teal" onClick={handleAddImages} isDisabled={newFiles.length === 0}>
        이미지 추가
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>이미지 확대 보기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && <Image src={selectedImage} alt="Selected Image" width="100%" />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisterPage5;
