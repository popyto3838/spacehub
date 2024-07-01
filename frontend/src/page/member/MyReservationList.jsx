import React, { useEffect, useState } from "react";
import "/public/css/member/MyReservationList.css";
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PaymentBtn from "../paid/PaymentBtn.jsx";

function MyReservationList() {
  const { memberId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const myPaymentPage = useNavigate();

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    axios
      .get("/api/reservation/list/" + memberId)
      .then((res) => {
        console.log(res.data);
        setReservations(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [memberId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusMessage = (status) => {
    switch (status) {
      case "APPLY":
        return "신청";
      case "ACCEPT":
        return "수락";
      case "CANCEL":
        return "취소";
      case "COMPLETE_PAYMENT":
        return "결제완료";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString)
      .toLocaleDateString("ko-KR", options)
      .replace(/\.$/, "");
  };

  const filteredReservations = reservations.filter((reservation) =>
    reservation.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 페이징 로직
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color={textColor}>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            style={{ marginRight: "10px" }}
          />
          예약 리스트
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
              <Th>예약 일시</Th>
              <Th>이용 시간</Th>
              <Th>가격</Th>
              <Th>예약 상태</Th>
              <Th>결제</Th>
              <Th>예약 일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentReservations.map((reservation) => (
              <Tr key={reservation.reservationId}>
                <Td>{reservation.reservationId}</Td>
                <Td fontWeight="bold">{reservation.title}</Td>
                <Td>{reservation.startDate}</Td>
                <Td>{`${reservation.startTime} ~ ${reservation.endTime}`}</Td>
                <Td>₩{reservation.totalPrice.toLocaleString()}</Td>
                <Td>{getStatusMessage(reservation.status)}</Td>
                <Td>
                  <PaymentBtn reservationId={reservation.reservationId} />
                </Td>
                <Td>{formatDate(reservation.inputDt)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredReservations.length === 0 && (
        <Text mt={4} textAlign="center" color="gray.500">
          예약된 내역이 없습니다.
        </Text>
      )}

      {/* 페이징 컨트롤 */}
      <Flex justifyContent="center" mt={4}>
        <HStack>
          {Array.from(
            {
              length: Math.ceil(
                filteredReservations.length / reservationsPerPage,
              ),
            },
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
    </Container>
  );
}

export default MyReservationList;
