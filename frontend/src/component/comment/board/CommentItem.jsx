import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
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
    <Card>
      <CardBody>
        <VStack spacing={2} align="stretch">
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold">{comment.nickname}</Text>
            <Text fontSize="sm" color="gray.500">
              {comment.inputDt}
            </Text>
          </Flex>
          {isEditing || (
            <Flex align="center">
              <Text>{comment.content}</Text>
              <Spacer />
              {account.hasAccess(comment.memberId) && (
                <HStack spacing={2}>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    수정
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    isLoading={isProcessing}
                    onClick={onOpen}
                  >
                    삭제
                  </Button>
                </HStack>
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
        </VStack>
      </CardBody>

      {account.hasAccess(comment.memberId) && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>댓글 삭제</ModalHeader>
            <ModalBody>댓글을 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                취소
              </Button>
              <Button
                colorScheme="red"
                isLoading={isProcessing}
                onClick={handleClickDelete}
              >
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );
}
