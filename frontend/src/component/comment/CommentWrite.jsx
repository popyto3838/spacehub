import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function CommentWrite({
  boardId,
  categoryId,
  isProcessing,
  setIsProcessing,
}) {
  const [content, setContent] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const account = useContext(LoginContext);

  function handleClickCommentWrite() {
    setIsProcessing(true);

    axios
      .post("/api/comment/write", { boardId, content, categoryId })
      .then((res) => {
        setContent("");
        toast({
          status: "success",
          description: "댓글이 작성되었습니다.",
          position: "top",
          duration: 700,
        });
        // todo: navigate 수정
        // navigate(`/board/list`);
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box>
      <Box>
        <FormControl border={"1px solid black"}>
          <FormLabel>댓글 쓰기</FormLabel>
          <Box border={"1px solid blue"}>
            <Box>(작성자) : {account.nickname}</Box>
          </Box>
          <Flex>
            <Textarea
              isDisabled={!account.isLoggedIn()}
              placeholder={
                account.isLoggedIn()
                  ? "타인의 권리를 침해하거나 명예를 훼손하는 댓글은 운영원칙 및 관련 법률에 제재를 받을 수 있습니다. Shift + Enter 키를 동시에 누르면 줄바꿈이 됩니다."
                  : "로그인하시겠습니까?"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Tooltip
              label={"로그인 하세요"}
              isDisabled={account.isLoggedIn()}
              placement={"top"}
            >
              <Button
                isDisabled={
                  content.trim().length === 0 || !account.isLoggedIn()
                }
                isLoading={isProcessing}
                onClick={handleClickCommentWrite}
              >
                등록
              </Button>
            </Tooltip>
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
}
