import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState({});

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/board/${boardId}`)
      .then((res) => setBoard(res.data))
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "잘못된 페이지 요청입니다.",
            position: "top",
          });
          navigate("/");
        }
      });
  }, []);

  function handleClickRemove() {
    axios
      .delete(`/api/board/${boardId}/delete`)
      .then(() => {
        toast({
          status: "success",
          description: "게시물이 삭제되었습니다.",
          position: "top",
        });
        navigate("/board/list");
      })
      .catch((err) => {})
      .finally(() => {
        onClose();
      });
  }

  return (
    <Box>
      <Box>
        <Heading>{board.boardId}번 게시물</Heading>
      </Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={board.title} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Textarea value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.nickName} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성일시</FormLabel>
            {board.updateDt ===
            <Input value={board.inputDateAndTime} readOnly /> && (
              <Input value={board.inputDateAndTime} readOnly />
            )}
            {board.updateDt !== <Input value={board.inputDt} readOnly /> && (
              <Input value={board.updateDateAndTime} readOnly />
            )}
          </FormControl>
        </Box>
        <Box>
          <Button onClick={onOpen}>삭제</Button>
          <Button onClick={() => navigate(`/board/${boardId}/edit`)}>
            수정
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시물 삭제</ModalHeader>
          <ModalBody>정말 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickRemove}>삭제</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
