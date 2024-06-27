import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
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
    <Box>
      <Flex>
        <Heading>{board.boardId}번 게시물</Heading>
        <Spacer />
        {isLikeProcessing || (
          <Flex>
            <Tooltip
              isDisabled={account.isLoggedIn()}
              hasArrow
              label={"로그인 해주세요."}
            >
              <Box
                onClick={handleClickLike}
                cursor={"pointer"}
                fontSize={"3xl"}
              >
                {like.like && <FontAwesomeIcon icon={fullHeart} />}
                {like.like || <FontAwesomeIcon icon={emptyHeart} />}
              </Box>
            </Tooltip>
            <Box fontSize={"3xl"}>{like.count}</Box>
          </Flex>
        )}
        {isLikeProcessing && (
          <Box pr={3}>
            <Spinner />
          </Box>
        )}
      </Flex>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={board.title} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Textarea value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.writer} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            {/* 수정되면 작성일시 수정한 시간으로 변함 */}
            <FormLabel>작성일시</FormLabel>
            {/*<Box>inputDt : {board.inputDateAndTime}</Box>*/}
            {/*<Box>updateDt : {board.updateDateAndTime}</Box>*/}
            {board.inputDt !== board.updateDt && (
              <Flex>
                <Input value={board.updateDateAndTime} readOnly />
                <Box>(수정됨)</Box>
              </Flex>
            )}
            {board.inputDt === board.updateDt && (
              <Input value={board.inputDateAndTime} readOnly />
            )}
          </FormControl>
        </Box>

        <Box>
          <Box>첨부 파일</Box>
          {board.filesLists &&
            board.filesLists.map((file) => (
              <Box border={"1px solid black"} key={file.fileName}>
                <Image src={file.src} alt={file.fileName} />
              </Box>
            ))}
        </Box>

        {account.hasAccess(board.memberId) && (
          <Box>
            <Button onClick={onOpen}>삭제</Button>
            <Button onClick={() => navigate(`/board/${boardId}/edit`)}>
              수정
            </Button>
          </Box>
        )}
        <Button onClick={() => navigate(-1)}>목록</Button>
      </Box>

      {/* comment component -> boardId가 있을때만 넘겨줌(undefined 해결) */}
      {board.boardId && (
        <CommentComponent
          boardId={board.boardId}
          categoryId={board.categoryId}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시물 삭제</ModalHeader>
          <ModalBody>정말 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickRemove}>삭제</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
