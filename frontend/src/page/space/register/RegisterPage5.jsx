import React, { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';

const RegisterPage5 = ({ formData, setFormData, deletedFiles, setDeletedFiles, newFiles, setNewFiles }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDeleteImage = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== id)
    }));
    setDeletedFiles(prev => [...prev, id]);
  }, [setFormData, setDeletedFiles]);

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

    const existingFileNames = new Set([...formData.files.map(f => f.name), ...newFiles.map(f => f.name)]);
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

    setNewFiles(prev => [...prev, ...nonDuplicateFiles]);
  };

  const handleDeleteNewImage = useCallback((index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  }, [setNewFiles]);

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
        {formData.files.map((file) => (
          <Box key={file.id} position="relative" width="150px" height="150px" boxShadow="md" borderRadius="md" overflow="hidden">
            <Image src={file.url} alt={file.name} boxSize="150px" objectFit="cover" onClick={() => openImageModal(file.url)} cursor="pointer" />
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              position="absolute"
              top="2"
              right="2"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(file.id);
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

      <HStack spacing={4} wrap="wrap" border="1px solid red" p={4} mb={4}>
        {newFiles.map((file, index) => (
          <Box key={index} position="relative" width="150px" height="150px" boxShadow="md" borderRadius="md" overflow="hidden">
            <Image src={URL.createObjectURL(file)} alt={`New Image ${index + 1}`} boxSize="150px" objectFit="cover" onClick={() => openImageModal(URL.createObjectURL(file))} cursor="pointer" />
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              position="absolute"
              top="2"
              right="2"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNewImage(index);
              }}
            />
          </Box>
        ))}
      </HStack>

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
