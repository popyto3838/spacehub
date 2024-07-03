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

  // member 정보를 가져옴
  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {});
    }
  }, [account]);

  return (
    <Card>
      {/* 멤버이미지, 아이디, 수정/삭제 드롭다운 */}
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

          {/* 텍스트박스, 등록 버튼 */}
          {isEditing || (
            <Box>
              <Text mb={2}>{comment.content}</Text>
              <Text fontSize="sm" color="gray.500">
                {comment.inputDt}
              </Text>
            </Box>
          )}

          {/* QNA 수정 컴포넌트 */}
          {isEditing && (
            <QnaCommentEdit
              comment={comment}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              setIsEditing={setIsEditing}
            />
          )}
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
