import {
  Box,
  Card,
  CardBody,
  Container,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { QnaCommentWrite } from "./QnaCommentWrite.jsx";
import { QnaCommentList } from "./QnaCommentList.jsx";
import { useState } from "react";

export function QnaCommentComponent({ spaceId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box bg="white" py={8} borderRadius="lg" boxShadow="md">
      <VStack spacing={8} align="stretch" px={8}>
        <Divider />
        <Box>
          <QnaCommentWrite
            spaceId={spaceId}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </Box>
        <Divider />
        <Box>
          <QnaCommentList
            spaceId={spaceId}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </Box>
      </VStack>
    </Box>
  );
}
