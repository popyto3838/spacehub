// CommentList.jsx
import { Box, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  const fetchComments = () => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => {
          const commentsWithReplies = res.data.map((comment) =>
            axios
              .get(`/api/commentRe/listAll/${comment.commentId}`)
              .then((replyRes) => ({
                ...comment,
                replies: replyRes.data,
              })),
          );

          Promise.all(commentsWithReplies).then((updatedComments) => {
            setCommentList(updatedComments);
          });
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [isProcessing, boardId]);

  const addReply = (commentId, newReply) => {
    setCommentList((prevList) =>
      prevList.map((comment) =>
        comment.commentId === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment,
      ),
    );
  };

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }

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
            targetId={comment.memberId}
            addReply={addReply}
          />
        ))}
      </VStack>
    </Box>
  );
}
