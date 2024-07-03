import {
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
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function CommentEdit({
  comment,
  setIsEditing,
  isProcessing,
  setIsProcessing,
}) {
  const [commentText, setCommentText] = useState(comment.content);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  function handleClickSave() {
    setIsProcessing(true);
    axios
      .put("/api/comment/edit", {
        commentId: comment.commentId,
        content: commentText,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "댓글이 수정되었습니다.",
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
    <VStack spacing={3} align="stretch">
      <Textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        borderColor="gray.300"
        _hover={{ borderColor: "gray.400" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      />
      <Flex justify="flex-end">
        <Button mr={2} onClick={() => setIsEditing(false)}>
          취소
        </Button>
        <Button colorScheme="blue" isLoading={isProcessing} onClick={onOpen}>
          저장
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>댓글 수정</ModalHeader>
          <ModalBody>댓글을 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" onClick={handleClickSave}>
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
