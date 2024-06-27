import {
  Box,
  Button,
  Flex,
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
import { useContext, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function QnaCommentEdit({
  comment,
  isProcessing,
  setIsProcessing,
  setIsEditing,
}) {
  const [commentText, setCommentText] = useState(comment.content);

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickEditCommentQna() {
    setIsProcessing(true);

    axios
      .put("/api/comment/editQna", {
        commentId: comment.commentId,
        content: commentText,
      })
      .then((res) => {
        toast({
          status: "info",
          description: "QNA가 수정되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Box>
        <Flex>
          <Textarea
            h={"80px"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={"QNA를 작성해보세요."}
          />

          <Button mt={10} h={"40px"} onClick={() => setIsEditing(false)}>
            취소
          </Button>
          <Button
            mt={10}
            h={"40px"}
            isDisabled={commentText.length === 0}
            isLoading={isProcessing}
            onClick={onOpen}
          >
            등록
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>QNA 수정</ModalHeader>
          <ModalBody>작성하신 QNA를 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button
              isLoading={isProcessing}
              onClick={handleClickEditCommentQna}
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
