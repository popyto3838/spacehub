import {
  Box,
  Button,
  Flex,
  Image,
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
  Spacer,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../LoginProvider.jsx";
import { QnaCommentEdit } from "./QnaCommentEdit.jsx";

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
    <Box border={"1px solid black"}>
      {/* 멤버이미지, 아이디, 수정/삭제 드롭다운 */}
      <Flex>
        <Image
          border={"1px solid red"}
          borderRadius={"full"}
          w={"50px"}
          src={member.profileImage}
        />
        <Box fontSize={"2xl"}>{comment.nickname}</Box>
        <Spacer />
        {account.hasAccess(comment.memberId) && !isEditing && (
          <Menu>
            <MenuButton m={1} fontSize={"2xl"}>
              ...
            </MenuButton>
            <MenuList minWidth={"50px"}>
              <MenuItem onClick={() => setIsEditing(!isEditing)}>수정</MenuItem>
              <MenuItem onClick={onOpen}>삭제</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>

      {/* 텍스트박스, 등록 버튼 */}
      {isEditing || (
        <Box>
          <Flex>
            <Textarea h={"80px"} readOnly={true} value={comment.content} />
          </Flex>
          <Box>{comment.inputDt}</Box>
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

      {account.hasAccess(comment.memberId) && (
        <Modal isOpen={isOpen} onClose={onclose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>QNA 삭제</ModalHeader>
            <ModalBody>작성하신 QNA를 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button
                isLoading={isProcessing}
                onClick={handleClickRemoveQnaComment}
              >
                확인
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
