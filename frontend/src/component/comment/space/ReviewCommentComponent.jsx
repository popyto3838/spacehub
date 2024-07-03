import { Box, Card, CardBody, Container, VStack } from "@chakra-ui/react";
import { ReviewCommentWrite } from "./ReviewCommentWrite.jsx";
import { ReviewCommentList } from "./ReviewCommentList.jsx";
import { useState } from "react";

export function ReviewCommentComponent({ spaceId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box bg="gray.100" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Card w="full">
            <CardBody>
              <ReviewCommentWrite
                spaceId={spaceId}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </CardBody>
          </Card>
          <Card w="full">
            <CardBody>
              <ReviewCommentList
                spaceId={spaceId}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
