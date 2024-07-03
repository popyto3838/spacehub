import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
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
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import { ReviewCommentEdit } from "./ReviewCommentEdit.jsx";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";

export function ReviewCommentItem({
  comment,
  isProcessing,
  setIsProcessing,
  spaceId,
}) {
  const [isEditing, setIsEditing] = useState(false);

  // 별점
  const starArray = [1, 2, 3, 4, 5];

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

  // aws 설정
  const s3BaseUrl = "https://studysanta.s3.ap-northeast-2.amazonaws.com/prj3";

  return (
    <Card>
      {/* 멤버이미지, 아이디, 수정/삭제 드롭다운 */}
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <HStack>
              <Avatar src={member.profileImage} size="md" />
              <Text fontSize="xl">{comment.nickname}</Text>
            </HStack>
            <Text>좋아요</Text>
          </Flex>

          {/* 별점, 텍스트박스, 등록 버튼 */}
          {isEditing || (
            <Box>
              <Flex align="center" mb={2}>
                <Wrap>
                  {starArray.map((star) => (
                    <WrapItem key={star}>
                      {comment.rateScore >= 1 && (
                        <Image
                          w={6}
                          src={`${s3BaseUrl}/ic-star-${star <= comment.rateScore ? "on" : "off"}.png`}
                          alt="star"
                        />
                      )}
                    </WrapItem>
                  ))}
                </Wrap>
                <Text ml={2}>{comment.rateScore}점</Text>
                <Spacer />
                {account.hasAccess(comment.memberId) && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      variant="ghost"
                    />
                    <MenuList minWidth={"60px"}>
                      <MenuItem onClick={() => setIsEditing(!isEditing)}>
                        수정
                      </MenuItem>
                      <MenuItem onClick={onOpen}>삭제</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Flex>
              <SimpleGrid columns={[2, 3, 4]} spacing={2} mb={2}>
                {/* 수정중이 아닐때는 첨부한 이미지 파일이 보임 */}
                {comment.commentFilesLists &&
                  comment.commentFilesLists.map((file) => (
                    <Image
                      key={file.fileName}
                      src={file.src}
                      alt={file.fileName}
                    />
                  ))}
              </SimpleGrid>
              <Text>{comment.content}</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                {comment.inputDt}
              </Text>
            </Box>
          )}

          {/* 수정중일때 보이는 컴포넌트*/}
          {isEditing && (
            <ReviewCommentEdit
              comment={comment}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              setIsEditing={setIsEditing}
              spaceId={spaceId}
            />
          )}
        </VStack>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리뷰 삭제</ModalHeader>
          <ModalBody>작성하신 리뷰를 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="red"
              isLoading={isProcessing}
              onClick={handleClickDeleteReviewComment}
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
