import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  HStack,
  Input,
  Select,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("titleContent");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();
  const [categoryType, setCategoryType] = useState("all");

  const navigate = useNavigate();

  // 테스트용 로그인 확인
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
      setCategoryList(res.data.categoryList);
    });
    setSearchType("titleContent");
    setSearchKeyword("");
    setCategoryType("all");

    const searchTypeParam = searchParams.get("type");
    const searchKeywordParam = searchParams.get("keyword");
    const categoryTypeParam = searchParams.get("category");
    if (searchTypeParam) {
      setSearchType(searchTypeParam);
    }
    if (searchKeywordParam) {
      setSearchKeyword(searchKeywordParam);
    }
    if (categoryTypeParam) {
      setCategoryType(categoryTypeParam);
    }
  }, [searchParams]);

  const handleClickBoardAndCountViews = (board) => {
    axios
      .put(`/api/board/${board.boardId}/views`, {
        views: board.views,
      })
      .then(() => {
        navigate(`/board/${board.boardId}`);
      });
  };

  const pageNumber = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumber.push(i);
  }

  function handleClickSearch() {
    navigate(
      `/board/list/?type=${searchType}&keyword=${searchKeyword}&category=${categoryType}`,
    );
  }

  function handleClickPageButton(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/board/list/?${searchParams}`);
  }

  function handleClickCategoryType() {
    navigate(
      `/board/list/?type=${searchType}&keyword=${searchKeyword}&category=${categoryType}`,
    );
  }

  return (
    <Box bg="gray.100" minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          {/* 카테고리 */}
          <Card w="full">
            <CardBody>
              <ButtonGroup
                value={categoryType}
                onClick={(e) => setCategoryType(e.target.value)}
                variant="outline"
                isAttached
              >
                <Button onClick={handleClickCategoryType} value="all">
                  전체
                </Button>
                <Button onClick={handleClickCategoryType} value="notice">
                  공지사항
                </Button>
                <Button onClick={handleClickCategoryType} value="faq">
                  FAQ
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>

          {/* 게시글 목록 */}
          <Card w="full">
            <CardBody>
              {boardList.length === 0 ? (
                <Center p={8}>조회 결과가 없습니다.</Center>
              ) : (
                <TableContainer>
                  <Table
                    variant="simple"
                    width="100%"
                    sx={{ tableLayout: "fixed" }}
                  >
                    <Thead>
                      <Tr bg="gray.50">
                        <Th width="110px">카테고리</Th>
                        <Th width="20px">#</Th>
                        <Th width="50%">제목</Th>
                        <Th width="150px">작성자</Th>
                        <Th width="100px">작성일시</Th>
                        <Th width="65px">조회수</Th>
                        <Th width="65px">좋아요</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {boardList.map((board) => (
                        <Tr
                          key={board.boardId}
                          onClick={() => handleClickBoardAndCountViews(board)}
                          cursor="pointer"
                          _hover={{ bg: "blue.50" }}
                        >
                          <Td
                            width="110px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {
                              categoryList.find(
                                (category) =>
                                  category.categoryId === board.categoryId,
                              )?.categoryName
                            }
                          </Td>
                          <Td textAlign={"center"} width="20px">
                            {board.boardId}
                          </Td>
                          <Td
                            width="50%"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {board.title}
                            {board.numberOfImages > 0 && (
                              <Badge ml={2}>
                                이미지 : {board.numberOfImages}
                              </Badge>
                            )}
                            {board.numberOfComments > 0 && (
                              <Badge ml={2}>
                                댓글 : {board.numberOfComments}
                              </Badge>
                            )}
                          </Td>
                          <Td
                            width="150px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {board.writer}
                          </Td>
                          <Td textAlign={"center"} width="100px">
                            {board.inputDt}
                          </Td>
                          <Td textAlign={"center"} width="65px">
                            {board.views}
                          </Td>
                          <Td textAlign={"center"} width="65px">
                            {board.numberOfLikes > 0 && board.numberOfLikes}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </CardBody>
          </Card>

          {/* 검색, 글쓰기 버튼 */}
          <Card w="full">
            <CardBody>
              <Flex>
                <HStack>
                  <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="titleContent">제목+내용</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="nickname">작성자</option>
                  </Select>
                  <Input
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요."
                  />
                  <Button colorScheme="blue" onClick={handleClickSearch}>
                    검색
                  </Button>
                </HStack>
                <Spacer />
                {(account.isHost() || account.isAdmin()) && (
                  <Button
                    colorScheme="green"
                    onClick={() => navigate("/board/write")}
                  >
                    글쓰기
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>

          {/* 페이징 */}
          <Card w="full">
            <CardBody>
              <Center>
                <HStack>
                  {pageInfo.prevPageNumber && (
                    <>
                      <Button onClick={() => handleClickPageButton(1)}>
                        처음
                      </Button>
                      <Button
                        onClick={() =>
                          handleClickPageButton(pageInfo.prevPageNumber)
                        }
                      >
                        이전
                      </Button>
                    </>
                  )}
                  {pageNumber.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      onClick={() => handleClickPageButton(pageNumber)}
                      colorScheme={
                        pageNumber === pageInfo.currentPageNumber
                          ? "blue"
                          : "gray"
                      }
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  {pageInfo.nextPageNumber && (
                    <>
                      <Button
                        onClick={() =>
                          handleClickPageButton(pageInfo.nextPageNumber)
                        }
                      >
                        다음
                      </Button>
                      <Button
                        onClick={() =>
                          handleClickPageButton(pageInfo.lastPageNumber)
                        }
                      >
                        맨끝
                      </Button>
                    </>
                  )}
                </HStack>
              </Center>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
