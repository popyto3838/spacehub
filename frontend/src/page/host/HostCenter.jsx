import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Text, useToast, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {LoginContext} from "../../component/LoginProvider.jsx";
import axios from "axios";
import HostDashboard from "./HostDashboard.jsx";

export function HostCenter() {
  const [member, setMember] = useState({});
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();

  useEffect(() => {
    if (account.id) {
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
    }
  }, [account, navigate, toast]);

  return (
    <VStack spacing={0} align="stretch" minHeight="60vh" marginBottom="10">
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
          onClick={() => navigate('/space/register')}
        >공간등록하러가기</Button>
      </Box>

      {/* 하단 부분 (배경 이미지 포함) */}
      <Box><HostDashboard memberId={account.id}/></Box>
    </VStack>
  );
}

export default HostCenter;
