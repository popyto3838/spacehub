import { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
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
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <FormControl>
        <Box border={"1px solid black"}>
          <Flex>
            <Box border={"1px solid black"} m={1}>
              별점
            </Box>
          </Flex>

          <Box>
            <Flex>
              {/* isDisabled에 결제 이력이 없을 경우 추가 */}
              <Box>
                <Textarea
                  value={commentText}
                  w={"500px"}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Box>
              <Box>
                <Button onClick={() => setIsEditing(false)}>취소</Button>
                <Button isLoading={isProcessing} onClick={onOpen}>
                  확인
                </Button>
              </Box>
            </Flex>
          </Box>
        </Box>
      </FormControl>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리뷰 수정</ModalHeader>
          <ModalBody>리뷰를 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickUpdateReviewContent}>수정</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
