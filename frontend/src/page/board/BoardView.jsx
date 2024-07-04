import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { CommentComponent } from "../../component/comment/board/CommentComponent.jsx";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState({});

  // 좋아요
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  // 화면에서 진행중인지 판단하는 상태
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/board/${boardId}`)
      .then((res) => {
        /* res.data -> res.data.board */
        setBoard(res.data.board);
        setLike(res.data.like);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "잘못된 페이지 요청입니다.",
            position: "top",
          });
          navigate("/");
        }
      });
  }, []);

  function handleClickRemove() {
    axios
      .delete(`/api/board/${boardId}/delete`)
      .then(() => {
        toast({
          status: "success",
          description: "게시물이 삭제되었습니다.",
          position: "top",
        });
        navigate("/board/list");
      })
      .catch((err) => {})
      .finally(() => {
        onClose();
      });
  }

  function handleClickLike() {
    if (!account.isLoggedIn()) {
      return;
    }
    setIsLikeProcessing(true);
    axios
      .put("/api/board/like", { boardId: board.boardId })
      .then((res) => {
        setLike(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLikeProcessing(false);
      });
  }

  return (
    <Box bg="gray.100" minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Card w="full">
            <CardBody>
              <Flex justify="space-between" align="center">
                <Heading>{board.boardId}번 게시물</Heading>
                {isLikeProcessing || (
                  <Flex align="center">
                    <Tooltip
                      isDisabled={account.isLoggedIn()}
                      hasArrow
                      label="로그인 해주세요."
                    >
                      <Box
                        onClick={handleClickLike}
                        cursor="pointer"
                        fontSize="3xl"
                        mr={2}
                      >
                        {like.like ? (
                          <FontAwesomeIcon icon={fullHeart} />
                        ) : (
                          <FontAwesomeIcon icon={emptyHeart} />
                        )}
                      </Box>
                    </Tooltip>
                    <Box fontSize="3xl">{like.count}</Box>
                  </Flex>
                )}
                {isLikeProcessing && <Spinner />}
              </Flex>
            </CardBody>
          </Card>

          <Card w="full">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>제목</FormLabel>
                  <Input value={board.title} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>내용</FormLabel>
                  <Textarea
                    minHeight={"400px"}
                    value={board.content}
                    readOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>작성자</FormLabel>
                  <Input value={board.writer} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>작성일시</FormLabel>
                  {board.inputDt !== board.updateDt ? (
                    <Flex align="center">
                      <Input w={750} value={board.updateDateAndTime} readOnly />
                      <Box ml={2}>(수정됨)</Box>
                    </Flex>
                  ) : (
                    <Input value={board.inputDateAndTime} readOnly />
                  )}
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {board.filesLists && board.filesLists.length > 0 && (
            <Card w="full">
              <CardBody>
                <Heading size="md" mb={4}>
                  첨부 파일
                </Heading>
                <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                  {board.filesLists.map((file) => (
                    <Box
                      key={file.fileName}
                      borderWidth={1}
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      <Image src={file.src} alt={file.fileName} />
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          )}

          <Card w="full">
            <CardBody>
              <HStack spacing={4}>
                <Button onClick={() => navigate(-1)}>목록</Button>
                {account.hasAccess(board.memberId) && (
                  <>
                    <Button ml={"auto"} colorScheme="red" onClick={onOpen}>
                      삭제
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate(`/board/${boardId}/edit`)}
                    >
                      수정
                    </Button>
                  </>
                )}
              </HStack>
            </CardBody>
          </Card>

          {board.boardId && (
            <Card w="full">
              <CardBody>
                <CommentComponent
                  boardId={board.boardId}
                  categoryId={board.categoryId}
                />
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시물 삭제</ModalHeader>
          <ModalBody>정말 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="red" onClick={handleClickRemove}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
