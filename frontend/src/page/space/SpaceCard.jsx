import React from 'react';
import {Box, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Image, Text} from '@chakra-ui/react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faStar, faThumbsUp} from "@fortawesome/free-solid-svg-icons";

const SpaceCard = ({space, file}) => {
  const thumbnailPath = file && file.fileName
    ? file.fileName
    : 'http://via.placeholder.com/1000.jpg';

  return (
    <Card maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' position='relative' height='350px'>
      <Box position='absolute' top={2} right={2} zIndex={1}>
        <FontAwesomeIcon icon={faHeart} />
      </Box>
      <CardBody p={0}>
        <Image
          src={thumbnailPath}
          alt={space.title}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </CardBody>
      <CardFooter p={2} height="20%">
        <Flex direction='column' align='start'>
          <Heading size='md'>{space.title}</Heading>
          <Text>{space.type}</Text>
          <Flex align='center' mt='2'>
            <FontAwesomeIcon icon={faStar} />
            <Text ml='1'>별점</Text>
          </Flex>
          <Text mt='2'>₩{space.price} / 시간</Text>
          <Flex mt='2' justify='space-between'>
            <FontAwesomeIcon icon={faComment} />
            리뷰
            <FontAwesomeIcon icon={faThumbsUp} />
            좋아요
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default SpaceCard;
