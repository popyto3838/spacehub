import React, {useEffect, useState} from 'react';
import {Box, Grid, GridItem, Text, VStack} from "@chakra-ui/react";
import '../../../frontend/public/css/MainPage.css';
import axios from "axios";
import SpaceCard from "./space/SpaceCard.jsx";
import {useNavigate} from "react-router-dom";

export function MainPage() {
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [spaces, setSpaces] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // type_list 정보를 가져오는 API 호출
    axios.get('/api/space/type/list')
      .then(response => {
        setSpaceTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching space types:', error);
      });

    // space 정보를 가져오는 API 호출
    axios.get('/api/space/list')
      .then(response => {
        setSpaces(response.data);
      })
      .catch(error => {
        console.error('Error fetching spaces:', error);
      });
  }, []);

  function handleCardClick(spaceId) {
    console.log(spaceId)
    navigate(`/space/${spaceId}`)
  }

  return (
    <>
      <Box py={5}>
        <Text fontSize="2xl" fontWeight="bold">찾는 공간이 있나요?</Text>
        <Grid templateColumns="repeat(5, 1fr)" gap={6} mt={4}>
          {spaceTypes.map(type => (
            <GridItem key={type.id} w="100%" textAlign="center">
              <VStack
                cursor="pointer"
                _hover={{color: 'blue'}}
              >
                <Box
                  w={10}
                  h={10}
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{bg: 'gray.300'}}
                >
                {/*  icon 이미지 위치*/}
                </Box>
                <Text _hover={{color: 'teal.500'}}>{type.name}</Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </Box>
      <Box py={5}>
        <Text fontSize="2xl" fontWeight="bold">공간 목록</Text>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} mt={4}>
          {spaces.map(space => (
            <GridItem cursor="pointer" key={space.id} onClick={() => {
              handleCardClick(space.spaceId)
            }}>
              <SpaceCard space={space}/>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default MainPage;
