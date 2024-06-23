import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    // todo: if의 boardId랑 dependency의 boardId 넣은거 질문하기(예전에 boardId를 넣으면 안된다고 배웠었던걸로)
    if (boardId && !isProcessing) {
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    }
  }, [boardId, isProcessing]);

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }

  /* 댓글을 하나 작성하지않으면 댓글들이 안나오는 오류 수정 */
  return (
    <Box>
      전체 댓글 (숫자 나오게)개
      {commentList.map((comment) => (
        <CommentItem
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          comment={comment}
          key={comment.commentId}
        />
      ))}
    </Box>
  );
}
