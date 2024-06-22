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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function SpaceTypeList() {
  const [isLoading, setIsLoading] = useState(true);
  const [typeLists, setTypeLists] = useState([]);
  const [fileList, setFileList] = useState([]);
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

  const handleIconUpload = async (event, typeListId) => {
    const file = event.target.files[0];
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
      axios.get(`/api/space/type/list`).then((res) => {
        setTypeLists(res.data);
      });
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
              <Th>#</Th>
              <Th>옵션명</Th>
              <Th>활성화</Th>
              <Th>삭제</Th>
              <Th>아이콘</Th>
            </Tr>
          </Thead>
          <Tbody>
            {typeLists.map((typeList) => (
              <Tr key={typeList.typeListId} _hover={{ bgColor: "gray.200" }}>
                <Td>{typeList.typeListId}</Td>
                <Td>{typeList.name}</Td>
                <Td>
                  <Switch
                    size="md"
                    isChecked={typeStates.get(typeList.typeListId)}
                    onChange={() => handleSwitchChange(typeList.typeListId)}
                  />
                </Td>
                <Td>
                  <Button onClick={() => handleDeleteType(typeList.typeListId)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Td>
                <Td>
                  {typeList.file ? (
                    <Box>
                      <img
                        src={typeList.file.fileName}
                        alt={typeList.name}
                        width="50"
                        height="50"
                      />
                      <Button onClick={() => handleDeleteIcon(typeList.file.fileId)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </Box>
                  ) : (
                    <Input type="file" onChange={(e) => handleIconUpload(e, typeList.typeListId)} />
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
