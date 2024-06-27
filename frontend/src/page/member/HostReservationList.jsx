import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import '/public/css/member/HostReservationList.css';
import axios from "axios";
import {Box, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Select, useToast} from "@chakra-ui/react";

function HostReservationList() {
    const {spaceId} = useParams();
    const [hostReservationList, setHostReservationList] = useState([]);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("/api/reservation/hostReservationList/" + spaceId)
            .then((res) => {
                console.log(res.data);
                setHostReservationList(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [spaceId]);

    const handleStatusChange = (reservationId, newStatus) => {
        setHostReservationList(prevList =>
            prevList.map(list =>
                list.reservationId === reservationId ? {...list, status: newStatus} : list
            )
        );
        axios.put("/api/reservation/updateStatus", {
            reservationId: reservationId,
            status: newStatus
        })
            .then((res) => {

                toast({
                    status: "success",
                    description: "예약자의 예약 현황을 변경하였습니다.",
                    position: "top",
                    duration: 1000,
                });
                setTimeout(() => {
                    navigate(0);
                }, 1000);
            })
            .catch((err) => {
                toast({
                    status: "error",
                    description: "예약자의 예약 현황 변경에 실패하였습니다.",
                    position: "top",
                    duration: 1000,
                });
            })
            .finally(setIsLoading(false));
    };

    return (
        <div>
            <Box maxW="80%" mx="auto" mt={8} p={4} className="hostReservationListArea">
                <Heading as="h2" size="lg" mb={4} className="hostReservationListTitle">예약 목록</Heading>
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
                                <Th>예약자</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {hostReservationList.map((list) => (
                                <Tr key={list.reservationId}>
                                    <Td>{list.reservationId}</Td>
                                    <Td>{list.title}</Td>
                                    <Td>{list.startDate}</Td>
                                    <Td>{list.startTime} ~ {list.endTime}</Td>
                                    <Td>{list.totalPrice}</Td>
                                    <Td>
                                        <Select
                                            value={list.status}
                                            onChange={(e) => handleStatusChange(list.reservationId, e.target.value)}
                                        >
                                            <option value="APPLY">신청</option>
                                            <option value="ACCEPT">수락</option>
                                            <option value="CANCEL">취소</option>
                                            <option value="COMPLETE_PAYMENT">결제완료</option>
                                        </Select>
                                    </Td>
                                    <Td>{list.nickname}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}

export default HostReservationList;
