import { Box, Flex, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function CommentList({ boardId, isSending, setIsSending }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isSending) {
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => console.log(err))
        .finally();
    }
  }, [isSending]);

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }

  /* 댓글을 하나 작성하지않으면 댓글들이 안나오는 오류 수정 */
  return (
    <Box>
      전체 댓글 (숫자 나오게)개
      {commentList.map((comment) => (
        <Box key={comment.commentId} border={"1px solid black"}>
          <Flex>
            <Box>{comment.nickname}</Box>
            <Spacer />
            <Box>{comment.inputDt}</Box>
          </Flex>
          <Box>{comment.content}</Box>
        </Box>
      ))}
    </Box>
  );
}
