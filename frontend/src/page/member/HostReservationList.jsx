import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "/public/css/member/HostReservationList.css";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

function HostReservationList() {
  const { spaceId } = useParams();
  const [hostReservationList, setHostReservationList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    axios
      .get("/api/reservation/hostReservationList/" + spaceId)
      .then((res) => {
        console.log(res.data);
        setHostReservationList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [spaceId]);

  const handleStatusChange = (reservationId, newStatus) => {
    setHostReservationList((prevList) =>
      prevList.map((list) =>
        list.reservationId === reservationId
          ? { ...list, status: newStatus }
          : list,
      ),
    );
    axios
      .put("/api/reservation/updateStatus", {
        reservationId: reservationId,
        status: newStatus,
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

  const filteredReservations = hostReservationList.filter((reservation) =>
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
    <Box width="100%" maxW="1200px" mx="auto" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color={textColor}>
          <FontAwesomeIcon
            icon={faCalendarAlt}
            style={{ marginRight: "10px" }}
          />
          예약 목록
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

      <Box
        bg={bgColor}
        shadow="md"
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Table variant="simple">
          <Thead>
            <Tr bg={useColorModeValue("gray.50", "gray.700")}>
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
            {currentReservations.map((list) => (
              <Tr key={list.reservationId}>
                <Td>{list.reservationId}</Td>
                <Td>{list.title}</Td>
                <Td>{list.startDate}</Td>
                <Td>
                  {list.startTime} ~ {list.endTime}
                </Td>
                <Td>{list.totalPrice.toLocaleString()} 원</Td>
                <Td>
                  <Select
                    value={list.status}
                    disabled={list.status === "REFUND"}
                    onChange={(e) =>
                      handleStatusChange(list.reservationId, e.target.value)
                    }
                  >
                    <option value="APPLY">신청</option>
                    <option value="ACCEPT">수락</option>
                    <option value="CANCEL">취소</option>
                    <option value="COMPLETE_PAYMENT">결제완료</option>
                    {list.status === "REFUND" ? (
                      <option value="REFUND" disabled>
                        환불완료
                      </option>
                    ) : (
                      ""
                    )}
                  </Select>
                </Td>
                <Td>{list.nickname}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredReservations.length === 0 && (
        <Text mt={4} textAlign="center" color="gray.500">
          예약 내역이 없습니다.
        </Text>
      )}

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
    </Box>
  );
}

export default HostReservationList;
