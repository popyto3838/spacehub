import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  Textarea,
  Tooltip,
  useToast,
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
          setCommentList(res.data);
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
    <Box border={"1px solid black"}>
      {/* 맨윗줄 */}
      <Flex>
        <Heading as="h2" size="xl" mb={6} color="gray.700">
          QNA {commentList.length} 개
        </Heading>
        <Spacer />
        <Tooltip
          label={"로그인 하세요"}
          isDisabled={account.isLoggedIn()}
          placement={"top"}
        >
          <Button
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
        <Box>
          <Flex>
            <Image
              border={"1px solid red"}
              borderRadius={"full"}
              w={"50px"}
              src={member.profileImage}
            />
            <Box fontSize={"2xl"}>{member.nickname}</Box>
          </Flex>

          {/* 텍스트박스, 등록 버튼 */}
          <Flex>
            <Textarea
              h={"80px"}
              placeholder={"QNA를 작성해주세요."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              h={"80px"}
              isLoading={isProcessing}
              isDisabled={content.trim().length === 0}
              onClick={handleClickWriteQNA}
            >
              등록
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
