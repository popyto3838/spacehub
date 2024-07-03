import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";
import { Star } from "./Star.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export function ReviewCommentWrite({ spaceId, isProcessing, setIsProcessing }) {
  const [content, setContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [files, setFiles] = useState([]);
  // 별점
  const [rateScore, setRateScore] = useState(0);

  const [member, setMember] = useState({});
  const [commentList, setCommentList] = useState([]);

  const account = useContext(LoginContext);
  const toast = useToast();

  function handleClickWriteReview() {
    setIsProcessing(true);

    axios
      .postForm("/api/comment/writeReview", {
        spaceId,
        content,
        files,
        rateScore,
      })
      .then((res) => {
        setContent("");
        toast({
          status: "info",
          description: "리뷰가 작성되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
        setIsWriting(false);
        setFiles([]);
        setRateScore(0);
      });
  }

  // commentList 정보를 가져옴
  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listReview/${spaceId}`)
        .then((res) => {
          const comments = res.data.comments;
          setCommentList(comments);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [isProcessing]);

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

  // files 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }
  const fileImageList = [];
  for (let i = 0; i < files.length; i++) {}

  return (
    <Box>
      {/* 맨 윗줄 */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="xl" color="gray.700">
          REVIEW {commentList.length > 0 ? commentList[0].commentCount : ""} 개
        </Heading>
        <HStack>
          <Box>
            <FontAwesomeIcon icon={faStar} color="yellow.400" />
            <Text as="span" ml={2}>
              {commentList.length > 0
                ? commentList[0].rateScoreAvg.toFixed(1)
                : ""}
              점
            </Text>
          </Box>
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
              REVIEW 작성하기
            </Button>
          </Tooltip>
        </HStack>
      </Flex>

      {/* 멤버이미지, 아이디, 수정/삭제 드롭다운
          REVIEW 작성하기 버튼을 눌러야만 나옴 */}
      {isWriting && (
        <VStack spacing={4} align="stretch">
          <Flex align="center">
            <Avatar src={member.profileImage} size="md" mr={4} />
            <Text fontSize="xl">{member.nickname}</Text>
          </Flex>

          {/* 별점, 텍스트박스, 파일첨부 등록 버튼 */}
          {/* 별점 컴포넌트 */}
          <Star setRateScore={setRateScore} rateScore={rateScore} />

          <Textarea
            h="80px"
            placeholder="사실과 관계없는 내용을 작성시 관계 법령에 따라 처벌받을 수 있습니다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <FormControl>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            />
            <FormHelperText>
              첨부 파일의 총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
            </FormHelperText>
          </FormControl>

          {fileNameList && <Box>{fileNameList}</Box>}

          <Button
            colorScheme="blue"
            isLoading={isProcessing}
            isDisabled={content.trim().length === 0}
            onClick={handleClickWriteReview}
          >
            등록
          </Button>
        </VStack>
      )}
    </Box>
  );
}
