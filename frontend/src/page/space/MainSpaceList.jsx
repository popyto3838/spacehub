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
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SpaceCard from "./SpaceCard.jsx";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";
import { Icon } from "@chakra-ui/icons";

export function MainSpaceList() {
  const [visibleSpaces, setVisibleSpaces] = useState(12); // 초기 표시할 공간 수
  const [visibleTypes, setVisibleTypes] = useState(16); // 초기 표시할 공간 유형 수
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
    setVisibleSpaces((prevVisibleSpaces) => prevVisibleSpaces + 6);
  };

  const handleShowMoreTypes = () => {
    setVisibleTypes((prevVisibleTypes) => prevVisibleTypes + 16);
  };

  function handleCardClick(spaceId) {
    navigate(`/space/${spaceId}`);
  }

  const handleClickType = (typeId) => {
    setSelectedType((prevTypeId) => (prevTypeId === typeId ? null : typeId));
  };

  return (
    <Box bg="white" minHeight="100vh">
      <Container maxW="100%" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              공간 유형
            </Heading>
            <Grid
              templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
              gap={4}
              w="full"
            >
              {spaceTypes.slice(0, visibleTypes).map((type) => (
                <GridItem key={type.itemId}>
                  <MotionBox
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleClickType(type.itemId)}
                    cursor="pointer"
                    textAlign="center"
                  >
                    <Image
                      src={
                        type.iconFile?.fileName ||
                        "http://via.placeholder.com/100.jpg"
                      }
                      alt={type.name}
                      objectFit="cover"
                      w="50px"
                      h="50px"
                      mx="auto"
                      mb={2}
                    />
                    <Text fontSize="sm" fontWeight="medium">
                      {type.name}
                    </Text>
                  </MotionBox>
                </GridItem>
              ))}
            </Grid>
            {showMoreTypes && visibleTypes < spaceTypes.length && (
              <Flex justify="center" mt={4}>
                <Button
                  onClick={handleShowMoreTypes}
                  rightIcon={<Icon as={FaChevronRight} />}
                  variant="ghost"
                >
                  더 보기
                </Button>
              </Flex>
            )}
          </Box>

          <Divider />

          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h2" size="lg">
                공간 목록
              </Heading>
              <IconButton
                icon={<FaSearch />}
                aria-label="Search spaces"
                variant="ghost"
              />
            </Flex>
            <Grid
              templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
              gap={6}
            >
              {filteredSpaces
                .slice(0, visibleSpaces)
                .map(({ space, spaceImgFiles, averageRating }) => (
                  <GridItem key={space.spaceId}>
                    <MotionBox
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
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
                  rightIcon={<Icon as={FaChevronDown} />}
                  variant="outline"
                >
                  더 많은 공간 보기
                </Button>
              </Flex>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default MainSpaceList;
