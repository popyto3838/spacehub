import { Box, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex>
      <Box
        cursor={"pointer"}
        _hover={{ bgColor: "blue.200" }}
        onClick={() => navigate("/")}
      >
        홈
      </Box>
      <Spacer />
      <Box
        cursor={"pointer"}
        _hover={{ bgColor: "blue.200" }}
        onClick={() => navigate("/board/list")}
        mr={5}
      >
        리스트
      </Box>
      <Spacer />
      <Box
        cursor={"pointer"}
        _hover={{ bgColor: "blue.200" }}
        onClick={() => navigate("/board/write")}
        mr={5}
      >
        글쓰기
      </Box>
      <Box mr={5}>로그인</Box>
    </Flex>
  );
}
