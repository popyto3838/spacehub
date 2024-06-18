import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Switch,
  VStack,
  useToast,
  Avatar
} from "@chakra-ui/react";

import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";

export function MemberMy() {

  const [member, setMember] = useState({});
  const [oldNickName, setOldNickName] = useState('');
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();




  useEffect(() => {
    axios
      .get(`/api/member/${account.id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
        setOldNickName(member1.nickname);

        console.log(member);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 정보 조회 중 문제가 발생하였습니다.",
          position: "top",
        });
        navigate("/");
      });
  }, []);




  return (
    <Box maxWidth="800px" margin="auto" padding={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>프로필 관리</Text>

      <HStack alignItems="flex-start" spacing={10}>
        <VStack>
          <Avatar size="xl" name="popyto2" />
          <Button size="sm">프로필 사진 변경</Button>
        </VStack>

        <VStack align="stretch" spacing={5} flex={1}>
          <Box bg="purple.500" color="white" p={3} borderRadius="md">
            <Text>내 관심정보</Text>
            <Button size="sm" colorScheme="whiteAlpha">설정하기</Button>
          </Box>

          <Text>아직 설정된 정보가 없어요! 관심있는 지역 및 프로필/관심사를 설정해보세요. :)</Text>

          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input value={member.nickname} isReadOnly />
          </FormControl>

          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input value={member.email} isReadOnly />
            <Button size="sm" mt={2}>인증하기</Button>
          </FormControl>

          <FormControl>
            <FormLabel>연락처</FormLabel>
            <Input placeholder="휴대폰 정보 없음" isReadOnly />
            <Button size="sm" mt={2}>인증하기</Button>
          </FormControl>

          <FormControl>
            <FormLabel>SNS연동</FormLabel>
            <HStack>
              <Switch id="naver" isChecked />
              <Text>네이버연동</Text>
            </HStack>
            <HStack mt={2}>
              <Switch id="kakao" />
              <Text>카카오연동</Text>
            </HStack>
          </FormControl>

          <Text fontSize="sm" color="gray.500">1개의 SNS연동만 가능하며, 연동된 소셜계정은 해제가 불가합니다.</Text>

          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Button size="sm">변경하기</Button>
          </FormControl>

          <FormControl>
            <FormLabel>마케팅 수신동의</FormLabel>
            <VStack align="stretch">
              <HStack>
                <Switch id="email-marketing" />
                <Text>이메일</Text>
              </HStack>
              <HStack>
                <Switch id="sms-marketing" />
                <Text>SMS</Text>
              </HStack>
            </VStack>
          </FormControl>
        </VStack>
      </HStack>
    </Box>
  );
}