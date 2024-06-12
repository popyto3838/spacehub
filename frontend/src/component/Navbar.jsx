import { Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <Flex>
        <Center
          onClick={() => navigate("member/signup")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.200",
          }}
          p={6}
          fontSize={20}
          fontWeight={600}
        >
          <div>가입하기</div>
        </Center>
        <Center
          onClick={() => navigate("member/list")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.200",
          }}
          p={6}
          fontSize={20}
          fontWeight={600}
        >
          <div>회원목록</div>
        </Center>
        <Center
          onClick={() => navigate("member/login")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.200",
          }}
          p={6}
          fontSize={20}
          fontWeight={600}
        >
          <div>로그인</div>
        </Center>
      </Flex>
    </>
  );
}
