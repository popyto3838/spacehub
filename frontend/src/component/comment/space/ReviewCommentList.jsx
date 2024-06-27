import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewCommentItem } from "./ReviewCommentItem.jsx";

export function ReviewCommentList({ spaceId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listReview/${spaceId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, [isProcessing]);

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
    </Box>
  );
}
