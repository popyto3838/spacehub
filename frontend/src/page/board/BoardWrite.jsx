import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 파일 첨부
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  function handleClickSave() {
    setIsLoading(true);
    axios
      .postForm("/api/board/write", { title, content, categoryId, files })
      .then((res) => {
        toast({
          status: "success",
          description: "새 게시물이 등록되었습니다.",
          position: "top",
          duration: 1000,
        });
        navigate("/board/list");
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "게시물이 작성되지 않았습니다.",
          position: "top",
          duration: 1000,
        });
      })
      .finally(setIsLoading(false));
  }

  let isDisabledButton = false;
  if (categoryId === "") {
    isDisabledButton = true;
  }
  if (title.trim().length === 0) {
    isDisabledButton = true;
  }
  if (content.trim().length === 0) {
    isDisabledButton = true;
  }

  // files 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(<li>{files[i].name}</li>);
  }

  return (
    <Box>
      <Box>
        <Heading>게시글 작성</Heading>
      </Box>
      <Box>
        <Box>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder={"게시판을 선택해 주세요."}
          >
            <option value={"1"}>공지사항</option>
            <option value={"2"}>FAQ</option>
          </Select>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              placeholder={"제목을 입력해주세요"}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Textarea
              placeholder={"내용을 입력하세요."}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={account.nickname} readOnly />
          </FormControl>
        </Box>

        {/* 파일 첨부 */}
        <Box>
          <FormControl>
            <FormLabel>파일 첨부</FormLabel>
            <Input
              multiple={true}
              type={"file"}
              accept={"image/*, .pdf, .doc, .docx, .xls, .txt, .ppt"}
              onChange={(e) => setFiles(e.target.files)}
            />
            <FormHelperText>
              첨부 파일의 총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
            </FormHelperText>
          </FormControl>
          <Box>
            <ul>{fileNameList}</ul>
          </Box>
        </Box>

        <Box>
          <Button onClick={() => navigate(-1)}>취소</Button>
          <Button
            isLoading={isLoading}
            colorScheme={"blue"}
            isDisabled={isDisabledButton}
            onClick={handleClickSave}
          >
            등록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
