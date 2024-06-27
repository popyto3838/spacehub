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
import { LoginContext } from "../../LoginProvider.jsx";
import { ReviewCommentEdit } from "./ReviewCommentEdit.jsx";
import axios from "axios";

export function ReviewCommentItem({ comment, isProcessing, setIsProcessing }) {
  const [isEditing, setIsEditing] = useState(false);

  // 좋아요
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  const [member, setMember] = useState({});

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickDeleteReviewComment() {
    setIsProcessing(true);

    axios
      .delete("/api/comment/deleteReview", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {
        toast({
          status: "info",
          description: "REVIEW가 삭제되었습니다.",
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
        <Box>좋아요</Box>
      </Flex>

      {/* 별점, 텍스트박스, 등록 버튼 */}
      {isEditing || (
        <Box>
          <Flex border={"1px solid black"} m={1}>
            <Box>별점</Box>
            <Spacer />
            {account.hasAccess(comment.memberId) && (
              <Menu>
                <MenuButton m={1} fontSize={"2xl"}>
                  ...
                </MenuButton>
                <MenuList minWidth={"50px"}>
                  <MenuItem onClick={() => setIsEditing(!isEditing)}>
                    수정
                  </MenuItem>
                  <MenuItem onClick={onOpen}>삭제</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
          <Box>
            {/* 수정중이 아닐때는 첨부한 이미지 파일이 보임*/}
            <Flex>
              {comment.commentFilesLists &&
                comment.commentFilesLists.map((file) => (
                  <Flex border={"1px solid green"} key={file.fileName}>
                    <Image w={150} src={file.src} />
                  </Flex>
                ))}
            </Flex>
            <Textarea h={"80px"} readOnly={true} value={comment.content} />
          </Box>
          <Box>{comment.inputDt}</Box>
        </Box>
      )}

      {isEditing && (
        <ReviewCommentEdit
          comment={comment}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setIsEditing={setIsEditing}
        />
      )}

      {account.hasAccess(comment.memberId) && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>리뷰 삭제</ModalHeader>
            <ModalBody>작성하신 리뷰를 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button
                isLoading={isProcessing}
                onClick={handleClickDeleteReviewComment}
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
