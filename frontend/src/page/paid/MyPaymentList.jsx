import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import '/public/css/paid/MyPaymentListArea.css';

import { Table, Thead, Tbody, Tr, Th, Td, Box, Heading, Text } from "@chakra-ui/react";

function MyPaymentList() {
    const member = useContext(LoginContext);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (member && member.id) {
            setIsLoading(true);
            axios.get(`/api/paid/list/${member.id}`)
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

    if (isLoading) return <Text>로딩 중...</Text>;
    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <Box maxW="80%" mx="auto" mt={8} p={4} className="myPaymentListArea">
            <Heading as="h1" mb={4} className="titleName">나의 결제 내역</Heading>
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
                        </Tr>
                    </Thead>
                    <Tbody>
                        {payments.map((payment) => (
                            <Tr key={payment.paidId}>
                                <Td>{payment.paidId}</Td>
                                <Td >{payment.title}</Td>
                                <Td>{payment.totalPrice.toLocaleString()} 원</Td>
                                <Td>{new Date(payment.inputDt).toLocaleString()}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
}

export default MyPaymentList;