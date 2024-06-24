import React, {useEffect, useState} from 'react';
import {Box, Heading, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import axios from 'axios';

export function HostDashboard() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    // API 요청을 통해 호스트의 공간 목록을 가져옴
    axios.get('/api/host/spaces')
      .then(response => {
        setSpaces(response.data);
      })
      .catch(error => {
        console.error('Error fetching spaces:', error);
      });
  }, []);

  return (
    <Box p={5}>
      <Heading mb={4}>호스트 대시보드</Heading>
      <Text mb={4}>등록된 공간 목록:</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>공간 이름</Th>
            <Th>유형</Th>
            <Th>등록일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {spaces.map(space => (
            <Tr key={space.id}>
              <Td>{space.name}</Td>
              <Td>{space.type}</Td>
              <Td>{space.createdAt}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default HostDashboard;
