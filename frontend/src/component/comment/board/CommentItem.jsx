// CommentItem.jsx
import {
  Box,
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
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";

export function CommentItem({
  comment,
  isProcessing,
  setIsProcessing,
  targetId,
  addReply,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [deleteReplyId, setDeleteReplyId] = useState(null);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isReplyDeleteOpen,
    onClose: onReplyDeleteClose,
    onOpen: onReplyDeleteOpen,
  } = useDisclosure();

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

  function handleReplyEdit(replyId, content) {
    setEditingReplyId(replyId);
    setEditingReplyContent(content);
  }

  function handleReplyUpdate() {
    setIsProcessing(true);
    axios
      .put("/api/commentRe/update", {
        commentReId: editingReplyId,
        content: editingReplyContent,
      })
      .then(() => {
        const updatedReplies = replies.map((reply) =>
          reply.commentReId === editingReplyId
            ? { ...reply, content: editingReplyContent }
            : reply,
        );
        setReplies(updatedReplies);
        setEditingReplyId(null);
        toast({
          status: "success",
          description: "대댓글이 수정되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsProcessing(false));
  }

  function handleReplyDelete(replyId) {
    setIsProcessing(true);
    axios
      .delete(`/api/commentRe/delete/${replyId}`)
      .then(() => {
        const updatedReplies = replies.filter(
          (reply) => reply.commentReId !== replyId,
        );
        setReplies(updatedReplies);
        onReplyDeleteClose();
        toast({
          status: "success",
          description: "대댓글이 삭제되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsProcessing(false));
  }

  function handleNewReplySubmit() {
    if (!newReplyContent.trim()) {
      toast({
        status: "warning",
        description: "대댓글 내용을 입력해주세요.",
        position: "top",
        duration: 700,
      });
      return;
    }

    setIsProcessing(true);
    axios
      .post("/api/commentRe/write", {
        commentId: comment.commentId,
        content: newReplyContent,
        memberId: account.id,
        nickname: account.nickname,
        targetId: targetId,
      })
      .then((res) => {
        const newReply = {
          ...res.data,
          content: newReplyContent,
          nickname: account.nickname,
          targetName: comment.nickname,
        };
        addReply(comment.commentId, newReply); // CommentList의 상태 업데이트
        setReplies((prevReplies) => [...prevReplies, newReply]); // 로컬 상태 업데이트
        setNewReplyContent("");
        toast({
          status: "success",
          description: "대댓글이 작성되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsProcessing(false));
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
          {isEditing ? (
            <CommentEdit
              comment={comment}
              setIsEditing={setIsEditing}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          ) : (
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

          {/* 대댓글 목록 */}
          {replies.length > 0 && (
            <VStack spacing={2} align="stretch" pl={4} mt={2}>
              {replies.map((reply) => (
                <Box key={reply.commentReId} w="full">
                  {editingReplyId === reply.commentReId ? (
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontWeight="bold">@{reply.targetName}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {reply.nickname}
                        </Text>
                      </HStack>
                      <Textarea
                        value={editingReplyContent}
                        onChange={(e) => setEditingReplyContent(e.target.value)}
                        rows={3}
                      />
                      <HStack justifyContent="flex-end">
                        <Button
                          size="sm"
                          onClick={() => setEditingReplyId(null)}
                        >
                          취소
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={handleReplyUpdate}
                        >
                          저장
                        </Button>
                      </HStack>
                    </VStack>
                  ) : (
                    <Flex justify="space-between" align="center">
                      <HStack spacing={2} flex={1}>
                        <Text fontWeight="bold">@{reply.targetName}</Text>
                        <Text flex={1}>{reply.content}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Text fontSize="sm" color="gray.500">
                          {reply.nickname}
                        </Text>
                        {account.hasAccess(reply.memberId) && (
                          <>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleReplyEdit(
                                  reply.commentReId,
                                  reply.content,
                                )
                              }
                            >
                              수정
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              onClick={() => {
                                setDeleteReplyId(reply.commentReId);
                                onReplyDeleteOpen(reply.commentReId);
                              }}
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </HStack>
                    </Flex>
                  )}
                </Box>
              ))}
            </VStack>
          )}

          {/* 대댓글 작성 폼 */}
          <Box mt={4}>
            <Textarea
              placeholder="대댓글을 작성하세요"
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
            />
            <Button
              mt={2}
              colorScheme="blue"
              isLoading={isProcessing}
              onClick={handleNewReplySubmit}
            >
              대댓글 작성
            </Button>
          </Box>
        </VStack>
      </CardBody>

      {/* 댓글 삭제 모달 */}
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

      {/* 대댓글 삭제 모달 */}
      <Modal isOpen={isReplyDeleteOpen} onClose={onReplyDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>대댓글 삭제</ModalHeader>
          <ModalBody>대댓글을 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onReplyDeleteClose}>
              취소
            </Button>
            <Button
              colorScheme="red"
              isLoading={isProcessing}
              onClick={() => handleReplyDelete(deleteReplyId)}
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
