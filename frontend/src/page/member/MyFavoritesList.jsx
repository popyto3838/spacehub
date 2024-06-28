import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import '/public/css/paid/MyPaymentListArea.css';

import {Table, Thead, Tbody, Tr, Th, Td, Box, Heading, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

function MyFavoritesList() {
    const member = useContext(LoginContext);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const mySpacePage = useNavigate();

    useEffect(() => {
        if (member && member.id) {
            setIsLoading(true);
            axios.get(`/api/favorites/myFavoritesList/${member.id}`)
                .then((res) => {
                    console.log(res.data);
                    setFavorites(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching favorites data:", err);
                    setError("즐겨찾기를 불러오는 데 실패했습니다.");
                })
                .finally(() => setIsLoading(false));
        }
    }, [member]);

    const mySpacePageFunc = (param) => {
        mySpacePage("/space/" + param);
    };

    if (isLoading) return <Text>로딩 중...</Text>;
    if (error) return <Text color="red.500">{error}</Text>;



    return (
        <Box maxW="80%" mx="auto" mt={8} p={4} className="myPaymentListArea">
            <Heading as="h1" mb={4} className="titleName">나의 즐겨찾기</Heading>
            {favorites.length === 0 ? (
                <Text>즐겨찾기 내역이 없습니다.</Text>
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>번호</Th>
                            <Th>공간 이름</Th>
                            <Th>시간당 금액</Th>
                            <Th>주소</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {favorites.map((favorit) => (
                            <Tr key={favorit.spaceId}>
                                <Td>{favorit.spaceId}</Td>
                                <Td
                                    onClick={() => {
                                        mySpacePageFunc(favorit.spaceId);
                                    }}
                                    _hover={{cursor: 'pointer', color: 'blue.500'}}
                                >{favorit.title}</Td>
                                <Td>{favorit.price.toLocaleString()} 원</Td>
                                <Td>{favorit.address}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
}

export default MyFavoritesList;