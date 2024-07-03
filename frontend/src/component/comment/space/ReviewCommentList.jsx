import { Button, Center, HStack, VStack } from "@chakra-ui/react";
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

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listReview/${spaceId}?${searchParams}`)
        .then((res) => {
          // res.data가 객체인지 확인하고 comments 배열을 추출
          const comments = res.data.comments;
          setCommentList(comments);
          setPageInfo(res.data.pageInfo);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [isProcessing, searchParams]);

  // 페이징
  const pageNumber = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumber.push(i);
  }
  function handleClickPageButton(pageNumber) {
    searchParams.set("reviewPage", pageNumber);
    navigate(`/space/${spaceId}?${searchParams}`);
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* 각각의 리뷰를 가져오는 컴포넌트 */}
      {commentList.map((comment) => (
        <ReviewCommentItem
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          comment={comment}
          key={comment.commentId}
          spaceId={spaceId}
        />
      ))}

      {/* 페이징 */}
      <Center>
        <HStack spacing={2}>
          {pageInfo.prevPageNumber && (
            <>
              <Button onClick={() => handleClickPageButton(1)}>처음</Button>
              <Button
                onClick={() => handleClickPageButton(pageInfo.prevPageNumber)}
              >
                이전
              </Button>
            </>
          )}

          {pageNumber.map((pageNumber) => (
            <Button
              key={pageNumber}
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
                onClick={() => handleClickPageButton(pageInfo.nextPageNumber)}
              >
                다음
              </Button>
              <Button
                onClick={() => handleClickPageButton(pageInfo.lastPageNumber)}
              >
                맨끝
              </Button>
            </>
          )}
        </HStack>
      </Center>
    </VStack>
  );
}
