import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormHelperText,
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
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardEdit() {
  const { boardId } = useParams();
  const [board, setBoard] = useState({});

  // 파일 삭제,추가를 위한 상태
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/board/${boardId}`).then((res) => {
      /*res.data -> res.data.board*/
      const boardData = res.data.board;
      boardData.filesLists = boardData.filesLists || [];
      setBoard(boardData);
    });
  }, [boardId]);

  function handleClickSave() {
    axios
      .putForm(`/api/board/${boardId}/edit`, {
        id: board.boardId,
        title: board.title,
        content: board.content,
        categoryId: board.categoryId,
        removeFileList,
        addFileList,
      })
      .then((res) => {
        setBoard(res.data);
        toast({
          status: "success",
          description: "게시물이 수정되었습니다.",
          position: "top",
        });
        navigate(`/board/${boardId}`);
      });
  }

  // 추가하려는 파일이 존재하면 덮어쓰기
  const fileNameList = [];
  for (let addFile of addFileList) {
    let duplicate = false;
    for (let file of board.filesLists) {
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

  function handleSwitchChangeRemove(fileName, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, fileName]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== fileName));
    }
  }

  return (
    <Box bg="gray.100" minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Card w="full">
            <CardBody>
              <Heading>{board.boardId}번 게시물 수정</Heading>
            </CardBody>
          </Card>

          <Card w="full">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>제목</FormLabel>
                  <Input
                    defaultValue={board.title}
                    onChange={(e) =>
                      setBoard({ ...board, title: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>내용</FormLabel>
                  <Textarea
                    minHeight={"400px"}
                    defaultValue={board.content}
                    onChange={(e) =>
                      setBoard({ ...board, content: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>작성자</FormLabel>
                  <Input value={board.writer} readOnly />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* 게시물에 첨부된 파일 */}
          {board.filesLists &&
            Array.isArray(board.filesLists) &&
            board.filesLists.length > 0 && (
              <Card w="full">
                <CardBody>
                  <Heading size="md" mb={4}>
                    첨부 파일 목록
                  </Heading>
                  <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                    {board.filesLists.map((file) => (
                      <Box
                        key={file.fileName}
                        borderWidth={1}
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Flex justify="space-between" p={2}>
                          <Text>지우기:</Text>
                          <Switch
                            onChange={(e) =>
                              handleSwitchChangeRemove(
                                file.fileName,
                                e.target.checked,
                              )
                            }
                          />
                        </Flex>
                        <Text p={2}>{file.fileName}</Text>
                        <Image
                          sx={
                            removeFileList.includes(file.fileName)
                              ? { filter: "blur(8px)" }
                              : {}
                          }
                          src={file.src}
                          alt={file.fileName}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}

          {/* 게시물에 파일 첨부 */}
          <Card w="full">
            <CardBody>
              <FormControl>
                <FormLabel>파일 첨부</FormLabel>
                <Input
                  multiple={true}
                  type="file"
                  accept="image/*, .pdf, .doc, .docx, .xls, .txt, .ppt"
                  onChange={(e) => setAddFileList(e.target.files)}
                />
                <FormHelperText>
                  첨부 파일의 총 용량은 10MB, 한 파일은 1MB를 초과할 수
                  없습니다.
                </FormHelperText>
              </FormControl>
              {fileNameList.length > 0 && (
                <Box mt={4}>
                  <ul>{fileNameList}</ul>
                </Box>
              )}
            </CardBody>
          </Card>

          <Card w="full">
            <CardBody>
              <HStack spacing={4}>
                <Button ml={"auto"} onClick={() => navigate(-1)}>
                  취소
                </Button>
                <Button colorScheme="blue" onClick={onOpen}>
                  확인
                </Button>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시물 수정</ModalHeader>
          <ModalBody>수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" onClick={handleClickSave}>
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
