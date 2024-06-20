import React, {useEffect, useState} from 'react';
import {Box, Flex, Grid, GridItem, Heading, Icon, Image, Text} from "@chakra-ui/react";
import '../../../frontend/public/css/MainPage.css';
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faStar} from "@fortawesome/free-solid-svg-icons";

export function MainPage() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    // space와 file 정보를 가져오는 API 호출
    axios.get('/api/space/list')
      .then(response => {
        setSpaces(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching spaces:', error);
      });
  }, []);

  return (
    <>
      <Box>
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']} gap={4}>
          {spaces.map(space => (
            <GridItem key={space.spaceId}>
              <Box borderWidth={1} borderRadius="lg" overflow="hidden">
                <Image src={space.imageUrl} alt={space.title} />
                <Box p={4}>
                  <Text fontWeight="bold" fontSize="xl" mb={2}>
                    {space.title}
                  </Text>
                  <Text fontSize="md" color="gray.600" mb={2}>
                    {space.subTitle}
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Icon as={FaStar} color="teal.500" mr={1} />
                    <Text fontSize="sm" color="gray.600">
                      {space.rating} ({space.reviewCount})
                    </Text>
                  </Box>
                  <Text fontSize="md" color="teal.600" mt={2}>
                    {space.price} / 시간
                  </Text>
                </Box>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
}
