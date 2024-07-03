import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  Textarea,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

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
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="white" shadow="md">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="xl" color="gray.700">
          문의댓글 작성
        </Heading>
        <HStack>
          <Box>
            <Text as="span" ml={2} fontWeight="bold">
              {commentList.length > 0 ? commentList[0].commentCount : ""} 개
            </Text>
          </Box>
          <Tooltip
            label="로그인 하세요"
            isDisabled={account.isLoggedIn()}
            placement="top"
          >
            <Button
              leftIcon={<FontAwesomeIcon icon={faPen} />}
              colorScheme="blue"
              isDisabled={!account.isLoggedIn()}
              onClick={() => setIsWriting(!isWriting)}
            >
              문의 작성
            </Button>
          </Tooltip>
        </HStack>
      </Flex>

      {isWriting && (
        <VStack spacing={4} align="stretch">
          <Flex align="center">
            <Avatar src={member.profileImage} size="md" mr={4} />
            <Text fontSize="xl">{member.nickname}</Text>
          </Flex>

          <Textarea
            h="80px"
            placeholder="공간에 대한 문의글을 작성해주세요."
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
