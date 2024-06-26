import {Box, Text, Center, useToast, VStack, Button} from "@chakra-ui/react";
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
    <VStack spacing={0} align="stretch" minHeight="90vh" marginBottom="10">
      {/* 상단 부분 */}
      <Box flex="0.5" bg="white" p={4}>
        <Box>
          <Text fontSize="3xl" fontFamily="heading">
            {member.nickname} 님 안녕하세요!
          </Text>
        </Box>
        <Box mt={5} fontSize="xl"> 지금 바로 공간 설정을 마쳐보세요</Box>
        <Button
          mt={6}
          colorScheme="purple"
          onClick={()=>navigate('/space/register')}
        >공간등록하러가기</Button>

      </Box>

      {/* 하단 부분 (배경 이미지 포함) */}
      <Box
        flex="1.5"
        backgroundImage="url('https://img.hourplace.co.kr/place/user/83453/2024/06/10/373dc851-16f9-4902-a8be-73e18baeb76a?s=2000x2000&t=inside&q=80')"
        backgroundSize="cover"
        backgroundPosition="center"
        p={4}
        height="100%" // 추가: 높이 100%
        width="100%" // 추가: 너비 100%
      >
        <Box bg="rgba(255, 255, 255, 0.8)" p={4} borderRadius="md">

          <Box mb={2}>
            <Center>여러분의 공간을 등록해보세요</Center>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
}
