import { Box, Divider, VStack } from "@chakra-ui/react";
import { ReviewCommentWrite } from "./ReviewCommentWrite.jsx";
import { ReviewCommentList } from "./ReviewCommentList.jsx";
import { useState } from "react";

export function ReviewCommentComponent({ spaceId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box bg="white" py={8} borderRadius="lg" boxShadow="md">
      <VStack spacing={8} align="stretch" px={8}>
        <Divider />
        <Box>
          <ReviewCommentWrite
            spaceId={spaceId}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </Box>
        <Divider />
        <Box>
          <ReviewCommentList
            spaceId={spaceId}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </Box>
      </VStack>
    </Box>
  );
}
