import { Box, Card, CardBody, Container, VStack } from "@chakra-ui/react";
import { QnaCommentWrite } from "./QnaCommentWrite.jsx";
import { QnaCommentList } from "./QnaCommentList.jsx";
import { useState } from "react";

export function QnaCommentComponent({ spaceId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box bg="gray.100" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <Card w="full">
            <CardBody>
              <QnaCommentWrite
                spaceId={spaceId}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </CardBody>
          </Card>
          <Card w="full">
            <CardBody>
              <QnaCommentList
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
