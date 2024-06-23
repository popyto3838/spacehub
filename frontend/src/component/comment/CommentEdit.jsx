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
    <Flex>
      <Box>
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </Box>
      <Box>
        <Button onClick={() => setIsEditing(false)}>취소</Button>
        <Button isLoading={isProcessing} onClick={onOpen}>
          저장
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>댓글 수정</ModalHeader>
          <ModalBody>댓글을 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickSave}>수정</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
