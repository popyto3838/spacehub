import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faUpload } from "@fortawesome/free-solid-svg-icons";

export function SpaceTypeList() {
  const [isLoading, setIsLoading] = useState(true);
  const [typeLists, setTypeLists] = useState([]);
  const [typeStates, setTypeStates] = useState(new Map());
  const [deleteFileId, setDeleteFileId] = useState(null);
  const toast = useToast();
  const fileInputRefs = useRef({});
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/space/type/list`)
      .then((res) => {
        const types = res.data;
        setTypeLists(types);
        const newTypeStates = new Map(
          types.map((type) => [type.itemId, type.active]),
        );
        setTypeStates(newTypeStates);
      })
      .catch((err) => {
        toast({
          title: "타입 목록을 불러오는데 실패했습니다.",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast]);

  const handleDeleteType = async (itemId) => {
    try {
      await axios.delete(`/api/space/type/${itemId}`);
      setTypeLists(typeLists.filter((type) => type.itemId !== itemId));
      setTypeStates((prevState) => {
        const newState = new Map(prevState);
        newState.delete(itemId);
        return newState;
      });
      toast({
        title: "타입이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "타입 삭제에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSwitchChange = async (itemId) => {
    const updatedStatus = !typeStates.get(itemId);
    const typeToUpdate = typeLists.find((type) => type.itemId === itemId);

    if (typeToUpdate) {
      const updatedType = { ...typeToUpdate, active: updatedStatus };

      try {
        await axios.put(`/api/space/type/${itemId}`, updatedType);
        setTypeStates((prevTypeStates) => {
          const newTypeStates = new Map(prevTypeStates);
          newTypeStates.set(itemId, updatedStatus);
          return newTypeStates;
        });
        toast({
          title: "옵션 상태가 업데이트되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "옵션 상태 업데이트에 실패했습니다.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleIconUpload = async (e, itemId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentId", itemId);
    formData.append("division", "TYPE");

    try {
      await axios.post(`/api/file/upload/icon`, formData);
      toast({
        title: "아이콘이 업로드되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const res = await axios.get(`/api/space/type/list`);
      setTypeLists(res.data);
    } catch (error) {
      toast({
        title: "아이콘 업로드에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteIcon = async () => {
    if (deleteFileId === null) return;

    try {
      await axios.delete(`/api/file/icon/${deleteFileId}`);
      const res = await axios.get(`/api/space/type/list`);
      setTypeLists(res.data);
      toast({
        title: "아이콘이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose(); // 모달 닫기
    } catch (error) {
      toast({
        title: "아이콘 삭제에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onClose(); // 모달 닫기
    }
  };

  const openDeleteModal = (fileId) => {
    setDeleteFileId(fileId);
    onOpen();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (typeLists.length === 0 && !isLoading) {
    return <Box>등록된 옵션이 없습니다.</Box>;
  }

  return (
    <>
      <Box>
        <Heading>Type List</Heading>
      </Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th width="10%">#</Th>
              <Th width="50%" textAlign="center">
                옵션명
              </Th>
              <Th width="10%">활성화</Th>
              <Th width="20%">아이콘</Th>
              <Th width="10%">유형삭제</Th>
            </Tr>
          </Thead>
          <Tbody>
            {typeLists.map((typeList) => (
              <Tr key={typeList.itemId} _hover={{ bgColor: "gray.200" }}>
                <Td>{typeList.itemId}</Td>
                <Td textAlign="center">{typeList.name}</Td>
                <Td>
                  <Switch
                    size="md"
                    isChecked={typeStates.get(typeList.itemId)}
                    onChange={() => handleSwitchChange(typeList.itemId)}
                  />
                </Td>
                <Td>
                  {typeList.iconFile ? (
                    <Flex align="center">
                      <Image
                        src={typeList.iconFile.fileName}
                        alt={typeList.name}
                        boxSize="50px"
                        objectFit="cover"
                        mr={2}
                      />
                      <Button
                        colorScheme="red"
                        onClick={() =>
                          openDeleteModal(typeList.iconFile.fileId)
                        }
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Flex>
                  ) : (
                    <Flex align="center">
                      <Input
                        type="file"
                        onChange={(e) => handleIconUpload(e, typeList.itemId)}
                        display="none"
                        ref={(el) =>
                          (fileInputRefs.current[typeList.itemId] = el)
                        }
                      />
                      <Button
                        leftIcon={<FontAwesomeIcon icon={faUpload} />}
                        onClick={() =>
                          fileInputRefs.current[typeList.itemId].click()
                        }
                      >
                        아이콘 업로드
                      </Button>
                    </Flex>
                  )}
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteType(typeList.itemId)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Td>
              </Tr>
            ))}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>아이콘 이미지 삭제</ModalHeader>
                <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
                <ModalFooter>
                  <Button colorScheme={"gray"} onClick={onClose}>
                    취소
                  </Button>
                  <Button
                    ml={2}
                    colorScheme={"blue"}
                    onClick={handleDeleteIcon}
                  >
                    확인
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Tbody>
        </Table>
      </Box>
    </>
  );
}

export default SpaceTypeList;
