import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState({});

  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/board/${boardId}`).then((res) => setBoard(res.data));
  }, []);

  // if (board === null) {
  //   return <Spinner />;
  // }

  function handleClickRemove() {
    axios.delete(`/api/board/${boardId}/delete`).then((res) => {});
  }

  let time = Date.now();

  return (
    <Box>
      <Box>
        <Heading>{board.boardId}번 게시물</Heading>
      </Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={board.title} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Textarea value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.nickName} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            {board.updateDt ===
            <Input value={board.inputDateAndTime} readOnly /> && (
              <Input value={board.inputDateAndTime} readOnly />
            )}
            {board.updateDt !== <Input value={board.inputDt} readOnly /> && (
              <Input value={board.updateDateAndTime} readOnly />
            )}
          </FormControl>
        </Box>
        <Box>
          <Button onClick={handleClickRemove}>삭제</Button>
          <Button onClick={() => navigate(`/board/${boardId}/edit`)}>
            수정
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
