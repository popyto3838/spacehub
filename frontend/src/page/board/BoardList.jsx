import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Input,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
    <Box>
      {/* 카테고리 */}
      <Flex border={"1px solid black"}>
        <ButtonGroup
          variant={"outline"}
          value={categoryType}
          onClick={(e) => setCategoryType(e.target.value)}
        >
          <Button onClick={handleClickCategoryType} value={"all"}>
            전체
          </Button>
          <Button onClick={handleClickCategoryType} value={"notice"}>
            공지사항
          </Button>
          <Button onClick={handleClickCategoryType} value={"faq"}>
            FAQ
          </Button>
        </ButtonGroup>
      </Flex>

      {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {boardList.length > 0 && (
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>카테고리</Th>
                <Th>#</Th>
                <Th>제목</Th>
                <Th>작성자</Th>
                <Th>작성일시</Th>
                <Th>조회수</Th>
                <Th>좋아요</Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                <Tr
                  key={board.boardId}
                  onClick={() => {
                    handleClickBoardAndCountViews(board);
                  }}
                  cursor={"pointer"}
                  _hover={{ bgColor: "blue.200" }}
                >
                  {categoryList.map(
                    (category) =>
                      category.categoryId === board.categoryId && (
                        <Td key={category.categoryId}>
                          {category.categoryName}
                        </Td>
                      ),
                  )}
                  <Td>{board.boardId}</Td>
                  <Td>
                    {board.title}
                    {/* 첨부된 이미지가 있으면 Badge에 파일수 출력 */}
                    {board.numberOfImages > 0 && (
                      <Badge>이미지 : {board.numberOfImages}</Badge>
                    )}
                    {/* 글 목록 볼때, 댓글 갯수 */}
                    {board.numberOfComments > 0 && (
                      <Badge>댓글 : {board.numberOfComments}</Badge>
                    )}
                  </Td>
                  <Td>{board.writer}</Td>
                  <Td>{board.inputDateAndTime}</Td>
                  <Td>{board.views}</Td>
                  {/* 좋아요 갯수 */}
                  <Td>{board.numberOfLikes > 0 && board.numberOfLikes}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* 검색, 글쓰기 버튼 */}
      <Flex>
        <Center>
          <Box>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value={"titleContent"}>제목+내용</option>
              <option value={"title"}>제목</option>
              <option value={"content"}>내용</option>
              <option value={"nickname"}>작성자</option>
            </Select>
          </Box>
          <Box>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={"검색어를 입력하세요."}
            />
          </Box>
          <Button onClick={handleClickSearch}>검색</Button>
        </Center>
        <Spacer />
        {(account.isHost() || account.isAdmin()) && (
          <Button onClick={() => navigate("/board/write")}>글쓰기</Button>
        )}
      </Flex>

      {/* 페이징 */}
      <Center>
        {pageInfo.prevPageNumber && (
          <Box>
            <Button onClick={() => handleClickPageButton(1)}>처음</Button>
            <Button
              onClick={() => handleClickPageButton(pageInfo.prevPageNumber)}
            >
              이전
            </Button>
          </Box>
        )}

        {pageNumber.map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => handleClickPageButton(pageNumber)}
            colorScheme={
              pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
            }
          >
            {pageNumber}
          </Button>
        ))}
        {pageInfo.nextPageNumber && (
          <Box>
            <Button
              onClick={() => handleClickPageButton(pageInfo.nextPageNumber)}
            >
              다음
            </Button>
            <Button
              onClick={() => handleClickPageButton(pageInfo.lastPageNumber)}
            >
              맨끝
            </Button>
          </Box>
        )}
      </Center>
    </Box>
  );
}
