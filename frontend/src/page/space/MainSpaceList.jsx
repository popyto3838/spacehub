import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SpaceCard from "./SpaceCard.jsx";
import { motion } from "framer-motion";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

export function MainSpaceList() {
  const [visibleSpaces, setVisibleSpaces] = useState(10); // 초기 표시할 공간 수
  const [visibleTypes, setVisibleTypes] = useState(10); // 초기 표시할 공간 유형 수
  const [showMoreSpaces, setShowMoreSpaces] = useState(false);
  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // 선택된 타입 ID 상태
  const [allSpaces, setAllSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]); // 필터링된 공간 데이터를 저장할 상태 추가

  const navigate = useNavigate();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("teal.500", "teal.300");

  const MotionBox = motion(Box);

  useEffect(() => {
    axios
      .get("/api/space/type/list")
      .then((response) => {
        setSpaceTypes(response.data);
        if (response.data.length > visibleTypes) {
          setShowMoreTypes(true);
        }
      })
      .catch((error) => {
        console.error("공간 유형 정보를 불러오는데 실패하였습니다:", error);
      });

    axios
      .get("/api/space/list")
      .then((response) => {
        setAllSpaces(response.data);
        setFilteredSpaces(response.data); // 초기에는 모든 공간 데이터를 표시
        if (response.data.length > visibleSpaces) {
          setShowMoreSpaces(true);
        }
      })
      .catch((error) => {
        console.error("공간 데이터를 불러오는데 실패하였습니다:", error);
      });
  }, [visibleSpaces, visibleTypes]);

  useEffect(() => {
    // selectedType 변경 시 필터링
    if (selectedType) {
      const filtered = allSpaces.filter(
        (space) => space.space.typeListId === selectedType,
      );
      setFilteredSpaces(filtered);
    } else {
      setFilteredSpaces(allSpaces);
    }
  }, [selectedType, allSpaces]);

  const handleShowMoreSpaces = () => {
    setVisibleSpaces((prevVisibleSpaces) => prevVisibleSpaces + 10);
  };

  const handleShowMoreTypes = () => {
    setVisibleTypes((prevVisibleTypes) => prevVisibleTypes + 10);
  };

  function handleCardClick(spaceId) {
    navigate(`/space/${spaceId}`);
  }

  const handleClickType = (typeId) => {
    setSelectedType((prevTypeId) => (prevTypeId === typeId ? null : typeId));
  };

  return (
    <>
      <Box bg={bgColor} minHeight="100vh">
        <Container maxW="80%" py={20}>
          <VStack spacing={20} align="stretch">
            <Box textAlign="center">
              <Heading
                as="h1"
                size="3xl"
                mb={6}
                color={accentColor}
                fontWeight="bold"
                letterSpacing="tight"
              >
                찾는 공간이 있나요?
              </Heading>
              <Text fontSize="xl" color={textColor} fontWeight="medium">
                다양한 공간을 살펴보고 원하는 공간을 찾아보세요.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="xl" mb={8} color={textColor}>
                공간 유형
              </Heading>
              <Grid
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={8}
                w="full"
              >
                {spaceTypes.slice(0, visibleTypes).map((type) => (
                  <GridItem key={type.itemId}>
                    <MotionBox
                      whileHover={{ y: -5, boxShadow: "xl" }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleClickType(type.itemId)}
                      cursor="pointer"
                      bg={
                        selectedType === type.itemId ? accentColor : cardBgColor
                      }
                      color={selectedType === type.itemId ? "white" : textColor}
                      borderRadius="xl"
                      boxShadow="md"
                      p={6}
                      textAlign="center"
                      height="100%"
                    >
                      <VStack spacing={4}>
                        <Box
                          w={24}
                          h={24}
                          bg="gray.100"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          overflow="hidden"
                        >
                          <Image
                            src={
                              type.iconFile?.fileName ||
                              "http://via.placeholder.com/1000.jpg"
                            }
                            alt={type.name}
                            objectFit="cover"
                            w="full"
                            h="full"
                          />
                        </Box>
                        <Text fontWeight="bold" fontSize="lg">
                          {type.name}
                        </Text>
                      </VStack>
                    </MotionBox>
                  </GridItem>
                ))}
              </Grid>

              {showMoreTypes && visibleTypes < spaceTypes.length && (
                <Flex justify="center" mt={8}>
                  <Button
                    onClick={handleShowMoreTypes}
                    colorScheme="teal"
                    size="lg"
                    fontWeight="bold"
                    leftIcon={<Icon as={FaChevronDown} />}
                  >
                    더 많은 유형 보기
                  </Button>
                </Flex>
              )}
            </Box>

            <Box>
              <Flex justify="space-between" align="center" mb={8}>
                <Heading as="h2" size="xl" color={textColor}>
                  공간 목록
                </Heading>
                <Icon as={FaSearch} boxSize={6} color={accentColor} />
              </Flex>
              <Grid
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={8}
              >
                {filteredSpaces
                  .slice(0, visibleSpaces)
                  .map(({ space, spaceImgFiles, averageRating }) => (
                    <GridItem key={space.spaceId}>
                      <MotionBox
                        whileHover={{ y: -5, boxShadow: "2xl" }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleCardClick(space.spaceId)}
                      >
                        <SpaceCard
                          space={{ ...space, averageRating }}
                          thumbnailPath={
                            spaceImgFiles && spaceImgFiles.length > 0
                              ? spaceImgFiles[0].fileName
                              : null
                          }
                        />
                      </MotionBox>
                    </GridItem>
                  ))}
              </Grid>

              {showMoreSpaces && visibleSpaces < allSpaces.length && (
                <Flex justify="center" mt={8}>
                  <Button
                    onClick={handleShowMoreSpaces}
                    colorScheme="teal"
                    size="lg"
                    fontWeight="bold"
                    leftIcon={<Icon as={FaChevronDown} />}
                  >
                    더 많은 공간 보기
                  </Button>
                </Flex>
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}

export default MainSpaceList;
