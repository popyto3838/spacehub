import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import { useState } from "react";
import { Card, CardBody, VStack } from "@chakra-ui/react";

export function CommentComponent({ boardId, categoryId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <VStack spacing={4} align="stretch" w="full">
      <Card>
        <CardBody>
          <CommentWrite
            boardId={boardId}
            categoryId={categoryId}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <CommentList
            boardId={boardId}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </CardBody>
      </Card>
    </VStack>
  );
}
