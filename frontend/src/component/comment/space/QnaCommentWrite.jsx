import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Textarea,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function QnaCommentWrite({ spaceId, isProcessing, setIsProcessing }) {
  const [content, setContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const [member, setMember] = useState({});
  const [commentList, setCommentList] = useState([]);

  const account = useContext(LoginContext);
  const toast = useToast();

  // member 정보를 가져옴
  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {});
    }
  }, [account]);

  // commentList 정보를 가져옴
  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listQna/${spaceId}`)
        .then((res) => {
          const comments = res.data.comments;
          setCommentList(comments);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [isProcessing]);

  function handleClickWriteQNA() {
    setIsProcessing(true);

    axios
      .post("/api/comment/writeQna", { spaceId, content })
      .then((res) => {
        setContent("");
        toast({
          status: "info",
          description: "QNA가 작성되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
        setIsWriting(false);
      });
  }

  return (
    <Box>
      {/* 맨윗줄 */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="xl" color="gray.700">
          QNA {commentList.length > 0 ? commentList[0].commentCount : ""} 개
        </Heading>
        <Tooltip
          label="로그인 하세요"
          isDisabled={account.isLoggedIn()}
          placement="top"
        >
          <Button
            colorScheme="blue"
            isDisabled={!account.isLoggedIn()}
            onClick={() => setIsWriting(!isWriting)}
          >
            QNA 작성하기
          </Button>
        </Tooltip>
      </Flex>

      {/* 멤버이미지, 아이디, 수정/삭제 드롭다운
          QNA 작성하기 버튼을 눌러야만 나옴 */}
      {isWriting && (
        <VStack spacing={4} align="stretch">
          <Flex align="center">
            <Avatar src={member.profileImage} size="md" mr={4} />
            <Text fontSize="xl">{member.nickname}</Text>
          </Flex>

          {/* 텍스트박스, 등록 버튼 */}
          <Textarea
            h="80px"
            placeholder="QNA를 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Button
            colorScheme="blue"
            isLoading={isProcessing}
            isDisabled={content.trim().length === 0}
            onClick={handleClickWriteQNA}
          >
            등록
          </Button>
        </VStack>
      )}
    </Box>
  );
}
