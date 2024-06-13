import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function BoardEdit() {
  const { boardId } = useParams();
  const [board, setBoard] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/${boardId}`).then((res) => {
      setBoard(res.data);
    });
  }, []);

  function handleClickSave() {
    axios.put(`/api/board/${boardId}/edit`, board).then((res) => {
      setBoard(res.data);
    });
  }

  return (
    <Box>
      <Box>
        <Heading>{board.boardId}번 게시물 수정</Heading>
      </Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              defaultValue={board.title}
              onChange={(e) => setBoard({ ...board, title: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Textarea
              defaultValue={board.content}
              onChange={(e) => setBoard({ ...board, content: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.nickname} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            <Input value={board.updateDateAndTime} readOnly />
          </FormControl>
        </Box>
        <Box>
          <Button>취소</Button>
          <Button onClick={handleClickSave}>확인</Button>
        </Box>
      </Box>
    </Box>
  );
}
