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
  Spacer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";

export function CommentItem({ comment, isProcessing, setIsProcessing }) {
  const [isEditing, setIsEditing] = useState(false);

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const account = useContext(LoginContext);

  function handleClickDelete() {
    setIsProcessing(true);
    axios
      .delete("/api/comment/delete", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        onClose();
        setIsProcessing(false);
        toast({
          status: "success",
          description: "댓글이 삭제되었습니다.",
          position: "top",
          duration: 700,
        });
      });
  }

  return (
    <Box border={"1px solid black"}>
      <Flex>
        <Box>{comment.nickname}</Box>
        <Spacer />
        <Box>{comment.inputDt}</Box>
      </Flex>
      {isEditing || (
        /* 수정중이 아닐때는 Flex 박스를 보여줌 */
        <Flex>
          <Box>{comment.content}</Box>
          <Spacer />
          {account.hasAccess(comment.memberId) && (
            <Box>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button isLoading={isProcessing} onClick={onOpen}>
                삭제
              </Button>
            </Box>
          )}
        </Flex>
      )}

      {isEditing && (
        <CommentEdit
          comment={comment}
          setIsEditing={setIsEditing}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      )}

      {account.hasAccess(comment.memberId) && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>댓글 삭제</ModalHeader>
            <ModalBody>댓글을 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button isLoading={isProcessing} onClick={handleClickDelete}>
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
