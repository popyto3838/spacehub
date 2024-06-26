import {Box, Button, Center, useToast, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../component/LoginProvider.jsx";
import axios from "axios";

export function MemberHost() {
  const [member, setMember] = useState({});

  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();


  useEffect(() => {
    if(account.id) {
      axios
        .get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {
          toast({
            status: "warning",
            description: "회원 정보 조회 중 문제가 발생하였습니다.",
            position: "top",
          });
          navigate("/");
        });
    }  }, [account]);







  return (
    <VStack spacing={0} align="stretch" minHeight="100vh">
      {/* 상단 부분 */}
      <Box flex="1" bg="white" p={4}>
        <Box> {member.nickname} 님 안녕하세요!</Box>
        <Box> 지금 바로 공간 설정을 마쳐보세요</Box>
      </Box>

      {/* 하단 부분 (배경 이미지 포함) */}
      <Box
        flex="1"
        backgroundImage="url('https://a0.muscache.com/im/pictures/miso/Hosting-31202365/original/702a8b4d-f58d-4b9f-a892-294c80c5daac.jpeg?im_w=1200')"
        backgroundSize="contain"
        backgroundPosition="center"
        p={4}
        height="100%" // 추가: 높이 100%
        width="100%" // 추가: 너비 100%
      >
        <Box bg="rgba(255, 255, 255, 0.8)" p={4} borderRadius="md">

          <Box mb={2}>
            <Center>여러분의 공간을 등록해보세요</Center>
          </Box>
          <Box>
            <Center>호스트센터를 이용하시려면 별도의 호스트 회원가입이 필요합니다</Center>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
}
