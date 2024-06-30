import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import "/public/css/paid/MyPaymentListArea.css";

import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

function MyPaymentList() {
  const member = useContext(LoginContext);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

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

  const paymentCancelFunc = (param) => {
    console.log(param);
    axios
      .post("/payments/cancel", {
        imp_uid: param.impUid, // 결제 고유 번호
        reason: "취소 사유",
      })
      .then((res) => {
        toast({
          status: "success",
          description: "결제가 취소되었습니다.",
          position: "top",
          duration: 100,
        });
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "결제 취소에 실패하였습니다.",
          position: "top",
          duration: 100,
        });
      });
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
                  <Button onClick={() => paymentCancelFunc(payment.impUid)}>
                    환불
                  </Button>
                </Td>{" "}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}

export default MyPaymentList;
