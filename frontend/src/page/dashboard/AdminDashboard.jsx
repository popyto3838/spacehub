import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import axios from 'axios';

export function AdminDashboard() {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    // API 요청을 통해 통계 데이터를 가져옴
    axios.get('/api/admin/statistics')
      .then(response => {
        setStatistics(response.data);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
      });
  }, []);

  return (
    <Box p={5}>
      <Heading mb={4}>관리자 대시보드</Heading>
      <Text mb={4}>웹서비스 통계:</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>항목</Th>
            <Th>값</Th>
          </Tr>
        </Thead>
        <Tbody>
          {statistics.map(stat => (
            <Tr key={stat.id}>
              <Td>{stat.item}</Td>
              <Td>{stat.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminDashboard;
