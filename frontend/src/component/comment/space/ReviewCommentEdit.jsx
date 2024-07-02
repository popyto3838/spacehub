import { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
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
    Array(comment.commentFilesLists.length).fill(false),
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
    for (let file of comment.commentFilesLists) {
      if (file.fileName === addFile.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <li>
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
    <Box>
      <Box>
        {/* 별점 */}
        <Wrap>
          {starArray.map((star) => (
            <WrapItem key={star}>
              {comment.rateScore >= 1 && (
                <Image
                  w={10}
                  onClick={() => clickStar(star)}
                  src={`${s3BaseUrl}/ic-star-${star <= rateScore ? "on" : "off"}.png`}
                  alt={"star"}
                  cursor={"pointer"}
                />
              )}
            </WrapItem>
          ))}
          <WrapItem>
            <Box>{rateScore}점</Box>
          </WrapItem>
        </Wrap>

        <Box>
          {/* 코멘트에 첨부되어있는 파일 */}
          <Flex>
            {comment.commentFilesLists &&
              comment.commentFilesLists.map((file, index) => (
                <Flex
                  position={"relative"}
                  border={"1px solid green"}
                  key={file.fileName}
                  m={1}
                >
                  <Image
                    w={150}
                    h={150}
                    src={file.src}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    sx={
                      removeFileList.includes(file.fileName)
                        ? { filter: "blur(8px)" }
                        : {}
                    }
                  />
                  {hoveredIndexes[index] && (
                    <Box
                      onMouseEnter={() => handleMouseEnter(index)}
                      cursor={"pointer"}
                      position={"absolute"}
                      top={-1}
                      right={0}
                      p={1}
                      fontSize={"2xl"}
                      onClick={(e) => handleClickDeleteFiles(file.fileName)}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </Box>
                  )}
                </Flex>
              ))}
          </Flex>

          <Flex>
            <Textarea
              h={"80px"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={"REVIEW를 작성해보세요."}
            />

            <Button mt={10} h={"40px"} onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button
              mt={10}
              h={"40px"}
              isLoading={isProcessing}
              isDisabled={commentText.length === 0}
              onClick={onOpen}
            >
              등록
            </Button>
          </Flex>

          {/* 게시물에 새롭게 파일 첨부 */}
          <FormControl>
            <Flex>
              <Input
                p={1}
                w={"90px"}
                h={"35px"}
                multiple={true}
                type={"file"}
                accept={"image/*"}
                onChange={(e) => setAddFileList(e.target.files)}
              />
              <Box>{fileNameList}</Box>
            </Flex>
            <FormHelperText>
              첨부 파일의 총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
            </FormHelperText>
          </FormControl>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리뷰 수정</ModalHeader>
          <ModalBody>작성하신 리뷰를 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button
              isLoading={isProcessing}
              onClick={handleClickUpdateReviewContent}
            >
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
