import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function HostDashboard({ memberId }) {
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (memberId) {
      // API 호출하여 데이터 가져오기
      axios
        .get(`/api/host/spaces?memberId=${memberId}`)
        .then((response) => setSpaces(response.data))
        .catch((error) => console.error("Failed to fetch spaces:", error));

      axios
        .get(`/api/host/reservations?memberId=${memberId}`)
        .then((response) => setReservations(response.data))
        .catch((error) =>
          console.error("Failed to fetch reservations:", error),
        );

      axios
        .get(`/api/host/reviews?memberId=${memberId}`)
        .then((response) => setReviews(response.data))
        .catch((error) => console.error("Failed to fetch reviews:", error));

      axios
        .get(`/api/host/inquiries?memberId=${memberId}`)
        .then((response) => setInquiries(response.data))
        .catch((error) => console.error("Failed to fetch inquiries:", error));
    }
  }, [memberId]);

  const handleNavigateToHostSpaceList = () => {
    navigate(`/host/spaceList/${memberId}`);
  };

  const handleNavigateToReservations = () => {
    navigate(`/member/hostSpaceList/${memberId}`);
  };

  const handleNavigateToReviews = () => {
    navigate(`/member/reviews`);
  };

  const handleNavigateToInquiries = () => {
    navigate(`/member/inquiries/${memberId}`);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading>대시보드</Heading>
          <Button>설정</Button>
        </Flex>

        <Grid templateColumns="repeat(2, 1fr)" gap={10}>
          <GridItem>
            <Box p={5} shadow="md" borderWidth="1px">
              <Flex justify="space-between" align="center">
                <Heading fontSize="xl">등록 공간/리스트 관리</Heading>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="registered space list"
                  onClick={handleNavigateToHostSpaceList}
                />
              </Flex>
              <Divider my={4} />
              <VStack spacing={4} align="stretch">
                {spaces.slice(0, 3).map((space) => (
                  <Box key={space.id} p={4} shadow="sm" borderWidth="1px">
                    <Text fontWeight="bold">{space.name}</Text>
                    <Text>{space.description}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box p={5} shadow="md" borderWidth="1px">
              <Flex justify="space-between" align="center">
                <Heading fontSize="xl">예약 리스트</Heading>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="View all reservations"
                  onClick={handleNavigateToReservations}
                />
              </Flex>
              <Divider my={4} />
              <VStack spacing={4} align="stretch">
                {reservations.slice(0, 3).map((reservation) => (
                  <Box key={reservation.id} p={4} shadow="sm" borderWidth="1px">
                    <Text fontWeight="bold">
                      예약자: {reservation.guestName}
                    </Text>
                    <Text>예약 날짜: {reservation.date}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </GridItem>

          {/* 리뷰 코멘트 */}
          <GridItem>
            <Box p={5} shadow="md" borderWidth="1px">
              <Flex justify="space-between" align="center">
                <Heading fontSize="xl">리뷰/후기</Heading>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="View all reviews"
                  onClick={handleNavigateToReviews}
                />
              </Flex>
              <Divider my={4} />
              <VStack spacing={4} align="stretch">
                {reviews.slice(0, 3).map((review) => (
                  <Box key={review.id} p={4} shadow="sm" borderWidth="1px">
                    <Text fontWeight="bold">{review.guestName}</Text>
                    <Text>{review.content}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </GridItem>

          {/* qna 코멘트 */}
          <GridItem>
            <Box p={5} shadow="md" borderWidth="1px">
              <Flex justify="space-between" align="center">
                <Heading fontSize="xl">문의글</Heading>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="View all inquiries"
                  onClick={handleNavigateToInquiries}
                />
              </Flex>
              <Divider my={4} />
              <VStack spacing={4} align="stretch">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <Box key={inquiry.id} p={4} shadow="sm" borderWidth="1px">
                    <Text fontWeight="bold">{inquiry.guestName}</Text>
                    <Text>{inquiry.content}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
}

export default HostDashboard;
