import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  // const [category, setCategory] = useState("all");
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("titleContent");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });
    setSearchType("titleContent");
    setSearchKeyword("");

    const searchTypeParam = searchParams.get("type");
    const searchKeywordParam = searchParams.get("keyword");
    if (searchTypeParam) {
      setSearchType(searchTypeParam);
    }
    if (searchKeywordParam) {
      setSearchKeyword(searchKeywordParam);
    }
  }, [searchParams]);

  // todo: 게시물 클릭하면 클릭한 시간으로 작성일시 바뀌는거 수정
  const handleClickCountViews = (board) => {
    axios
      .put(`/api/board/${board.boardId}/views`, {
        views: board.views + 1,
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
    navigate(`/board/list/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handleClickPageButton(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/board/list/?${searchParams}`);
  }

  return (
    <Box>
      <Flex>
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
        <Box>
          <Button onClick={handleClickSearch}>검색</Button>
        </Box>
      </Flex>
      {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {boardList.length > 0 && (
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>조회수</Th>
                <Th>제목</Th>
                <Th>작성자</Th>
              </Tr>
            </Thead>
            <Tbody>
              {boardList.map((board) => (
                <Tr
                  key={board.boardId}
                  onClick={() => {
                    handleClickCountViews(board);
                  }}
                  cursor={"pointer"}
                  _hover={{ bgColor: "blue.200" }}
                >
                  <Td>{board.boardId}</Td>
                  <Td>{board.views}</Td>
                  <Td>{board.title}</Td>
                  <Td>{board.nickname}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
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
