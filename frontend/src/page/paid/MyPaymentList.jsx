import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
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
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

function MyPaymentList() {
  const member = useContext(LoginContext);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImpUid, setSelectedImpUid] = useState(null);
  const [paidId, setPaidId] = useState(null);

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const onPayCancel = (impUid, paidId) => {
    setSelectedImpUid(impUid);
    setPaidId(paidId);
    onOpen();
  };

  const handleRefund = async () => {
    try {
      const token = await getToken();
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
      // 결제 목록을 다시 불러오기
      const res = await axios.get(`/api/paid/list/${member.id}`);
      setPayments(res.data);
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
      return res.data;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 페이징 로직
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <Text>로딩 중...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color={textColor}>
          <FontAwesomeIcon
            icon={faCreditCard}
            style={{ marginRight: "10px" }}
          />
          나의 결제 내역
        </Heading>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="공간 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box bg={bgColor} shadow="md" borderRadius="lg" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr bg={useColorModeValue("gray.50", "gray.700")}>
              <Th>번호</Th>
              <Th>공간 이름</Th>
              <Th>총 금액</Th>
              <Th>결제 일시</Th>
              <Th>결제 상태</Th>
              <Th>환불</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentPayments.map((payment) => (
              <Tr key={payment.paidId}>
                <Td>{payment.paidId}</Td>
                <Td fontWeight="bold">{payment.title}</Td>
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
      </Box>

      {filteredPayments.length === 0 && (
        <Text mt={4} textAlign="center" color="gray.500">
          결제 내역이 없습니다.
        </Text>
      )}

      {/* 페이징 컨트롤 */}
      <Flex justifyContent="center" mt={4}>
        <HStack>
          {Array.from(
            { length: Math.ceil(filteredPayments.length / paymentsPerPage) },
            (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                colorScheme={currentPage === i + 1 ? "blue" : "gray"}
              >
                {i + 1}
              </Button>
            ),
          )}
        </HStack>
      </Flex>

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
    </Container>
  );
}

export default MyPaymentList;
