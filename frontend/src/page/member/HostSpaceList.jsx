import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import '/public/css/member/HostSpaceList.css';
import axios from "axios";
import {Box, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

function HostSpaceList() {
    const [hostSpaceList, sethostSpaceList] = useState([]);
    const {hostId} = useParams();
    const myPaymentPage = useNavigate();


    useEffect(() => {
        console.log("==========");
        console.log(hostId);
        console.log("==========");
        axios.get("/api/space/hostSpaceList/" + hostId)
            .then((res) => {
                console.log(res.data);
                sethostSpaceList(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [hostId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options).replace(/\.$/, '');
    };
    const myPaymentPageFunc = (param) => {
        myPaymentPage("/member/hostReservationList/" + param);
    };
    return (
        <div>
            <Box maxW="80%" mx="auto" mt={8} p={4} className="hostSpaceListArea">
                <Heading as="h2" size="lg" mb={4} className="hostSpaceListTitle">공간 목록</Heading>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>번호</Th>
                                <Th>공간 이름</Th>
                                <Th>주소</Th>
                                <Th>등록 일시</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {hostSpaceList.map((list) => (
                                <Tr key={list.spaceId}>
                                    <Td>{list.spaceId}</Td>
                                    <Td
                                        onClick={() => { myPaymentPageFunc(list.spaceId); }}
                                        _hover={{ cursor: 'pointer', color: 'blue.500' }}
                                    >
                                        {list.title}
                                    </Td>
                                    <Td>{list.address}</Td>
                                    <Td>{formatDate(list.inputDt)}</Td>

                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}

export default HostSpaceList;