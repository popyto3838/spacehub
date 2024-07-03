import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormHelperText,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { LoginContext } from "../../LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

export function ReviewCommentEdit({
  comment,
  setIsEditing,
  isProcessing,
  setIsProcessing,
  spaceId,
}) {
  const [commentText, setCommentText] = useState(comment.content);
  // 이미지 삭제를 위한 상태
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndexes, setHoveredIndexes] = useState(
    Array(
      comment.commentFilesLists ? comment.commentFilesLists.length : 0,
    ).fill(false),
  );

  // 별점 클릭 이벤트 핸들러
  const [rateScore, setRateScore] = useState(comment.rateScore);
  const starArray = [1, 2, 3, 4, 5];
  const clickStar = (starScore) => {
    setRateScore(starScore);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndexes((prev) => {
      const newHoveredIndexes = [...prev];
      newHoveredIndexes[index] = true;
      return newHoveredIndexes;
    });
  };
  const handleMouseLeave = (index) => {
    setHoveredIndexes((prev) => {
      const newHoveredIndexes = [...prev];
      newHoveredIndexes[index] = false;
      return newHoveredIndexes;
    });
  };

  // 파일 삭제, 추가를 위한 상태
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // commentList 정보를 가져옴
  useEffect(() => {
    if (!isProcessing) {
      axios.get(`/api/comment/listReview/${spaceId}`).then((res) => {
        setCommentList(res.data);
      });
    }
  }, [isProcessing]);

  function handleClickUpdateReviewContent() {
    setIsProcessing(true);

    axios
      .putForm("/api/comment/editReview", {
        commentId: comment.commentId,
        content: commentText,
        removeFileList,
        addFileList,
        rateScore,
      })
      .then((res) => {
        toast({
          status: "info",
          description: "REVIEW가 수정되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsProcessing(false);
        setIsEditing(false);
      });
  }

  // 추가하려는 파일이 존재하면 덮어쓰기
  const fileNameList = [];
  for (let addFile of addFileList) {
    let duplicate = false;
    if (comment.commentFilesLists) {
      for (let file of comment.commentFilesLists) {
        if (file.fileName === addFile.name) {
          duplicate = true;
          break;
        }
      }
    }
    fileNameList.push(
      <li key={addFile.name}>
        {addFile.name}
        {duplicate && <Badge colorScheme={"red"}>중복</Badge>}
      </li>,
    );
  }

  function handleClickDeleteFiles(fileName) {
    setRemoveFileList((prev) => {
      if (prev.includes(fileName)) {
        return prev.filter((file) => file !== fileName);
      } else {
        return [...prev, fileName];
      }
    });
  }

  // aws 설정
  const s3BaseUrl = "https://studysanta.s3.ap-northeast-2.amazonaws.com/prj3";

  return (
    <VStack spacing={4} align="stretch">
      {/* 별점 */}
      <Wrap>
        {starArray.map((star) => (
          <WrapItem key={star}>
            {comment.rateScore >= 1 && (
              <Image
                w={8}
                onClick={() => clickStar(star)}
                src={`${s3BaseUrl}/ic-star-${star <= rateScore ? "on" : "off"}.png`}
                alt="star"
                cursor="pointer"
              />
            )}
          </WrapItem>
        ))}
        <WrapItem>
          <Text>{rateScore}점</Text>
        </WrapItem>
      </Wrap>

      <SimpleGrid columns={[2, 3, 4]} spacing={2}>
        {/* 코멘트에 첨부되어 있는 파일 */}
        {comment.commentFilesLists &&
          comment.commentFilesLists.map((file, index) => (
            <Box key={file.filename} position="relative">
              <Image
                w="full"
                h={150}
                objectFit="cover"
                src={file.src}
                alt={file.fileName}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                filter={
                  removeFileList.includes(file.fileName) ? "blur(8px)" : "none"
                }
              />
              {hoveredIndexes[index] && (
                <Box
                  position="absolute"
                  top={1}
                  right={1}
                  onMouseEnter={() => handleMouseEnter(index)}
                  cursor="pointer"
                  onClick={() => handleClickDeleteFiles(file.fileName)}
                >
                  <IconButton
                    icon={<FontAwesomeIcon icon={faX} />}
                    size="sm"
                    aria-label="Delete file"
                    colorScheme="red"
                  />
                </Box>
              )}
            </Box>
          ))}
      </SimpleGrid>

      {/* 텍스트박스 */}
      <Textarea
        h="80px"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="REVIEW를 작성해보세요."
      />

      {/* 게시물에 새롭게 파일 첨부 */}
      <FormControl>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setAddFileList(e.target.files)}
        />
        <FormHelperText>
          첨부 파일의 총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
        </FormHelperText>
      </FormControl>

      {fileNameList && <Box>{fileNameList}</Box>}

      <HStack justify="flex-end">
        <Button onClick={() => setIsEditing(false)}>취소</Button>
        <Button
          colorScheme="blue"
          isLoading={isProcessing}
          isDisabled={commentText.length === 0}
          onClick={onOpen}
        >
          등록
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리뷰 수정</ModalHeader>
          <ModalBody>작성하신 리뷰를 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isProcessing}
              onClick={handleClickUpdateReviewContent}
            >
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
