import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardEdit() {
  const { boardId } = useParams();
  const [board, setBoard] = useState({});

  // 파일 삭제를 위한 상태
  const [removeFileList, setRemoveFileList] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/board/${boardId}`).then((res) => {
      setBoard(res.data);
    });
  }, []);

  function handleClickSave() {
    axios
      .putForm(`/api/board/${boardId}/edit`, {
        id: board.boardId,
        title: board.title,
        content: board.content,
        removeFileList,
      })
      .then((res) => {
        setBoard(res.data);
        toast({
          status: "success",
          description: "게시물이 수정되었습니다.",
          position: "top",
        });
        navigate(`/board/${boardId}`);
      });
  }

  function handleSwitchChangeRemove(fileName, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, fileName]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== fileName));
    }
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
            <Input value={account.nickname} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            <Input value={board.updateDateAndTime} readOnly />
          </FormControl>
        </Box>

        <Box>
          <Box>첨부 파일</Box>
          {board.filesLists &&
            board.filesLists.map((file) => (
              <Box border={"1px solid black"} key={file.fileName}>
                <Flex>
                  지우기 :
                  <Switch
                    onChange={(e) =>
                      handleSwitchChangeRemove(file.fileName, e.target.checked)
                    }
                  />
                  <Text>{file.fileName}</Text>
                </Flex>
                <Box>
                  <Image
                    sx={
                      removeFileList.includes(file.fileName)
                        ? { filter: "blur(8px)" }
                        : {}
                    }
                    src={file.src}
                    alt={file.fileName}
                  />
                </Box>
              </Box>
            ))}
        </Box>

        <Box>
          <Button onClick={() => navigate(-1)}>취소</Button>
          <Button onClick={onOpen}>확인</Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시물 수정</ModalHeader>
          <ModalBody>수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickSave}>수정</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
