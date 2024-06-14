import { Box, Flex } from "@chakra-ui/react";
import { Navbar } from "../component/Navbar.jsx";
import { Outlet } from "react-router-dom";

export function Home() {
  return (
    <Flex direction={{ base: "column", lg: "row" }}>
      <Box flex="1" p={4}>
        <Navbar />
        <Box
          mx={{
            base: 0,
            lg: 200,
          }}
          mt={10}
        >
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
