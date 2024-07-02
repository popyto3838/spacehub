import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SpaceCard = ({ space, thumbnailPath }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const member = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/favorites/get", {
        params: {
          memberId: member.id,
          spaceId: space.spaceId,
        },
      })
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          setIsFavorited(true);
        } else {
        }
      });
  }, []);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  const clickFavorite = () => {
    if (isFavorited === false) {
      axios
        .post("/api/favorites/insert", {
          spaceId: space.spaceId,
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
          navigate("/");
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
            spaceId: space.spaceId,
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
          navigate("/");
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
        stars.push(<FontAwesomeIcon key={i} icon={faStar} color="#FFC107" />);
      } else if (rating >= i - 0.5) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStarHalfAlt} color="#FFC107" />,
        );
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} color="gray.300" />);
      }
    }
    return stars;
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      height="500px"
      position="relative"
      onClick={() => navigate(`/space/${space.spaceId}`)}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "2xl",
      }}
      bg="white"
    >
      <Image
        src={thumbnailPath || "http://via.placeholder.com/1000.jpg"}
        alt={space.title}
        objectFit="cover"
        width="100%"
        height="300px"
        transition="opacity 0.3s"
        _hover={{ opacity: 0.9 }}
      />
      <Box
        position="absolute"
        top={4}
        right={4}
        zIndex={1}
        onClick={(e) => {
          e.stopPropagation();
          clickFavorite();
        }}
        cursor="pointer"
        transition="transform 0.2s"
        _hover={{ transform: "scale(1.2)" }}
      >
        <Box
          width="40px"
          height="40px"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.8)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxShadow="md"
        >
          <FontAwesomeIcon
            icon={isFavorited ? solidHeart : regularHeart}
            color={isFavorited ? "red" : "gray.600"}
            style={{
              filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
              stroke: "white",
              strokeWidth: 2,
              paintOrder: "stroke fill",
            }}
            size="lg"
          />
        </Box>
      </Box>

      <VStack p={6} spacing={3} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Text color="gray.500" fontSize="sm">
            {space.type}
          </Text>
        </Flex>

        <Heading as="h3" size="md" color="gray.700" noOfLines={2}>
          {space.title}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color="teal.600">
          ₩{space.price.toLocaleString()}
          <Text as="span" color="gray.500" fontSize="sm">
            {" "}
            / 시간
          </Text>
        </Text>

        <Flex alignItems="center">
          {renderStars(space.averageRating)}
          <Text ml="2" color="gray.600" fontSize="sm">
            {space.averageRating
              ? space.averageRating.toFixed(2)
              : "No ratings yet"}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default SpaceCard;
