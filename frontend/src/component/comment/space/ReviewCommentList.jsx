import { Box, Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewCommentItem } from "./ReviewCommentItem.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ReviewCommentList({ spaceId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);
  // 페이징
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const fetchCommmnet = () => {
    axios
      .get(`/api/comment/listReview/${spaceId}?${searchParams}`)
      .then((res) => {
        // res.data가 객체인지 확인하고 comments 배열을 추출
        const comments = res.data.comments;

        // 각 댓글에 대한 대댓글을 가져오는 Promise 배열 생성
        const commentPromises = comments.map((comment) =>
          axios
            .get(`/api/commentRe/listAll/${comment.commentId}`)
            .then((replyRes) => ({
              ...comment,
              replies: replyRes.data,
            })),
        );

        // 모든 Promise가 해결되면 상태 업데이트
        Promise.all(commentPromises).then((commentsWithReplies) => {
          setCommentList(commentsWithReplies);
        });

        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchCommmnet();
  }, [isProcessing, searchParams, spaceId]);

  const addReply = (commentId, newReply) => {
    setCommentList((prevList) =>
      prevList.map((comment) =>
        comment.commentId === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment,
      ),
    );
  };

  // 페이징
  const pageNumber = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumber.push(i);
  }

  function handleClickPageButton(pageNumber) {
    searchParams.set("reviewPage", pageNumber);
    navigate(`/space/${spaceId}?${searchParams}`);
  }

  // 대댓글 추가 함수

  return (
    <VStack spacing={6} align="stretch">
      {commentList.length > 0 ? (
        <>
          {commentList.map((comment) => (
            <ReviewCommentItem
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              comment={comment}
              key={comment.commentId}
              spaceId={spaceId}
              addReply={addReply}
            />
          ))}

          {/* 페이징 */}
          <Center>
            <HStack spacing={2}>
              {pageInfo.prevPageNumber && (
                <>
                  <Button size="sm" onClick={() => handleClickPageButton(1)}>
                    처음
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleClickPageButton(pageInfo.prevPageNumber)
                    }
                  >
                    이전
                  </Button>
                </>
              )}

              {pageNumber.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  size="sm"
                  onClick={() => handleClickPageButton(pageNumber)}
                  colorScheme={
                    pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
                  }
                >
                  {pageNumber}
                </Button>
              ))}

              {pageInfo.nextPageNumber && (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleClickPageButton(pageInfo.nextPageNumber)
                    }
                  >
                    다음
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleClickPageButton(pageInfo.lastPageNumber)
                    }
                  >
                    맨끝
                  </Button>
                </>
              )}
            </HStack>
          </Center>
        </>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            아직 작성된 리뷰가 없습니다.
          </Text>
        </Box>
      )}
    </VStack>
  );
}
