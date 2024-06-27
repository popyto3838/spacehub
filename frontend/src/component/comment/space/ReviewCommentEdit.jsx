import { useContext, useState } from "react";
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
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";

export function ReviewCommentEdit({
  comment,
  setIsEditing,
  isProcessing,
  setIsProcessing,
}) {
  const [commentText, setCommentText] = useState(comment.content);

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickUpdateReviewContent() {
    setIsProcessing(true);

    axios
      .put("/api/comment/editReview", {
        commentId: comment.commentId,
        content: commentText,
      })
      .then((res) => {
        toast({
          status: "info",
          description: "REVIEW가 수정되었습니다.",
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
        <Box border={"1px solid black"} m={1}>
          별점
        </Box>
        <Flex>
          <Textarea
            h={"80px"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={"REVIEW를 작성해보세요."}
          />

          <Button mt={10} h={"40px"} onClick={() => setIsEditing(false)}>
            취소
          </Button>
          <Button
            mt={10}
            h={"40px"}
            isLoading={isProcessing}
            isDisabled={commentText.length === 0}
            onClick={onOpen}
          >
            등록
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리뷰 수정</ModalHeader>
          <ModalBody>작성하신 리뷰를 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button
              isLoading={isProcessing}
              onClick={handleClickUpdateReviewContent}
            >
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
