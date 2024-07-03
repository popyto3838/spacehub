import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "react-scroll";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "../../component/DatePicker.jsx";
import KakaoMap from "../../component/KakaoMap.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faCog,
  faComments,
  faExclamationCircle,
  faHeart,
  faHome,
  faQuestionCircle,
  faShare,
  faStar,
  faStarHalfAlt,
  faWonSign,
} from "@fortawesome/free-solid-svg-icons";
import "/public/css/space/SpaceView.css";
import KakaoShareButton from "./KakaoShareButton.jsx";
import ReportModal from "../../component/ReportModal.jsx";
import { QnaCommentComponent } from "../../component/comment/space/QnaCommentComponent.jsx";
import { ReviewCommentComponent } from "../../component/comment/space/ReviewCommentComponent.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";

function SpaceView() {
  const [space, setSpace] = useState({});
  const [spaceDetails, setSpaceDetails] = useState({});
  const [spaceImages, setSpaceImages] = useState([]);
  const [optionImages, setOptionImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startThumbnailIndex, setStartThumbnailIndex] = useState(0);
  const [thumbnailCount, setThumbnailCount] = useState(5);
  const [activeSection, setActiveSection] = useState("공간소개");
  const member = useContext(LoginContext);

  const { spaceId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [isFavorited, setIsFavorited] = useState(false);

  const sections = [
    { id: "introduceArea", name: "공간소개", icon: faHome },
    { id: "facilityArea", name: "시설안내", icon: faCog },
    { id: "noticeArea", name: "유의사항", icon: faExclamationCircle },
    { id: "QA", name: "Q&A", icon: faQuestionCircle },
    { id: "comment", name: "이용후기", icon: faComments },
  ];

  useEffect(() => {
    axios
      .get("/api/favorites/get", {
        params: {
          memberId: member.id,
          spaceId: spaceId,
        },
      })
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          console.log("데이터가 있습니다");
          setIsFavorited(true);
        } else {
          console.log("데이터가 없습니다");
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/api/space/${spaceId}`)
      .then((res) => {
        const data = res.data;
        setSpace(data);
        setSpaceDetails(data.space);
        if (data.spaceImgFiles && Array.isArray(data.spaceImgFiles)) {
          const fileNames = data.spaceImgFiles.map((file) => file.fileName);
          setSpaceImages(fileNames);
        }
        if (data.optionList && Array.isArray(data.optionList)) {
          setOptionImages(data.optionList);
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
      const containerWidth = document.getElementById(
        "thumbnail-container",
      ).offsetWidth;
      const thumbnailWidth = 70; // 썸네일 이미지 너비
      const newThumbnailCount = Math.floor(containerWidth / thumbnailWidth);
      setThumbnailCount(newThumbnailCount);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [spaceId, toast, navigate]);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? spaceImages.length - 1 : prevIndex - 1,
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === spaceImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPreviousThumbnails = () => {
    setStartThumbnailIndex((prevIndex) =>
      Math.max(0, prevIndex - thumbnailCount),
    );
  };

  const goToNextThumbnails = () => {
    setStartThumbnailIndex((prevIndex) =>
      Math.min(spaceImages.length - thumbnailCount, prevIndex + thumbnailCount),
    );
  };

  const clickFavorite = () => {
    if (isFavorited === false) {
      axios
        .post("/api/favorites/insert", {
          spaceId: spaceId,
          memberId: member.id,
        })
        .then((res) => {
          toast({
            status: "success",
            description: "좋아요가 등록되었습니다.",
            position: "top",
            duration: 1000,
          });
          setIsFavorited(true);
        })
        .catch((err) => {
          toast({
            status: "error",
            description: "게시물이 작성되지 않았습니다.",
            position: "top",
            duration: 1000,
          });
        })
        .finally(setIsLoading(false));
    } else {
      axios
        .delete("/api/favorites/delete", {
          params: {
            memberId: member.id,
            spaceId: spaceId,
          },
        })
        .then((res) => {
          toast({
            status: "success",
            description: "좋아요가 취소되었습니다.",
            position: "top",
            duration: 1000,
          });
          setIsFavorited(false);
        })
        .catch((err) => {
          toast({
            status: "error",
            description: "좋아요가 취소되지 않았습니다.",
            position: "top",
            duration: 1000,
          });
        })
        .finally(setIsLoading(false));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} color="#FFD700" />);
      } else if (rating >= i - 0.5) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStarHalfAlt} color="#FFD700" />,
        );
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} color="gray.300" />);
      }
    }
    return stars;
  };

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Container maxW="100%" py={20}>
        <VStack spacing={12} align="stretch">
          <Box>
            <Heading
              as="h1"
              size="2xl"
              color="gray.800"
              mb={4}
              fontWeight="bold"
            >
              {spaceDetails.title}
            </Heading>
            <HStack justify="space-between" align="center">
              <Text fontSize="xl" color="gray.600">
                {spaceDetails.subTitle}
              </Text>
              <HStack>
                <KakaoShareButton
                  spaceDetails={spaceDetails}
                  templateId={109470}
                >
                  <Button
                    leftIcon={<FontAwesomeIcon icon={faShare} />}
                    variant="outline"
                    colorScheme="gray"
                  >
                    공유
                  </Button>
                </KakaoShareButton>
                <Button
                  leftIcon={<FontAwesomeIcon icon={faBullhorn} />}
                  variant="outline"
                  colorScheme="gray"
                  onClick={onOpen}
                >
                  신고
                </Button>
                <Button
                  leftIcon={<FontAwesomeIcon icon={faHeart} />}
                  variant="outline"
                  colorScheme={isFavorited ? "red" : "none"}
                  onClick={clickFavorite}
                >
                  즐겨찾기
                </Button>
                <ReportModal
                  isOpen={isOpen}
                  onClose={onClose}
                  spaceId={spaceId}
                />
              </HStack>
            </HStack>
          </Box>

          <Flex direction={{ base: "column", lg: "row" }} gap={12}>
            <Box flex={3}>
              {" "}
              <Box
                position="relative"
                mb={8}
                className="image-slider"
                overflow="hidden"
                width="100%"
                paddingTop="56.25%" // 16:9 비율
              >
                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  transition="transform 0.3s ease-in-out"
                  transform={`translateX(-${currentImageIndex * 100}%)`}
                >
                  {spaceImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Space image ${index + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      flexShrink={0}
                    />
                  ))}
                </Flex>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={goToPreviousImage}
                  bg="white"
                  size="lg"
                />
                <IconButton
                  icon={<ChevronRightIcon />}
                  position="absolute"
                  right={4}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={goToNextImage}
                  bg="white"
                  size="lg"
                />
              </Box>
              <Flex align="center" mb={12} id="thumbnail-container">
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={goToPreviousThumbnails}
                  isDisabled={startThumbnailIndex === 0}
                />
                <Flex overflow="hidden" className="thumbnail-wrapper">
                  {spaceImages
                    .slice(
                      startThumbnailIndex,
                      startThumbnailIndex + thumbnailCount,
                    )
                    .map((img, index) => (
                      <Image
                        key={startThumbnailIndex + index}
                        src={img}
                        alt={`Space image ${startThumbnailIndex + index + 1}`}
                        cursor="pointer"
                        onClick={() =>
                          setCurrentImageIndex(startThumbnailIndex + index)
                        }
                        border={
                          startThumbnailIndex + index === currentImageIndex
                            ? "2px solid"
                            : "none"
                        }
                        borderColor={
                          startThumbnailIndex + index === currentImageIndex
                            ? "red.400"
                            : "transparent"
                        }
                        boxSize="80px"
                        objectFit="cover"
                        m={1}
                        opacity={
                          startThumbnailIndex + index === currentImageIndex
                            ? 1
                            : 0.6
                        }
                        transition="opacity 0.2s"
                        _hover={{ opacity: 1 }}
                      />
                    ))}
                </Flex>
                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={goToNextThumbnails}
                  isDisabled={
                    startThumbnailIndex >= spaceImages.length - thumbnailCount
                  }
                />
              </Flex>
              <HStack justify="center" spacing={6} mb={12}>
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
                      colorScheme={
                        activeSection === section.name ? "red" : "gray"
                      }
                      onClick={() => setActiveSection(section.name)}
                      leftIcon={<FontAwesomeIcon icon={section.icon} />}
                      fontSize="lg"
                    >
                      {section.name}
                    </Button>
                  </Link>
                ))}
              </HStack>
              <VStack spacing={16} align="stretch">
                <Box id="introduceArea" p={8} bg="gray.50" borderRadius="lg">
                  <Heading as="h2" size="xl" mb={6} color="gray.700">
                    공간소개
                  </Heading>
                  <div
                    className="quill-content"
                    dangerouslySetInnerHTML={{ __html: spaceDetails.introduce }}
                  ></div>
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    gap={8}
                    textAlign="center"
                  >
                    <Box>
                      <Image
                        src="/public/img/층수.png"
                        boxSize="80px"
                        mx="auto"
                        mb={4}
                      />
                      <Text fontSize="lg" fontWeight="bold">
                        층수
                      </Text>
                      <Text fontSize="xl">{spaceDetails.floor}</Text>
                    </Box>
                    <Box>
                      <Image
                        src="/public/img/인원.png"
                        boxSize="80px"
                        mx="auto"
                        mb={4}
                      />
                      <Text fontSize="lg" fontWeight="bold">
                        수용 인원
                      </Text>
                      <Text fontSize="xl">{spaceDetails.capacity}</Text>
                    </Box>
                    <Box>
                      <Image
                        src="/public/img/자동차.png"
                        boxSize="80px"
                        mx="auto"
                        mb={4}
                      />
                      <Text fontSize="lg" fontWeight="bold">
                        주차 공간
                      </Text>
                      <Text fontSize="xl">{spaceDetails.parkingSpace}</Text>
                    </Box>
                  </Grid>
                </Box>
                <Divider />
                <Box id="facilityArea" p={8}>
                  <Heading as="h2" size="xl" mb={6} color="gray.700">
                    시설안내
                  </Heading>
                  <div
                    className="quill-content"
                    dangerouslySetInnerHTML={{ __html: spaceDetails.facility }}
                  ></div>
                  <Heading as="h3" size="lg" mb={6} mt={6} color="gray.600">
                    제공 편의시설
                  </Heading>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
                    gap={6}
                    mb={12}
                  >
                    {optionImages.map((option) => (
                      <Box key={option.optionListId} textAlign="center">
                        <Image
                          src={option.fileName}
                          alt={option.name}
                          boxSize="60px"
                          mx="auto"
                          mb={2}
                        />
                        <Text fontSize="md">{option.name}</Text>
                      </Box>
                    ))}
                  </Grid>
                  <Heading as="h3" size="lg" mb={6} color="gray.600">
                    지도 안내
                  </Heading>
                  <Box height="400px" mb={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={6}>
                      주소: {spaceDetails.address} {spaceDetails.detailAddress}
                    </Text>
                    <KakaoMap
                      address={spaceDetails.address}
                      latitude={spaceDetails.latitude}
                      longitude={spaceDetails.longitude}
                    />
                  </Box>
                </Box>
                <Divider />
                <Box id="noticeArea" p={8} bg="gray.50" borderRadius="lg">
                  <Heading as="h2" size="xl" mb={6} color="gray.700">
                    유의사항
                  </Heading>
                  <div
                    className="quill-content"
                    dangerouslySetInnerHTML={{ __html: spaceDetails.notice }}
                  ></div>
                </Box>
                <Divider />
                <Box id="QA" p={8}>
                  <Heading as="h2" size="xl" mb={6} color="gray.700">
                    Q&A
                  </Heading>
                  {spaceDetails.spaceId && (
                    <QnaCommentComponent spaceId={spaceDetails.spaceId} />
                  )}
                </Box>
                <Divider />
                <Box id="comment" p={8} bg="gray.50" borderRadius="lg">
                  <Heading as="h2" size="xl" mb={6} color="gray.700">
                    이용후기
                  </Heading>
                  {spaceDetails.spaceId && (
                    <ReviewCommentComponent spaceId={spaceDetails.spaceId} />
                  )}
                </Box>
              </VStack>
            </Box>

            <Box flex={1}>
              <Box
                position="sticky"
                top="100px"
                p={8}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
              >
                <VStack spacing={8} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="xl" color="gray.800">
                      <FontAwesomeIcon icon={faWonSign} /> {spaceDetails.price}{" "}
                      / 시간
                    </Heading>
                    <HStack>
                      <Box>{renderStars(space.averageRating)}</Box>
                      <Text fontWeight="bold" fontSize="xl">
                        {space.averageRating?.toFixed(2) || "0.00"}
                      </Text>
                    </HStack>
                  </HStack>
                  <DatePicker price={spaceDetails.price} spaceId={spaceId} />
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
