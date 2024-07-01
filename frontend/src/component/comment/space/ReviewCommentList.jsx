import { Box, Button, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewCommentItem } from "./ReviewCommentItem.jsx";

export function ReviewCommentList({ spaceId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);
  // 페이징
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listReview/${spaceId}`)
        .then((res) => {
          // res.data가 객체인지 확인하고 comments 배열을 추출
          const comments = res.data.comments;
          setCommentList(comments);
          setPageInfo(res.data.pageInfo);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [isProcessing]);

  const pageNumber = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumber.push(i);
  }

  return (
    <Box>
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
        {pageInfo.prevPageNumber && (
          <Box>
            <Button onClick={() => handleClickPageButton(1)}>처음</Button>
            <Button
              onClick={() => handleClickPageButton(pageInfo.prevPageNumber)}
            >
              이전
            </Button>
          </Box>
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
          <Box>
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
          </Box>
        )}
      </Center>
    </Box>
  );
}
