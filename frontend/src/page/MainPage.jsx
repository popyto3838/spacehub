import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Text, Button, VStack } from "@chakra-ui/react";
import axios from "axios";
import SpaceCard from "./space/SpaceCard.jsx";
import { useNavigate } from "react-router-dom";

export function MainPage() {
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [files, setFiles] = useState([]);
  const [visibleSpaces, setVisibleSpaces] = useState(10); // 초기 표시할 공간 수
  const [visibleTypes, setVisibleTypes] = useState(10); // 초기 표시할 공간 유형 수
  const [showMoreSpaces, setShowMoreSpaces] = useState(false);
  const [showMoreTypes, setShowMoreTypes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/space/type/list')
      .then(response => {
        setSpaceTypes(response.data);
        if (response.data.length > visibleTypes) {
          setShowMoreTypes(true);
        }
      })
      .catch(error => {
        console.error('공간 유형을 불러오는데 실패하였습니다:', error);
      });

    axios.get('/api/space/list')
      .then(response => {
        setSpaces(response.data);
        if (response.data.length > visibleSpaces) {
          setShowMoreSpaces(true);
        }
      })
      .catch(error => {
        console.error('공간을 불러오는데 실패하였습니다:', error);
      });

    axios.get('/api/file/space/list')
      .then(response => {
        setFiles(response.data);
      })
      .catch(error => {
        console.error('파일을 불러오는데 실패하였습니다:', error);
      });
  }, [visibleSpaces, visibleTypes]);

  const handleShowMoreSpaces = () => {
    setVisibleSpaces(prevVisibleSpaces => prevVisibleSpaces + 10);
  };

  const handleShowMoreTypes = () => {
    setVisibleTypes(prevVisibleTypes => prevVisibleTypes + 10);
  };

  function handleCardClick(spaceId) {
    navigate(`/space/${spaceId}`);
  }

  return (
    <>
      <Box py={5}>
        <Text fontSize="2xl" fontWeight="bold">찾는 공간이 있나요?</Text>
        <Grid templateColumns="repeat(5, 1fr)" gap={6} mt={4}>
          {spaceTypes.slice(0, visibleTypes).map(type => (
            <GridItem key={type.id} w="100%" textAlign="center">
              <VStack
                cursor="pointer"
                _hover={{ color: 'blue' }}
              >
                <Box
                  w={10}
                  h={10}
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{ bg: 'gray.300' }}
                >
                  {/* icon 이미지 위치 */}
                </Box>
                <Text _hover={{ color: 'teal.500' }}>{type.name}</Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>
        {showMoreTypes && visibleTypes < spaceTypes.length && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Button onClick={handleShowMoreTypes}>더보기</Button>
          </Box>
        )}
      </Box>
      <Box py={5}>
        <Text fontSize="2xl" fontWeight="bold">공간 목록</Text>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} mt={4}>
          {spaces.slice(0, visibleSpaces).map(space => {
            const file = files.find(f => f.parentId === space.spaceId && f.division === 'SPACE');
            return (
              <GridItem
                cursor="pointer"
                key={space.spaceId}
                onClick={() => { handleCardClick(space.spaceId) }}
              >
                <SpaceCard space={space} file={file} />
              </GridItem>
            );
          })}
        </Grid>
        {showMoreSpaces && visibleSpaces < spaces.length && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Button onClick={handleShowMoreSpaces}>더보기</Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MainPage;
