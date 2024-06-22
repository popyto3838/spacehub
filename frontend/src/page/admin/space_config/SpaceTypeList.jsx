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

export function SpaceTypeList() {
  const [isLoading, setIsLoading] = useState(true);
  const [typeLists, setTypeLists] = useState([]);
  const [typeStates, setTypeStates] = useState(new Map());
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/space/type/list`)
      .then((res) => {
        const types = res.data;
        setTypeLists(types);
        const newTypeStates = new Map(types.map((type) => [type.typeListId, type.active]));
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

  const handleDeleteType = async (typeListId) => {
    try {
      await axios.delete(`/api/space/type/${typeListId}`);
      setTypeLists(typeLists.filter((type) => type.typeListId !== typeListId));
      setTypeStates((prevState) => {
        const newState = new Map(prevState);
        newState.delete(typeListId);
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

  const handleSwitchChange = async (typeListId) => {
    const updatedStatus = !typeStates.get(typeListId);
    const typeToUpdate = typeLists.find((type) => type.typeListId === typeListId);

    if (typeToUpdate) {
      const updatedType = { ...typeToUpdate, active: updatedStatus };

      try {
        await axios.put(`/api/space/type/${typeListId}`, updatedType); // 변경된 옵션만 업데이트
        setTypeStates((prevTypeStates) => {
          const newTypeStates = new Map(prevTypeStates);
          newTypeStates.set(typeListId, updatedStatus);
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

  const handleIconUpload = async (e, typeListId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentId", typeListId);
    formData.append("division", "TYPE");

    try {
      await axios.post(`/api/file/upload/typeIcon`, formData);
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

  const handleDeleteIcon = async (fileId) => {
    try {
      await axios.delete(`/api/file/icon/${fileId}`);
      const res = await axios.get(`/api/space/type/list`);
      setTypeLists(res.data);
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
              <Th width="50%" textAlign="center">옵션명</Th>
              <Th width="10%">활성화</Th>
              <Th width="20%">아이콘</Th>
              <Th width="10%">유형삭제</Th>
            </Tr>
          </Thead>
          <Tbody>
            {typeLists.map((typeList) => (
              <Tr key={typeList.typeListId} _hover={{ bgColor: "gray.200" }}>
                <Td>{typeList.typeListId}</Td>
                <Td textAlign="center">{typeList.name}</Td>
                <Td>
                  <Switch
                    size="md"
                    isChecked={typeStates.get(typeList.typeListId)}
                    onChange={() => handleSwitchChange(typeList.typeListId)}
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
                      <Button colorScheme="red" onClick={() => handleDeleteIcon(typeList.iconFile.fileId)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Flex>
                  ) : (
                    <Flex align="center">
                      <Input
                        type="file"
                        onChange={(e) => handleIconUpload(e, typeList.typeListId)}
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
                  <Button colorScheme="red" onClick={() => handleDeleteType(typeList.typeListId)}>
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

export default SpaceTypeList;
