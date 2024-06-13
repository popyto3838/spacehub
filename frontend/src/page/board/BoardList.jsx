import {
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/board/list").then((res) => {
      setBoardList(res.data);
    });
  }, []);

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

  return (
    <Box>
      <Flex>
        <Box>
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value={"all"}>전체</option>
            <option value={"notice"}>공지사항</option>
            <option value={"faq"}>FAQ</option>
          </Select>
        </Box>
        <Box>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={"검색어를 입력하세요."}
          />
        </Box>
        <Box>
          <Button>검색</Button>
        </Box>
      </Flex>
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
    </Box>
  );
}
