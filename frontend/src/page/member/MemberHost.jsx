import {Box, Button, Center} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export function MemberHost() {
  const navigate = useNavigate();
  return (

    <Box>
      <Center>
        <Button
          onClick={() => navigate(`/member/host/signup`)}
          colorScheme={"purple"} >호스트 회원가입 하러 가기</Button>
      </Center>
      <Box>
      <Center>여러분의 공간을 등록해보세요</Center>
      </Box>
      <Box>
        <Center>호스트센터를 이용하시려면 별도의 호스트 회원가입이 필요합니다</Center>
      </Box>
    </Box>
  );
}