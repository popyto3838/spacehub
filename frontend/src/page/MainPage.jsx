import React, {useEffect, useState} from 'react';
import {Box, Flex, Grid, GridItem, Heading, Icon, Image, Text} from "@chakra-ui/react";
import '../../../frontend/public/css/MainPage.css';
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faStar} from "@fortawesome/free-solid-svg-icons";

export function MainPage() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await axios.get('/api/spaces');
        const spacesData = response.data;

        // Fetching file list for each space
        const spacesWithImages = await Promise.all(
          spacesData.map(async (space) => {
            const fileResponse = await axios.get(`/api/fileList/${space.spaceId}`);
            const files = fileResponse.data;
            return { ...space, files };
          })
        );

        setSpaces(spacesWithImages);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    }

    fetchSpaces();
  }, []);

  return (
    <>
      <Box className="mainPageArea">
        {/* Categories */}
        <Box className="typeListArea">
          <Box>카테고리 리스트</Box>
          <Box></Box>
        </Box>

        {/* Spaces */}
        <Box className="spaceListArea">
          <Box>공간 카드 리스트</Box>
          <Box className="spaceListArea" py={5} px={2}>
            <Heading size="md" mb={4}>새로 등록되었어요</Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
              {spaces.map((space) => (
                <GridItem key={space.spaceId} border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                  <Box position="relative">
                    <Image src={`/uploads/${space.files[0]?.fileName}`} alt={space.title} />
                    <FontAwesomeIcon icon={faHeart} position="absolute" top={2} right={2} color="white" bg="rgba(0, 0, 0, 0.5)" borderRadius="full" p={1} />
                  </Box>
                  <Box p={4}>
                    <Heading size="sm" noOfLines={1}>{space.title}</Heading>
                    <Text noOfLines={1}>{space.address}</Text>
                    <Text fontSize="sm" color="gray.500">6월 30일 ~ 7월 5일</Text>
                    <Text fontWeight="bold">{space.price}원/시간</Text>
                    <Flex align="center" mt={2}>
                      <FontAwesomeIcon icon={faStar} color="yellow.500" mr={1} />
                      <Text>{space.rating}</Text>
                      <Text ml={2} fontSize="sm" color="gray.500">({space.reviews} reviews)</Text>
                    </Flex>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
