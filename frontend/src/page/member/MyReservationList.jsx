import React, { useEffect, useState } from 'react';
import '/public/css/member/MyReservationList.css';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Heading } from '@chakra-ui/react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function MyReservationList() {
    const { memberId } = useParams();
    const [reservationList, setReservationList] = useState([]);
    const myPaymentPage = useNavigate();

    useEffect(() => {
        axios.get("/api/reservation/list/" + memberId)
            .then((res) => {
                console.log(res.data);
                setReservationList(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [memberId]);

    const myPaymentPageFunc = (param) => {
        myPaymentPage("/paid/payment/" + param);
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'APPLY':
                return '신청';
            case 'ACCEPT':
                return '수락';
            case 'CANCEL':
                return '취소';
            case 'COMPLETE_PAYMENT':
                return '결제완료';
            default:
                return status;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options).replace(/\.$/, '');
    };

    return (
        <div>
            <Box maxW="80%" mx="auto" mt={8} p={4} className="reservationListArea">
                <Heading as="h2" size="lg" mb={4} className="reservationListTitle">예약 리스트</Heading>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>번호</Th>
                                <Th>공간 이름</Th>
                                <Th>예약 일시</Th>
                                <Th>이용 시간</Th>
                                <Th>가격</Th>
                                <Th>예약 상태</Th>
                                <Th>예약 일시</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reservationList.map((list) => (
                                <Tr key={list.reservationId}>
                                    <Td>{list.reservationId}</Td>
                                    <Td
                                        onClick={() => { myPaymentPageFunc(list.reservationId); }}
                                        _hover={{ cursor: 'pointer', color: 'blue.500' }}
                                    >
                                        {list.title}
                                    </Td>
                                    <Td>{list.startDate}</Td>
                                    <Td>{list.startTime} ~ {list.endTime}</Td>
                                    <Td>{list.totalPrice}</Td>
                                    <Td>{getStatusMessage(list.status)}</Td>
                                    <Td>{formatDate(list.inputDt)}</Td> {/* 날짜 형식 변환 */}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}

export default MyReservationList;
