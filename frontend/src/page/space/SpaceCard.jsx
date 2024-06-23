import React, { useState } from 'react';
import { Box, Image, Badge, Flex, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faComment, faThumbsUp, faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const SpaceCard = ({ space, file }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const thumbnailPath = file && file.fileName
    ? file.fileName
    : 'http://via.placeholder.com/1000.jpg';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Box
      maxW='sm'
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      height='450px'
      position='relative'
      onClick={() => console.log("Card clicked")}
    >
      <Image
        src={thumbnailPath}
        alt={space.title}
        objectFit="cover"
        width="100%"
        height="250px"
      />

      <Box
        position='absolute'
        top={2}
        right={2}
        zIndex={1}
        onClick={handleFavoriteClick}
        cursor="pointer"
        _hover={{ transform: "scale(1.2)" }}
        transition="transform 0.2s"
      >
        <FontAwesomeIcon
          icon={isFavorited ? solidHeart : regularHeart}
          color={isFavorited ? "red" : "white"}
          style={{
            stroke: "white",
            strokeWidth: isFavorited ? 0 : 2
          }}
          size="2x"
        />
      </Box>

      <Box p='6'>
        <Box display='flex' alignItems='baseline'>
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            New
          </Badge>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
            {space.type}
          </Box>
        </Box>

        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {space.title}
        </Box>

        <Box>
          ₩{space.price}
          <Box as='span' color='gray.600' fontSize='sm'>
            / 시간
          </Box>
        </Box>

        <Box display='flex' mt='2' alignItems='center'>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                color={i < space.rating ? 'teal.500' : 'gray.300'}
              />
            ))}
          <Box as='span' ml='2' color='gray.600' fontSize='sm'>
            {space.reviewCount} reviews
          </Box>
        </Box>

        <Flex mt='2' justify='space-between'>
          <Box display='flex' alignItems='center'>
            <FontAwesomeIcon icon={faComment} />
            <Text ml='1'>{space.reviewCount} 리뷰</Text>
          </Box>
          <Box display='flex' alignItems='center'>
            <FontAwesomeIcon icon={faThumbsUp} />
            <Text ml='1'>{space.likes} 좋아요</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default SpaceCard;
