import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
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
    <VStack spacing={4} align="stretch">
      {/* 텍스트박스, 버튼 */}
      <Textarea
        h="80px"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="QNA를 작성해보세요."
      />

      <HStack justify="flex-end">
        <Button onClick={() => setIsEditing(false)}>취소</Button>
        <Button
          colorScheme="blue"
          isDisabled={commentText.length === 0}
          isLoading={isProcessing}
          onClick={onOpen}
        >
          등록
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>QNA 수정</ModalHeader>
          <ModalBody>작성하신 QNA를 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isProcessing}
              onClick={handleClickEditCommentQna}
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
