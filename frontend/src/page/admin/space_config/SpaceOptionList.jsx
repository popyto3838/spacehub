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

export function SpaceOptionList() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionLists, setOptionLists] = useState([]);
  const [optionStates, setOptionStates] = useState(new Map());
  const [deleteFileId, setDeleteFileId] = useState(null);
  const toast = useToast();
  const fileInputRefs = useRef({}); // useRef로 각 파일 입력 요소를 저장
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/space/option/list`)
      .then((res) => {
        const options = res.data;
        console.log("options:", options); // 데이터 확인을 위해 추가
        setOptionLists(options);
        const newOptionStates = new Map(
          options.map((option) => [option.itemId, option.active]),
        );
        setOptionStates(newOptionStates);
      })
      .catch((err) => {
        toast({
          title: "옵션 목록을 불러오는데 실패했습니다.",
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

  const handleDeleteOption = async (itemId) => {
    try {
      await axios.delete(`/api/space/option/${itemId}`);
      setOptionLists(optionLists.filter((option) => option.itemId !== itemId));
      setOptionStates((prevState) => {
        const newState = new Map(prevState);
        newState.delete(itemId);
        return newState;
      });
      toast({
        title: "옵션이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "옵션 삭제에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSwitchChange = async (itemId) => {
    const updatedStatus = !optionStates.get(itemId);
    const optionToUpdate = optionLists.find(
      (option) => option.itemId === itemId,
    );

    if (optionToUpdate) {
      const updatedOption = { ...optionToUpdate, active: updatedStatus };

      try {
        await axios.put(`/api/space/option/${itemId}`, updatedOption); // 변경된 옵션만 업데이트
        setOptionStates((prevOptionStates) => {
          const newOptionStates = new Map(prevOptionStates);
          newOptionStates.set(itemId, updatedStatus);
          return newOptionStates;
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
    console.log("optionListId:", itemId); // 여기에 console.log 추가
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentId", itemId);
    formData.append("division", "OPTION");

    try {
      await axios.post(`/api/file/upload/icon`, formData);
      toast({
        title: "아이콘이 업로드되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const res = await axios.get(`/api/space/option/list`);
      setOptionLists(res.data);
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
      const res = await axios.get(`/api/space/option/list`);
      setOptionLists(res.data);
      toast({
        title: "아이콘이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "아이콘 삭제에 실패했습니다.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openDeleteModal = (fileId) => {
    setDeleteFileId(fileId);
    onOpen();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (optionLists.length === 0 && !isLoading) {
    return <Box>등록된 옵션이 없습니다.</Box>;
  }

  return (
    <>
      <Box>
        <Heading>Option List</Heading>
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
              <Th width="10%">옵션삭제</Th>
            </Tr>
          </Thead>
          <Tbody>
            {optionLists.map((optionList) => (
              <Tr key={optionList.itemId} _hover={{ bgColor: "gray.200" }}>
                <Td>{optionList.itemId}</Td>
                <Td textAlign="center">{optionList.name}</Td>
                <Td>
                  <Switch
                    size="md"
                    isChecked={optionStates.get(optionList.itemId)}
                    onChange={() => handleSwitchChange(optionList.itemId)}
                  />
                </Td>
                <Td>
                  {optionList.iconFile ? (
                    <Flex align="center">
                      <Image
                        src={optionList.iconFile.fileName}
                        alt={optionList.name}
                        boxSize="50px"
                        objectFit="cover"
                        mr={2}
                      />
                      <Button
                        colorScheme="red"
                        onClick={() =>
                          openDeleteModal(optionList.iconFile.fileId)
                        }
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Flex>
                  ) : (
                    <Flex align="center">
                      <Input
                        type="file"
                        onChange={(e) => handleIconUpload(e, optionList.itemId)}
                        display="none"
                        ref={(el) =>
                          (fileInputRefs.current[optionList.itemId] = el)
                        }
                      />
                      <Button
                        leftIcon={<FontAwesomeIcon icon={faUpload} />}
                        onClick={() =>
                          fileInputRefs.current[optionList.itemId].click()
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
                    onClick={() => handleDeleteOption(optionList.itemId)}
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

export default SpaceOptionList;
