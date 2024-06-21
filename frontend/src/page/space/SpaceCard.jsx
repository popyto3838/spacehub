import React from 'react';
import { Card, CardBody, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const SpaceCard = ({ space, file }) => {
  const thumbnailPath = file
    ? `/resources/images/${file.division}/${file.parentId}/${file.fileName}`
    : '/default/image/path';

  return (
    <Card maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Image src={thumbnailPath} alt={space.title} />

      <CardBody>
        <Flex justify='space-between' align='center'>
          <Heading size='md'>{space.title}</Heading>
          <FontAwesomeIcon icon={faHeart} />
        </Flex>
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
      </CardBody>
    </Card>
  );
};

export default SpaceCard;
