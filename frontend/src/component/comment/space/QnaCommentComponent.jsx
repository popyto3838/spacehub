import { Box } from "@chakra-ui/react";
import { QnaCommentWrite } from "./QnaCommentWrite.jsx";
import { QnaCommentList } from "./QnaCommentList.jsx";

export function QnaCommentComponent({ spaceId }) {
  return (
    <Box>
      <QnaCommentWrite />
      <QnaCommentList />
    </Box>
  );
}
