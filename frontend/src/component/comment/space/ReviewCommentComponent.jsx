import { Box } from "@chakra-ui/react";
import { ReviewCommentWrite } from "./ReviewCommentWrite.jsx";
import { ReviewCommentList } from "./ReviewCommentList.jsx";
import { useState } from "react";

export function ReviewCommentComponent({ spaceId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box>
      <ReviewCommentWrite
        spaceId={spaceId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <ReviewCommentList
        spaceId={spaceId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Box>
  );
}
