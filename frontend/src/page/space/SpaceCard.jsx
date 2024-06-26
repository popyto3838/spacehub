import React, {useState} from 'react';
import {Badge, Box, Flex, Heading, Image, Text} from '@chakra-ui/react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as solidHeart, faStar} from "@fortawesome/free-solid-svg-icons";
import {faHeart as regularHeart} from "@fortawesome/free-regular-svg-icons";

const SpaceCard = ({ space, thumbnailPath }) => {
  const [isFavorited, setIsFavorited] = useState(false);

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
      height='500px'
      position='relative'
      onClick={() => console.log("Card clicked")}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '2xl'
      }}
    >
      <Image
        src={thumbnailPath || 'http://via.placeholder.com/1000.jpg'}
        alt={space.title}
        objectFit="cover"
        width="100%"
        height="300px"
        transition="opacity 0.3s"
        _hover={{ opacity: 0.9 }}
      />
      <Box
        position='absolute'
        top={4}
        right={4}
        zIndex={1}
        onClick={handleFavoriteClick}
        cursor="pointer"
        transition="transform 0.2s"
        _hover={{ transform: "scale(1.2)" }}
      >
        <Box
          width="40px"
          height="40px"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.6)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FontAwesomeIcon
            icon={isFavorited ? solidHeart : regularHeart}
            color={isFavorited ? "red" : "gray.600"}
            style={{
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
              stroke: 'white',
              strokeWidth: 2,
              paintOrder: 'stroke fill'
            }}
            size="lg"
          />
        </Box>
      </Box>

      <Box mt='4' p='6' bg="white" height="calc(100% - 200px)">
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            New
          </Badge>
          <Text color='gray.500' fontSize='sm'>{space.type}</Text>
        </Flex>

        <Heading as='h3' size='md' mb={2} color="gray.700">{space.title}</Heading>

        <Text fontWeight="bold" fontSize="xl" color="teal.600" mb={2}>
          ₩{space.price}<Text as='span' color='gray.500' fontSize='sm'> / 시간</Text>
        </Text>

        <Flex alignItems='center' mb={3}>
          {Array(5).fill('').map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              color={i < space.rating ? '#FFC107' : 'gray.300'}
            />
          ))}
          <Text ml='2' color='gray.600' fontSize='sm'>
            {space.reviewCount} reviews
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default SpaceCard;
