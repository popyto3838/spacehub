import React from 'react';
import {Card, CardBody, CardFooter, CardHeader, Flex, Heading, Image, Text} from '@chakra-ui/react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faStar, faThumbsUp} from "@fortawesome/free-solid-svg-icons";

const SpaceCard = ({space, file}) => {
  const thumbnailPath = file && file.fileName
    ? file.fileName
    : 'http://via.placeholder.com/1000.jpg';

  return (
    <Card maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <CardHeader>
        <Flex justify='space-between' align='center'>
          <Heading size='md'>{space.title}</Heading>
          <FontAwesomeIcon icon={faHeart}/>
          <Text>{space.type}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Image
          src={thumbnailPath}
          alt={space.title}
          boxSize="200px"
          objectFit="contain"
        />
      </CardBody>
      <CardFooter>
        <Flex align='center' mt='2'>
          <FontAwesomeIcon icon={faStar}/>
          <Text ml='1'>별점</Text>
        </Flex>
        <Text mt='2'>₩{space.price} / 시간</Text>
        <Flex mt='2' justify='space-between'>
          <FontAwesomeIcon icon={faComment}/>
          리뷰
          <FontAwesomeIcon icon={faThumbsUp}/>
          좋아요
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default SpaceCard;
