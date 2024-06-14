import { useNavigate } from "react-router-dom";
import { Box, Center, Flex, Hide, Show, Spacer } from "@chakra-ui/react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faHouse,
  faPlus,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex
      px={{
        lg: 200,
        base: 0,
      }}
      gap={3}
      height={20}
      bgColor="gray.100"
    >
      <Center
        onClick={() => navigate("/")}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <Show below={"lg"}>
          <FontAwesomeIcon icon={faHouse} />
        </Show>
        <Hide below={"lg"}>HOME</Hide>
      </Center>
      <Center
        onClick={() => navigate("/reserve")}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <Box below={"lg"}>
          <FontAwesomeIcon icon={faCalendarDays} />
        </Box>
      </Center>
      <Center
        onClick={() => navigate("/space/register")}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <Box below={"lg"}>
          <FontAwesomeIcon icon={faPlus} />
        </Box>
      </Center>
      <Center
        onClick={()=> navigate(`/space/option`)}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        공간옵션등록
      </Center>
      <Spacer />
      <Center
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
        onClick={() => navigate("/member/info")}
      >
        <Flex gap={2}>
          <Box>
            <FontAwesomeIcon icon={faUser} />
          </Box>
          <Box></Box>
        </Flex>
      </Center>
      <Center
        onClick={() => navigate("/member/list")}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <FontAwesomeIcon icon={faUsers} />
      </Center>
      <Center
        onClick={() => navigate("/signup")}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </Center>
      <Center
        onClick={() => navigate("/login")}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <FontAwesomeIcon icon={faRightToBracket} />
      </Center>
      <Center
        onClick={() => {
          navigate("/logout");
        }}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.200",
        }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </Center>
    </Flex>
  );
}
