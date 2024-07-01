import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import "/public/css/paid/MyPaymentListArea.css";
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
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function MyFavoritesList() {
  const member = useContext(LoginContext);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mySpacePage = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesPerPage] = useState(10);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    if (member && member.id) {
      setIsLoading(true);
      axios
        .get(`/api/favorites/myFavoritesList/${member.id}`)
        .then((res) => {
          console.log(res.data);
          setFavorites(res.data);
        })
        .catch((err) => {
          console.error("Error fetching favorites data:", err);
          setError("즐겨찾기를 불러오는 데 실패했습니다.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [member]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const mySpacePageFunc = (param) => {
    mySpacePage("/space/" + param);
  };

  const filteredFavorites = favorites.filter((favorite) =>
    favorite.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastFavorite = currentPage * favoritesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
  const currentFavorites = filteredFavorites.slice(
    indexOfFirstFavorite,
    indexOfLastFavorite,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <Text>로딩 중...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color={textColor}>
          <FontAwesomeIcon icon={faHeart} style={{ marginRight: "10px" }} />
          나의 즐겨찾기
        </Heading>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="공간 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box
        bg={bgColor}
        shadow="md"
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Table variant="simple">
          <Thead>
            <Tr bg={useColorModeValue("gray.50", "gray.700")}>
              <Th width="10%">번호</Th>
              <Th width="30%">공간 이름</Th>
              <Th width="20%">시간당 금액</Th>
              <Th width="40%">주소</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentFavorites.map((favorite) => (
              <Tr key={favorite.spaceId}>
                <Td>{favorite.spaceId}</Td>
                <Td
                  onClick={() => mySpacePageFunc(favorite.spaceId)}
                  _hover={{ cursor: "pointer", color: "blue.500" }}
                  fontWeight="bold"
                >
                  {favorite.title}
                </Td>
                <Td>{favorite.price.toLocaleString()} 원</Td>
                <Td>{favorite.address}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredFavorites.length === 0 && (
        <Text mt={4} textAlign="center" color="gray.500">
          즐겨찾기 내역이 없습니다.
        </Text>
      )}

      <Flex justifyContent="center" mt={4}>
        <HStack>
          {Array.from(
            { length: Math.ceil(filteredFavorites.length / favoritesPerPage) },
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

export default MyFavoritesList;
