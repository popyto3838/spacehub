import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Image,
  Input,
  Spacer,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function ReviewCommentWrite({ spaceId, isProcessing, setIsProcessing }) {
  const [content, setContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [files, setFiles] = useState([]);

  const [member, setMember] = useState({});
  const [commentList, setCommentList] = useState([]);

  const account = useContext(LoginContext);
  const toast = useToast();

  function handleClickWriteReview() {
    setIsProcessing(true);

    axios
      .postForm("/api/comment/writeReview", { spaceId, content, files })
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
      });
  }

  // commentList 정보를 가져옴
  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listReview/${spaceId}`)
        .then((res) => {
          setCommentList(res.data);
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
    <Box border={"1px solid black"}>
      {/* 맨 윗줄 */}
      <Flex>
        <Heading as="h2" size="xl" mb={6} color="gray.700">
          REVIEW {commentList.length} 개
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
            REVIEW 작성하기
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

          {/* 별점, 텍스트박스, 파일첨부 등록 버튼 */}
          <Box border={"1px solid black"} m={1}>
            별점
          </Box>
          <Flex>
            <Box>
              <Box border={"1px solid green"}>
                {fileNameList}(수정) 첨부한 파일이 보임
              </Box>
              <Textarea
                h={"80px"}
                w={"450px"}
                placeholder={
                  "사실과 관계없는 내용을 작성시 관계 법령에 따라 처벌받을 수 있습니다."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {/* 파일 첨부 */}
              <FormControl>
                <Flex>
                  <Input
                    p={1}
                    w={"90px"}
                    h={"35px"}
                    multiple={true}
                    type={"file"}
                    accept={"image/*"}
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <Box>{fileNameList}</Box>
                </Flex>
                <FormHelperText>
                  첨부 파일의 총 용량은 10MB, 한 파일은 1MB를 초과할 수
                  없습니다.
                </FormHelperText>
              </FormControl>
            </Box>

            <Button
              h={"80px"}
              isLoading={isProcessing}
              isDisabled={content.trim().length === 0}
              onClick={handleClickWriteReview}
            >
              등록
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
