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
  InputGroup, InputRightElement
} from "@chakra-ui/react";
import {Avatar} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";
import TimerComponent from "./TimerComponent.jsx";

export function MemberMy() {
  const [accountNumber, setAccountNumber] = useState();
  const [bankName, setBankName] = useState()
  const [mobile, setMobile] = useState()
  const [member, setMember] = useState({});
  const [oldNickName, setOldNickName] = useState('');
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);

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


  function handleAccount() {
    axios.post("/api/member/account",{
      memberId: account.id,
      accountNumber: accountNumber,
      bankName: bankName,
    })
    .then((res) => {
      toast({
        status: "success",
        description : "계좌등록이 완료되었습니다.",
        position : "top"
      })
    })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "top",
          });
        } else {
          toast({
            status: "error",
            description: "계좌 등록 중 문제가 발생하였습니다.",
            position: "top",
          });
        }
      })



  }

  const sendNumber = () => {

    axios
      .get(`/api/member/p1?mobile=${mobile}`)
      .then((response) => {
        alert("인증번호 발송");
        setVerificationCode(response.data.verificationCode);
        setExpirationTime(response.data.expirationTime);
        setIsCodeSent(true);
      })
      .catch((error) => {
        console.error("Error sending verification code:", error);
      });
  };

  const confirmNumber = () => {
    if (inputCode == verificationCode) {
      alert("인증되었습니다.");
      setIsCodeSent(false);

      axios.post("/api/member/phone",{
        memberId: account.id,
        mobile: mobile
      })

    } else {
      alert("인증에 실패했습니다");
    }
  };

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
            <Text>은행명</Text>
            <Input
                   onChange={(e) => {
                     setBankName(e.target.value);
                     setIsCheckedMobile(false);
                   }}
            />
            <Text>내 계좌번호</Text>
            <Input placeholder={member.mobile}
                   onChange={(e) => {
                     setAccountNumber(e.target.value);
                     setIsCheckedMobile(false);
                   }}
            />
            <Button
              onClick={handleAccount}
              size="sm" colorScheme="whiteAlpha">등록하기</Button>
          </Box>
          <Text>호스트님의 계좌 정보를 등록해주세요 :)</Text>
          <Box bg="purple.500" color="white" p={3} borderRadius="md">
            <FormControl>
              <FormLabel>연락처</FormLabel>
              <Input placeholder={member.mobile}
                     onChange={(e) => {
                       setMobile(e.target.value);
                       setIsCheckedMobile(false);
                     }}
              />
              <Button onClick={sendNumber} size="sm" colorScheme="whiteAlpha">인증하기</Button>
              {isCodeSent && (
                <Box>
                  <InputGroup>
                    <Input
                      type={"text"}
                      onChange={(e) => {
                        setInputCode(e.target.value);
                      }}
                    />
                    <InputRightElement w="75px" mr={1}>
                      <Button onClick={confirmNumber}>핸드폰 인증</Button>
                    </InputRightElement>
                  </InputGroup>
                  {expirationTime && <TimerComponent expirationTime={expirationTime} />}
                </Box>
              )}

            </FormControl>
          </Box>
          <Text>호스트님의 연락처 정보를 등록해주세요 :)</Text>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input value={member.nickname} isReadOnly />
          </FormControl>

          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input value={member.email} isReadOnly />

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