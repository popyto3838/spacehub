import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Textarea,
  VStack,
  useToast
} from "@chakra-ui/react";

function ReportModal({ isOpen, onClose, spaceId }) {
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    // 여기에 신고 제출 로직을 구현합니다.
    console.log("Report submitted for space:", spaceId, { reason: reportReason, details: reportDetails });
    toast({
      title: "신고가 접수되었습니다.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    setReportReason("");
    setReportDetails("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>공간 신고하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Select
              placeholder="신고 사유를 선택해주세요"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="inappropriate_content">부적절한 컨텐츠</option>
              <option value="false_information">허위 정보</option>
              <option value="spam">스팸</option>
              <option value="other">기타</option>
            </Select>
            <Textarea
              placeholder="자세한 신고 사유를 입력해주세요"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            제출
          </Button>
          <Button variant="ghost" onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReportModal;