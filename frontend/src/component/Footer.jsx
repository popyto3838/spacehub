import { Box, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box as="footer" bg="gray.800" color="white" p={4}>
      <Text textAlign="center">Copyright &copy; Spacehub</Text>
    </Box>
  );
}