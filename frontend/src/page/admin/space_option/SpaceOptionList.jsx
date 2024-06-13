import {Box, Button, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr, useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

export function SpaceOptionList() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionLists, setOptionLists] = useState([]);
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/space/option/list`)
      .then((res) => {
        setOptionLists(res.data);
      })
      .catch(() => {
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  const handleDeleteOption = async (optionListId) => {
    try {
      await axios.delete(`/api/space/option/${optionListId}`);
      setOptionLists(optionLists.filter((option) => option.optionListId !== optionListId));
      toast({
        title: '옵션이 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '옵션 삭제에 실패했습니다.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Spinner/>;
  }

  if (optionLists.length === 0 && !isLoading) {
    return <Box>등록된 옵션이 없습니다.</Box>;
  }

  return <>
    <Box>
      <Heading>option list Read Page</Heading>
    </Box>
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>옵션명</Th>
            <Th>삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          {optionLists.map((optionList) => (
            <Tr
              key={optionList.optionListId}
              _hover={{
                bgColor: "gray.200",
              }}
              cursor="pointer"
            >
              <Td>{optionList.optionListId}</Td>
              <Td>{optionList.name}</Td>
              <Td>
                <Button onClick={()=>handleDeleteOption(optionList.optionListId)}><FontAwesomeIcon icon={faTrashCan} /></Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  </>;
}