import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  VStack,
  Text,
  Image,
  Flex,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';

const categories = [
  { name: '모임', icon: 'https://via.placeholder.com/50' },
  { name: '연습실', icon: 'https://via.placeholder.com/50' },
  { name: '촬영', icon: 'https://via.placeholder.com/50' },
  { name: '행사', icon: 'https://via.placeholder.com/50' },
  { name: '워크샵', icon: 'https://via.placeholder.com/50' },
  // 추가 카테고리
];

const spaces = [
  {
    title: '힙한 카페',
    location: '서울특별시 강남구',
    price: '₩50,000/시간',
    image: 'https://via.placeholder.com/400',
    rating: 4.5,
    reviews: 20,
  },
  {
    title: '스튜디오 렌탈',
    location: '서울특별시 마포구',
    price: '₩30,000/시간',
    image: 'https://via.placeholder.com/400',
    rating: 4.8,
    reviews: 15,
  },
  // 추가 공간
];
export function MainPage() {
  return (
    <>
      <Box p={4}>
        {/* Header */}
        <Flex as="header" justifyContent="space-between" alignItems="center" p={4} borderBottom="1px" borderColor="gray.200">
          <Heading size="lg" color="orange.500">Spacehub</Heading>
          <Button variant="link">뒤로가기</Button>
        </Flex>

        {/* Categories */}
        <VStack spacing={4} align="stretch" mt={4}>
          <Heading size="md">찾는 공간이 있나요?</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={4}>
            {categories.map((category, index) => (
              <GridItem key={index} textAlign="center">
                <Image src={category.icon} alt={category.name} mx="auto" mb={2} />
                <Text>{category.name}</Text>
              </GridItem>
            ))}
          </Grid>
        </VStack>

        {/* Spaces */}
        <VStack spacing={4} align="stretch" mt={8}>
          <Heading size="md">새로 등록되었어요</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
            {spaces.map((space, index) => (
              <GridItem key={index} border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                <Image src={space.image} alt={space.title} />
                <Box p={4}>
                  <Heading size="sm">{space.title}</Heading>
                  <Text>{space.location}</Text>
                  <Text fontWeight="bold">{space.price}</Text>
                  <Flex align="center" mt={2}>
                    <Text>Rating: {space.rating}</Text>
                    <Text ml={2}>({space.reviews} reviews)</Text>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>

        {/* More Spaces */}
        <VStack spacing={4} align="stretch" mt={8}>
          <Heading size="md">방금 올라온 이용후기</Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
            {spaces.map((space, index) => (
              <GridItem key={index} border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
                <Image src={space.image} alt={space.title} />
                <Box p={4}>
                  <Heading size="sm">{space.title}</Heading>
                  <Text>{space.location}</Text>
                  <Text fontWeight="bold">{space.price}</Text>
                  <Flex align="center" mt={2}>
                    <Text>Rating: {space.rating}</Text>
                    <Text ml={2}>({space.reviews} reviews)</Text>
                  </Flex>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>

        {/* Footer */}
        <Box as="footer" mt={8} p={4} borderTop="1px" borderColor="gray.200">
          <Text textAlign="center">© 2024 Spacehub. All rights reserved.</Text>
        </Box>
      </Box>
    </>
  );
}
