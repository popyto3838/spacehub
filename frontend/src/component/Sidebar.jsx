import {Box, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";

export function Sidebar() {
  return (
    <Box as="aside" w={{ base: "full", lg: 60 }} bg="gray.100" p={4}>
      <VStack align="stretch" spacing={4}>
        <Link to="/">
          <Text fontWeight="bold">Home</Text>
        </Link>
        <Link to="/reserve">
          <Text fontWeight="bold">Reserve</Text>
        </Link>
        {/* 다른 메뉴 항목 추가 */}
      </VStack>
    </Box>
  );
}