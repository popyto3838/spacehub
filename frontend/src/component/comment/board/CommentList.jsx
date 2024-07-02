import { Box, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    }
  }, [isProcessing]);

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }

  /* 댓글을 하나 작성하지않으면 댓글들이 안나오는 오류 수정 */
  return (
    <Box>
      <Heading size="md" mb={4}>
        전체 댓글 ({commentList.length})개
      </Heading>
      <VStack spacing={4} align="stretch">
        {commentList.map((comment) => (
          <CommentItem
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            comment={comment}
            key={comment.commentId}
          />
        ))}
      </VStack>
    </Box>
  );
}
