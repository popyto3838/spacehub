import { useEffect, useState } from "react";
import axios from "axios";
import { QnaCommentItem } from "./QnaCommentItem.jsx";
import { Box } from "@chakra-ui/react";

export function QnaCommentList({ spaceId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  // const [member, setMember] = useState({});
  // const account = useContext(LoginContext);

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/listQna/${spaceId}`)
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
        <QnaCommentItem
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          comment={comment}
          key={comment.commentId}
        />
      ))}
    </Box>
  );
}
