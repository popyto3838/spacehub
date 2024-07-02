import { useEffect, useState } from "react";
import axios from "axios";
import { QnaCommentItem } from "./QnaCommentItem.jsx";
import { Box, Button, Center } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function QnaCommentList({ spaceId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  // 페이징
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listQna/${spaceId}?${searchParams}`)
        .then((res) => {
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
    searchParams.set("qnaPage", pageNumber);
    navigate(`/space/${spaceId}?${searchParams}`);
  }

  return (
    <Box>
      {commentList.map((comment) => (
        <QnaCommentItem
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          comment={comment}
          key={comment.commentId}
        />
      ))}

      {/* 페이징 */}
      {/* 페이징 작업 */}
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
