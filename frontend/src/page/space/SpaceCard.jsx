import React from 'react';
import {Card, CardBody, Flex, Heading, Image, Text} from '@chakra-ui/react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faStar, faThumbsUp} from "@fortawesome/free-solid-svg-icons";

const SpaceCard = ({ space }) => {
  return (
    <Card maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Image src='/resources/images/SPACE/14/fcdd82e4-1d3c-444a-a3a0-4f4222c7fcbc.jpeg' alt={space.name} />

      <CardBody>
        <Flex justify='space-between' align='center'>
          <Heading size='md'>{space.name}</Heading>
          <FontAwesomeIcon icon={faHeart}/>
        </Flex>
        <Text>{space.type}</Text>
        <Flex align='center' mt='2'>
          <FontAwesomeIcon icon={faStar}/>
          <Text ml='1'>별점</Text>
        </Flex>
        <Text mt='2'>₩{space.price} / 시간</Text>
        <Flex mt='2' justify='space-between'>
          <FontAwesomeIcon icon={faComment}/>
            {/*{space.reviewCount}*/}
            리뷰
          <FontAwesomeIcon icon={faThumbsUp}/>
            {/*{space.likeCount}*/}
            좋아요
        </Flex>
      </CardBody>
    </Card>
  );
};

export default SpaceCard;
