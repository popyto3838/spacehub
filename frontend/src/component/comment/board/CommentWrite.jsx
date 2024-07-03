import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function CommentWrite({
  boardId,
  categoryId,
  isProcessing,
  setIsProcessing,
}) {
  const [content, setContent] = useState("");

  const toast = useToast();
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
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box>
      <FormControl>
        <FormLabel fontWeight="bold" mb={2}>
          댓글 쓰기
        </FormLabel>
        <Box bg="gray.100" p={2} mb={2} borderRadius="md">
          <Text>작성자: {account.nickname}</Text>
        </Box>
        <VStack spacing={2}>
          <Textarea
            isDisabled={!account.isLoggedIn()}
            placeholder={
              account.isLoggedIn()
                ? "타인의 권리를 침해하거나 명예를 훼손하는 댓글은 운영원칙 및 관련 법률에 제재를 받을 수 있습니다. Shift + Enter 키를 동시에 누르면 줄바꿈이 됩니다."
                : "로그인하시겠습니까?"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
          />
          <Flex justifyContent="flex-end" w="full">
            <Tooltip
              label="로그인 하세요"
              isDisabled={account.isLoggedIn()}
              placement="top"
            >
              <Button
                colorScheme="blue"
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
        </VStack>
      </FormControl>
    </Box>
  );
}
