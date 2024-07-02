import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHome } from "@fortawesome/free-solid-svg-icons";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";

export function HostCenterReviews() {
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const member = useContext(LoginContext);
  const mySpacePage = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (member && member.id) {
      console.log("=============================", member.id);
      axios
        .get(`/api/comment/myReviewList/${member.id}`)
        .then((response) => {
          console.log(response.data);
          setSpaces(response.data);
        })
        .catch((error) =>
          console.error("공간 목록을 불러오는데 실패했습니다:", error),
        );
    }
  }, [member]);

  const filteredSpaces = spaces.filter(
    (space) =>
      space.content &&
      space.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 페이징 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpaces.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const mySpacePaceFunc = (param) => {
    mySpacePage("/space/" + param);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color={textColor}>
          <FontAwesomeIcon icon={faHome} style={{ marginRight: "10px" }} />내
          리뷰 관리
        </Heading>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="리뷰 내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box bg={bgColor} shadow="md" borderRadius="lg" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr bg={useColorModeValue("gray.50", "gray.700")}>
              <Th>#</Th>
              <Th>공간이름</Th>
              <Th>내용</Th>
              <Th>별점</Th>
              <Th>작성자</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((comment) => (
              <Tr key={comment.commentId}>
                <Td>{comment.commentId}</Td>
                <Td>{comment.title}</Td>
                <Td>{comment.content}</Td>
                <Td>{comment.rateScore}</Td>
                <Td>{comment.nickname}</Td>
                <Td>
                  <Button
                    leftIcon={<FontAwesomeIcon icon={faEdit} />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => mySpacePaceFunc(comment.spaceId)}
                  >
                    리뷰관리
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredSpaces.length === 0 && (
        <Text mt={4} textAlign="center" color="gray.500">
          등록된 리뷰가 없습니다.
        </Text>
      )}

      {/* 페이징 컨트롤 */}
      <Flex justifyContent="center" mt={4}>
        <HStack>
          {Array.from(
            { length: Math.ceil(filteredSpaces.length / itemsPerPage) },
            (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                colorScheme={currentPage === i + 1 ? "blue" : "gray"}
              >
                {i + 1}
              </Button>
            ),
          )}
        </HStack>
      </Flex>
    </Container>
  );
}
