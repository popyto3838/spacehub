import {
  Box,
  Button,
  Heading,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Input,
  Image,
  Flex
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faUpload } from "@fortawesome/free-solid-svg-icons";

export function SpaceOptionList() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionLists, setOptionLists] = useState([]);
  const [optionStates, setOptionStates] = useState(new Map());
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/space/option/list`)
      .then((res) => {
        const options = res.data;
        setOptionLists(options);
        const newOptionStates = new Map(options.map((option) => [option.optionListId, option.active]));
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

  const handleDeleteOption = async (optionListId) => {
    try {
      await axios.delete(`/api/space/option/${optionListId}`);
      setOptionLists(optionLists.filter((option) => option.optionListId !== optionListId));
      setOptionStates((prevState) => {
        const newState = new Map(prevState);
        newState.delete(optionListId);
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

  const handleSwitchChange = async (optionListId) => {
    const updatedStatus = !optionStates.get(optionListId);
    const optionToUpdate = optionLists.find((option) => option.optionListId === optionListId);

    if (optionToUpdate) {
      const updatedOption = { ...optionToUpdate, active: updatedStatus };

      try {
        await axios.put(`/api/space/option/${optionListId}`, updatedOption); // 변경된 옵션만 업데이트
        setOptionStates((prevOptionStates) => {
          const newOptionStates = new Map(prevOptionStates);
          newOptionStates.set(optionListId, updatedStatus);
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

  const handleIconUpload = async (e, optionListId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentId", optionListId);
    formData.append("division", "OPTION");

    try {
      await axios.post(`/api/file/upload/typeIcon`, formData);
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

  const handleDeleteIcon = async (fileId) => {
    try {
      await axios.delete(`/api/file/icon/${fileId}`);
      const res = await axios.get(`/api/space/option/list`);
      setOptionLists(res.data);
      toast({
        title: "아이콘이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
              <Th width="50%" textAlign="center">옵션명</Th>
              <Th width="10%">활성화</Th>
              <Th width="20%">아이콘</Th>
              <Th width="10%">옵션삭제</Th>
            </Tr>
          </Thead>
          <Tbody>
            {optionLists.map((optionList) => (
              <Tr key={optionList.optionListId} _hover={{ bgColor: "gray.200" }}>
                <Td>{optionList.optionListId}</Td>
                <Td textAlign="center">{optionList.name}</Td>
                <Td>
                  <Switch
                    size="md"
                    isChecked={optionStates.get(optionList.optionListId)}
                    onChange={() => handleSwitchChange(optionList.optionListId)}
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
                      <Button colorScheme="red" onClick={() => handleDeleteIcon(optionList.iconFile.fileId)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Flex>
                  ) : (
                    <Flex align="center">
                      <Input
                        type="file"
                        onChange={(e) => handleIconUpload(e, optionList.optionListId)}
                        display="none"
                      />
                      <Button
                        leftIcon={<FontAwesomeIcon icon={faUpload} />}
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          if (input) input.click();
                        }}
                      >
                        아이콘 업로드
                      </Button>
                    </Flex>
                  )}
                </Td>
                <Td>
                  <Button colorScheme="red" onClick={() => handleDeleteOption(optionList.optionListId)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}

export default SpaceOptionList;
