import React, { useEffect, useState } from 'react';
import {
  Box, Container, Heading, Text, Flex, VStack, HStack, Divider, Button,
  useColorModeValue, Image, IconButton
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-scroll';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import DatePicker from "../../component/DatePicker.jsx";
import KakaoMap from "../../component/KakaoMap.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faCog, faExclamationCircle, faQuestionCircle,
  faComments, faStar, faHeart, faShare, faMapMarkedAlt
} from '@fortawesome/free-solid-svg-icons';
import '/public/css/space/SpaceView.css';

function SpaceView() {
  const [space, setSpace] = useState({});
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startThumbnailIndex, setStartThumbnailIndex] = useState(0);
  const [thumbnailCount, setThumbnailCount] = useState(5);
  const { spaceId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('공간소개');

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const sections = [
    { id: 'introduceArea', name: '공간소개', icon: faHome },
    { id: 'facilityArea', name: '시설안내', icon: faCog },
    { id: 'noticeArea', name: '유의사항', icon: faExclamationCircle },
    { id: 'QA', name: 'Q&A', icon: faQuestionCircle },
    { id: 'comment', name: '이용후기', icon: faComments }
  ];

  useEffect(() => {
    axios.get(`/api/space/${spaceId}`)
      .then((res) => {
        setSpace(res.data);
        if (res.data.file && Array.isArray(res.data.file)) {
          const fileNames = res.data.file.map(file => file.fileName);
          setImages(fileNames);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast({
            status: "error",
            description: "잘못된 페이지 요청입니다.",
            position: "top",
          });
          navigate("/");
        }
      });

    const handleResize = () => {
      const containerWidth = document.getElementById('thumbnail-container').offsetWidth;
      const thumbnailWidth = 70; // 썸네일 이미지 너비
      const newThumbnailCount = Math.floor(containerWidth / thumbnailWidth);
      setThumbnailCount(newThumbnailCount);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [spaceId, toast, navigate]);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousThumbnails = () => {
    setStartThumbnailIndex((prevIndex) =>
      Math.max(0, prevIndex - thumbnailCount)
    );
  };

  const goToNextThumbnails = () => {
    setStartThumbnailIndex((prevIndex) =>
      Math.min(images.length - thumbnailCount, prevIndex + thumbnailCount)
    );
  };

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Container maxW="full" py={10} px={4}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="2xl" color="red.400" mb={2}>{space.title}</Heading>
            <HStack justify="space-between" align="center">
              <Text fontSize="xl" color="gray.500">{space.subTitle}</Text>
              <HStack>
                <Button leftIcon={<FontAwesomeIcon icon={faShare} />} variant="outline">공유하기</Button>
                <Button leftIcon={<FontAwesomeIcon icon={faHeart} />} variant="outline">저장</Button>
              </HStack>
            </HStack>
          </Box>

          <Flex direction={{ base: "column", lg: "row" }} gap={8}>
            <Box flex={2}>
              <Box position="relative" mb={4} className="image-slider">
                <Image src={images[currentImageIndex]} alt="Selected Space Image" w="100%" h="auto" className="fade-image"/>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={goToPreviousImage}
                />
                <IconButton
                  icon={<ChevronRightIcon />}
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={goToNextImage}
                />
              </Box>
              <Flex align="center" mb={8} id="thumbnail-container">
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={goToPreviousThumbnails}
                  isDisabled={startThumbnailIndex === 0}
                />
                <Flex overflow="hidden" className="thumbnail-wrapper">
                  {images.slice(startThumbnailIndex, startThumbnailIndex + thumbnailCount).map((img, index) => (
                    <Image
                      key={startThumbnailIndex + index}
                      src={img}
                      alt={`Space image ${startThumbnailIndex + index + 1}`}
                      cursor="pointer"
                      onClick={() => setCurrentImageIndex(startThumbnailIndex + index)}
                      border={startThumbnailIndex + index === currentImageIndex ? "2px solid" : "none"}
                      borderColor={startThumbnailIndex + index === currentImageIndex ? "yellow.400" : "transparent"}
                      boxSize="70px"
                      objectFit="cover"
                      m={1}
                      style={{ filter: startThumbnailIndex + index === currentImageIndex ? 'none' : 'blur(1px)' }}
                    />
                  ))}
                </Flex>
                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={goToNextThumbnails}
                  isDisabled={startThumbnailIndex >= images.length - thumbnailCount}
                />
              </Flex>

              <HStack justify="center" spacing={4} mb={8}>
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    to={section.id}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                  >
                    <Button
                      variant="ghost"
                      colorScheme={activeSection === section.name ? "red" : "gray"}
                      onClick={() => setActiveSection(section.name)}
                      leftIcon={<FontAwesomeIcon icon={section.icon} />}
                    >
                      {section.name}
                    </Button>
                  </Link>
                ))}
              </HStack>

              <VStack spacing={12} align="stretch">
                <Box id="introduceArea">
                  <Heading as="h2" size="xl" mb={4}>공간소개</Heading>
                  <Text fontSize="lg">{space.introduce}</Text>
                  <Flex justifyContent="space-around" textAlign="center">
                    <Box m={4}>
                      <Image src="/img/층수.png" boxSize="60px" mx="auto" mb={2} />
                      <Text>층수</Text>
                      <Box>{space.floor}</Box>
                    </Box>
                    <Box m={4}>
                      <Image src="/img/인원.png" boxSize="60px" mx="auto" mb={2} />
                      <Text>수용 인원</Text>
                      <Box>{space.capacity}</Box>
                    </Box>
                    <Box m={4}>
                      <Image src="/img/자동차.png" boxSize="60px" mx="auto" mb={2} />
                      <Text>주차 공간</Text>
                      <Box>{space.parkingSpace}</Box>
                    </Box>
                  </Flex>
                </Box>
                <Divider />
                <Box id="facilityArea">
                  <Heading as="h2" size="xl" mb={4}>시설안내</Heading>
                  <Text fontSize="lg" mb={4}>{space.facility}</Text>
                  <Text fontSize="md" fontWeight="bold" mb={4}>주소: {space.address} {space.detailAddress}</Text>

                  <Heading as="h3" size="lg" mb={4}>
                    <FontAwesomeIcon icon={faMapMarkedAlt} /> 지도 안내
                  </Heading>
                  <Box height="400px" mb={4}>
                    <KakaoMap address={space.address} latitude={space.latitude} longitude={space.longitude} />
                  </Box>
                </Box>
                <Divider />
                <Box id="noticeArea">
                  <Heading as="h2" size="xl" mb={4}>유의사항</Heading>
                  <Text fontSize="lg">{space.notice}</Text>
                </Box>
                <Divider />
                <Box id="QA">
                  <Heading as="h2" size="xl" mb={4}>Q&A</Heading>
                  {/* Q&A 내용 */}
                </Box>
                <Divider />
                <Box id="comment">
                  <Heading as="h2" size="xl" mb={4}>이용후기</Heading>
                  {/* 이용후기 내용 */}
                </Box>
              </VStack>
            </Box>

            <Box flex={1}>
              <Box
                position="sticky"
                top="100px"
                p={6}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="md"
              >
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="lg" color="red.400">￦{space.price} / 시간</Heading>
                    <HStack>
                      <FontAwesomeIcon icon={faStar} color="#FFD700" />
                      <Text fontWeight="bold">4.9</Text>
                    </HStack>
                  </HStack>
                  <DatePicker price={space.price} spaceId={spaceId} />
                  <Button colorScheme="red" size="lg" width="100%">예약하기</Button>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}

export default SpaceView;
