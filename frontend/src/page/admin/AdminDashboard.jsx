import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  VStack,
  Flex, Button, IconButton, Divider
} from "@chakra-ui/react";
import axios from 'axios';
import {ChevronRightIcon} from "@chakra-ui/icons";
import {useNavigate} from "react-router-dom";

export function AdminDashboard() {

  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  return  (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading>대시보드</Heading>
          <Button>설정</Button>
        </Flex>

        <VStack spacing={10} align="stretch">
          <Box p={5} shadow="md" borderWidth="1px">
            <Flex justify="space-between" align="center">
              <Heading fontSize="xl">공간유형</Heading>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={()=>navigate("/space/type")}
              />
            </Flex>
            <Divider my={4} />
            <VStack spacing={4} align="stretch">
              {/* 공간유형 내용 */}
            </VStack>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px">
            <Flex justify="space-between" align="center">
              <Heading fontSize="xl">공간옵션</Heading>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={()=>navigate("/space/option")}
              />
            </Flex>
            <Divider my={4} />
            <VStack spacing={4} align="stretch">
              {/* 공간옵션 내용 */}
            </VStack>
          </Box>

          <Box p={5} shadow="md" borderWidth="1px">
            <Flex justify="space-between" align="center">
              <Heading fontSize="xl">회원 리스트</Heading>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={()=>navigate("/member/list")}
              />
            </Flex>
            <Divider my={4} />
            <VStack spacing={4} align="stretch">
              {/* 회원 리스트 내용 */}
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
}

export default AdminDashboard;
