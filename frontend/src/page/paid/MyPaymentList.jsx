import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import "/public/css/paid/MyPaymentListArea.css";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

function MyPaymentList() {
  const member = useContext(LoginContext);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImpUid, setSelectedImpUid] = useState(null);
  const [paidId, setPaidId] = useState(null);

  useEffect(() => {
    if (member && member.id) {
      setIsLoading(true);
      axios
        .get(`/api/paid/list/${member.id}`)
        .then((res) => {
          console.log(res.data);
          setPayments(res.data);
        })
        .catch((err) => {
          console.error("Error fetching payment data:", err);
          setError("결제 내역을 불러오는 데 실패했습니다.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [member]);

  const onPayCancel = (impUid, paidId) => {
    alert(paidId);
    setSelectedImpUid(impUid);
    setPaidId(paidId);
    onOpen();
  };

  const handleRefund = async () => {
    try {
      const token = await getToken(); // getToken 함수가 토큰을 반환하게 합니다.
      await axios.post("/api/paid/cancelPayment", {
        token: token,
        impUid: selectedImpUid,
        amount: 100,
        paidId: paidId,
      });
      toast({
        status: "success",
        description: "환불이 완료되었습니다.",
        position: "top",
        duration: 1000,
      });
    } catch (err) {
      toast({
        status: "error",
        description: "환불을 실패하였습니다.",
        position: "top",
        duration: 1000,
      });
    } finally {
      onClose();
    }
  };

  const getToken = async () => {
    try {
      const res = await axios.post("/api/paid/getToken");
      return res.data; // 반환된 토큰을 반환합니다.
    } catch (error) {
      console.error("Error getting token:", error);
      throw error; // 오류가 발생하면 예외를 던집니다.
    }
  };

  if (isLoading) return <Text>로딩 중...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box maxW="80%" mx="auto" mt={8} p={4} className="myPaymentListArea">
      <Heading as="h1" mb={4} className="titleName">
        나의 결제 내역
      </Heading>
      {payments.length === 0 ? (
        <Text>결제 내역이 없습니다.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>번호</Th>
              <Th>공간 이름</Th>
              <Th>총 금액</Th>
              <Th>결제 일시</Th>
              <Th>결제 상태</Th>
              <Th>환불</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.paidId}>
                <Td>{payment.paidId}</Td>
                <Td>{payment.title}</Td>
                <Td>{payment.totalPrice.toLocaleString()} 원</Td>
                <Td>{new Date(payment.inputDt).toLocaleString()}</Td>
                <Td>
                  {payment.status === "COMP"
                    ? "결제완료"
                    : payment.status === "REFUND"
                      ? "환불완료"
                      : payment.status}
                </Td>
                <Td>
                  <Button
                    bg={payment.status === "REFUND" ? "gray.500" : "red.500"}
                    color="white"
                    _hover={
                      payment.status === "REFUND"
                        ? { bg: "gray.600" }
                        : { bg: "red.600" }
                    }
                    onClick={
                      payment.status !== "REFUND"
                        ? () => onPayCancel(payment.impUid, payment.paidId)
                        : undefined
                    }
                    disabled={payment.status === "REFUND"}
                    _disabled={{
                      bg: "gray.500",
                      cursor: "not-allowed",
                    }}
                  >
                    {payment.status === "REFUND" ? "환불완료" : "환불"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>환불 확인</ModalHeader>
          <ModalBody>정말로 이 결제를 환불하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleRefund}>
              환불
            </Button>
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MyPaymentList;
