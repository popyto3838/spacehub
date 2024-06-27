import { Box } from "@chakra-ui/react";
import { QnaCommentWrite } from "./QnaCommentWrite.jsx";
import { QnaCommentList } from "./QnaCommentList.jsx";
import { useState } from "react";

export function QnaCommentComponent({ spaceId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box>
      <QnaCommentWrite
        spaceId={spaceId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <QnaCommentList
        spaceId={spaceId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Box>
  );
}
