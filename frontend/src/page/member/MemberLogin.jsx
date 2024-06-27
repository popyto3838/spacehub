import {
  Box,
  Button, Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import NaverLogin from "./NaverLogin.jsx";
import TimerComponent from "./TimerComponent.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [memberId, setMemberId] = useState();

  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');
  const [mobile, setMobile] = useState()
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [foundEmail, setFoundEmail] = useState();
  const [member, setMember] = useState({});
  const [passwordCheck, setPasswordCheck] = useState()

  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();



  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    setRememberMe(savedRememberMe);
  }, []);

  function handleLogin() {
    axios
      .post("/api/member/token", { email, password })
      .then((res) => {
        account.login(res.data.token);
        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('password');
          localStorage.removeItem('rememberMe');
        }

        toast({
          status: "success",
          description: "로그인 되었습니다.",
          position: "top",
        });
        navigate("/");
      })
      .catch((err) => {
        account.logout();
        localStorage.removeItem('email');
        localStorage.removeItem('password');

        toast({
          status: "warning",
          description: "이메일과 패스워드를 확인해주세요.",
          position: "top",
        });
      });
  }




  const sendNumberMobile = () => {
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

  const confirmNumberMobile = () => {
    if (inputCode == verificationCode) {
      alert("인증되었습니다.");
      setIsCodeSent(false);
      axios
        .get("/api/member/findemail",{
          params: {
            mobile: mobile,
          }
        })
        .then((res) => {
          setFoundEmail(res.data);
        })


    } else {
      alert("인증에 실패했습니다");
    }
  };

  function confirmNumberMobilePassword() {
    if (inputCode == verificationCode) {
      alert("인증되었습니다.");
      setIsCodeSent(false);
      axios
        .get("/api/member/findPassword",{
          params: {
            mobile: mobile,
          }
        })
        .then((res) => {
          setMemberId(res.data);
        })


    } else {
      alert("인증에 실패했습니다");
    }

  }


  function handleClickSave() {

    axios
      .put("/api/member/modifyPassword", {password : password,
                                         memberId : memberId})
      .then(res=>{
        toast({
          status: "success",
          description :"비밀번호가 수정되었습니다",
          position : "top"
        })
        navigate('/member/login')
      })
      .finally(()=>{
        onSecondModalClose();
      })

  }



  return (
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Flex justify="center" align="center" flexDirection="column">

      <Box>
      <Box textAlign="center" fontSize="xl" fontWeight="bold">
        로그인
      </Box>
      <Box>
        <Box mt={4}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>
        </Box>
        <Box mt={4}>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
        </Box>
        <Box mt={4}>
          <Checkbox
            isChecked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            아이디와 패스워드 저장
          </Checkbox>
        </Box>
        <Box mt={6} w={370}>
          <Button w="370px" onClick={handleLogin} colorScheme={"blue"}>
            로그인
          </Button>
        </Box>
        <Box w="255px" h="80px" mt={22}>
          <NaverLogin/>
        </Box>
        <VStack spacing={4} align="stretch">

          <HStack spacing={4} align="center">
            <HStack as="button" spacing={2} p={2} borderWidth={1} borderRadius="md" _hover={{ bg: "orange" }}>
              <Text
                onClick={onFirstModalOpen}
              >아이디 찾기</Text>
            </HStack>

            <HStack as="button" spacing={2} p={2} borderWidth={1} borderRadius="md" _hover={{ bg: "orange" }}>
              <Text
              onClick={onSecondModalOpen}
              >비밀번호 찾기</Text>
            </HStack>

            <HStack as="button" spacing={2} p={2} borderWidth={1} borderRadius="md" _hover={{ bg: "orange" }}>
              <Text
                onClick={()=>navigate("/member/signup")}
              >회원가입</Text>
            </HStack>
          </HStack>

        <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>아이디 찾기</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>핸드폰번호를 입력해주세요</FormLabel>
                <Input
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  placeholder="01012345678" />
                <Button colorScheme={"purple"} type="button" onClick={sendNumberMobile}>
                  인증번호받기
                </Button>
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
                        <Button onClick={confirmNumberMobile}>핸드폰 인증</Button>
                      </InputRightElement>
                    </InputGroup>
                    {expirationTime && <TimerComponent expirationTime={expirationTime} />}
                  </Box>
                )}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>가입하신 아이디는</FormLabel>
                <Input placeholder={foundEmail ? `${foundEmail} 입니다` : ''} readOnly />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onFirstModalClose}>
                닫기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
         <Modal isOpen={isSecondModalOpen} onClose={onSecondModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>비밀번호 찾기</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>핸드폰번호를 입력해주세요</FormLabel>
                <Input
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  placeholder="01012345678" />
                <Button colorScheme={"purple"} type="button" onClick={sendNumberMobile}>
                  인증번호받기
                </Button>
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
                        <Button onClick={confirmNumberMobilePassword}>핸드폰 인증</Button>
                      </InputRightElement>
                    </InputGroup>
                    {expirationTime && <TimerComponent expirationTime={expirationTime} />}
                  </Box>
                )}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>비밀번호를 재설정 해주세요</FormLabel>
                <Input
                  type={"password"}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder={"새 비밀번호"} />
                 
                <Input
                  type={"password"}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  mt={7} placeholder={"새 비밀번호 확인"} />
                {password === passwordCheck || (
                  <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onSecondModalClose}>취소</Button>
              <Button colorScheme="blue" mr={3} onClick={handleClickSave}>
                저장
              </Button>
            </ModalFooter>
          </ModalContent>
         </Modal>
        </VStack>
      </Box>
      </Box>
      <Box>
      </Box>
      </Flex>
</Box>


)
  ;
}
