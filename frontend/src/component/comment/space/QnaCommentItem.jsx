import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../LoginProvider.jsx";
import { QnaCommentEdit } from "./QnaCommentEdit.jsx";
import { FaEllipsisV } from "react-icons/fa";

export function QnaCommentItem({ comment, isProcessing, setIsProcessing }) {
  const [isEditing, setIsEditing] = useState(false);
  const [replies, setReplies] = useState([]);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const [member, setMember] = useState({});

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickRemoveQnaComment() {
    setIsProcessing(true);

    axios
      .delete("/api/comment/deleteQna", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {
        toast({
          status: "info",
          description: "QNA가 삭제되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        onClose();
        setIsProcessing(false);
      });
  }

  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {});
    }

    // 대댓글 목록 가져오기
    axios
      .get(`/api/commentRe/listAll/${comment.commentId}`)
      .then((response) => {
        setReplies(response.data);
      })
      .catch((error) => console.error("Error fetching replies:", error));
  }, [account, comment.commentId]);

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
        targetId: comment.memberId,
      })
      .then((res) => {
        const newReply = {
          ...res.data,
          content: newReplyContent,
          nickname: account.nickname,
          targetName: comment.nickname,
        };
        setReplies([...replies, newReply]);
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

  return (
    <Card>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <HStack>
              <Avatar src={comment.profileImage} size="md" />
              <Text fontSize="xl">{comment.nickname}</Text>
            </HStack>
            {account.hasAccess(comment.memberId) && !isEditing && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaEllipsisV />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItem onClick={() => setIsEditing(!isEditing)}>
                    수정
                  </MenuItem>
                  <MenuItem onClick={onOpen}>삭제</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>

          {isEditing || (
            <Box>
              <Text mb={2}>{comment.content}</Text>
              <Text fontSize="sm" color="gray.500">
                {comment.inputDt}
              </Text>
            </Box>
          )}

          {isEditing && (
            <QnaCommentEdit
              comment={comment}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              setIsEditing={setIsEditing}
            />
          )}

          {/* 대댓글 목록 */}
          {replies.length > 0 && (
            <VStack spacing={2} align="stretch" pl={4} mt={2}>
              {replies.map((reply) => (
                <Box key={reply.commentReId} width="100%">
                  <Flex justify="space-between" align="flex-start">
                    <HStack spacing={2} alignItems="flex-start" flex={1}>
                      <Text fontWeight="bold">@{reply.targetName}</Text>
                      {editingReplyId === reply.commentReId ? (
                        <VStack width="100%" align="stretch">
                          <Textarea
                            value={editingReplyContent}
                            onChange={(e) =>
                              setEditingReplyContent(e.target.value)
                            }
                            size="sm"
                            resize="vertical"
                            minHeight="100px"
                          />
                          <HStack justifyContent="flex-end">
                            <Button size="sm" onClick={handleReplyUpdate}>
                              저장
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setEditingReplyId(null)}
                            >
                              취소
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        <Text flex={1}>{reply.content}</Text>
                      )}
                    </HStack>
                    {!editingReplyId && (
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
                              onClick={() =>
                                handleReplyDelete(reply.commentReId)
                              }
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </HStack>
                    )}
                  </Flex>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>QNA 삭제</ModalHeader>
          <ModalBody>작성하신 QNA를 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="red"
              isLoading={isProcessing}
              onClick={handleClickRemoveQnaComment}
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
