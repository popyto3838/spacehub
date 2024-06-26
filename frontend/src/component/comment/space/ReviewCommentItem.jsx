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
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import { ReviewCommentEdit } from "./ReviewCommentEdit.jsx";
import axios from "axios";

export function ReviewCommentItem({ comment, isProcessing, setIsProcessing }) {
  const [isEditing, setIsEditing] = useState(false);

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickDeleteReviewComment() {
    setIsProcessing(true);

    axios
      .delete("/api/comment/deleteReview", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box>
      <FormControl>
        <Box border={"1px solid black"}>
          <Flex>
            <Box border={"1px solid black"} m={1}>
              멤버 이미지
            </Box>
            <Box border={"1px solid black"} m={1}>
              {account.nickname}
            </Box>
          </Flex>

          {isEditing || (
            <Box>
              <Box>
                <Box border={"1px solid black"} m={1}>
                  별점
                </Box>
              </Box>
              {/* isDisabled에 결제 이력이 없을 경우 추가 */}
              <Box>
                <Flex>
                  <Box>
                    <Textarea
                      isDisabled={!account.isLoggedIn()}
                      placeholder={
                        "사실과 관계없는 내용을 작성시 관계 법령에 따라 처벌받을 수 있습니다."
                      }
                      w={"500px"}
                      onChange={(e) => setContent(e.target.value)}
                    >
                      {comment.content}
                    </Textarea>
                  </Box>
                  <Tooltip
                    label={"로그인 하세요."}
                    isDisabled={account.isLoggedIn()}
                    placement={"top"}
                  >
                    <Box>
                      <Button onClick={() => setIsEditing(true)}>수정</Button>
                      <Button onClick={onOpen}>삭제</Button>
                    </Box>
                  </Tooltip>
                </Flex>
                <Box>날짜</Box>
              </Box>
            </Box>
          )}
        </Box>
      </FormControl>

      {isEditing && (
        <ReviewCommentEdit
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
            <ModalHeader>리뷰 삭제</ModalHeader>
            <ModalBody>리뷰를 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>취소</Button>
              <Button
                isLoading={isProcessing}
                onClick={handleClickDeleteReviewComment}
              >
                삭제
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
