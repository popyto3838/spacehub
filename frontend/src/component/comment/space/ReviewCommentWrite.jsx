import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function ReviewCommentWrite({ spaceId, isProcessing, setIsProcessing }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

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
      });
  }

  // files 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  return (
    <Box>
      <FormControl>
        <Flex>
          <Box border={"1px solid black"} m={1}>
            멤버 이미지
          </Box>
          <Box border={"1px solid black"} m={1}>
            {account.nickname}
          </Box>
        </Flex>
        <Flex>
          <Box border={"1px solid black"} m={1}>
            별점
          </Box>
          <Box border={"1px solid black"} m={1}>
            날짜
          </Box>
        </Flex>
        <Flex>
          {/* isDisabled에 결제 이력이 없을 경우 추가 */}
          <Box>
            <Textarea
              isDisabled={!account.isLoggedIn()}
              placeholder={
                "사실과 관계없는 내용을 작성시 관계 법령에 따라 처벌받을 수 있습니다."
              }
              w={"500px"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Input
              p={1}
              w={"90px"}
              h={"35px"}
              multiple={true}
              type={"file"}
              accept={"image/*"}
              onChange={(e) => setFiles(e.target.files)}
            />
          </Box>
          <Box>{fileNameList}</Box>
          <Tooltip
            label={"로그인 하세요."}
            isDisabled={account.isLoggedIn()}
            placement={"top"}
          >
            <Box>
              <Button
                isDisabled={content.trim().length === 0}
                onClick={handleClickWriteReview}
              >
                등록
              </Button>
            </Box>
          </Tooltip>
        </Flex>
        <Box>날짜</Box>
      </FormControl>
    </Box>
  );
}
