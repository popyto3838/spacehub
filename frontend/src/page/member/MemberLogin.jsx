import {
  Box,
  Button, Checkbox, Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel, Heading,
  HStack,
  Input,
  InputGroup, InputLeftElement,
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
import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import NaverLogin from "./NaverLogin.jsx";
import TimerComponent from "./TimerComponent.jsx";
import {FiLock, FiMail} from "react-icons/fi";

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

  const {isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose} = useDisclosure();
  const {isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose} = useDisclosure();


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
      .post("/api/member/token", {email, password})
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
        .get("/api/member/findemail", {
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
        .get("/api/member/findPassword", {
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
      .put("/api/member/modifyPassword", {
        password: password,
        memberId: memberId
      })
      .then(res => {
        toast({
          status: "success",
          description: "비밀번호가 수정되었습니다",
          position: "top"
        })
        navigate('/member/login')
      })
      .finally(() => {
        onSecondModalClose();
      })

  }


  return (
    <Box
      minHeight="100vh"
      bg="linear-gradient(135deg, #f3e7e9 0%, #f9ebff 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        maxWidth="500px"
        w="full"
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        <Box p={8}>
          <VStack spacing={6} align="stretch">
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              fontWeight="extrabold"
              color="black"
            >
              로그인
            </Heading>

            <FormControl>
              <FormLabel>이메일</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiMail color="gray.300"/>
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  bg="white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>패스워드</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiLock color="gray.300"/>
                </InputLeftElement>
                <Input
                  type="password"
                  bg="white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <Checkbox
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              아이디와 패스워드 저장
            </Checkbox>

            <Button
              colorScheme="purple"
              fontSize="25px"
              isFullWidth
              onClick={handleLogin}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              _hover={{
                bgGradient: "linear(to-r, #764ba2, #667eea)",
              }}
            >
              로그인
            </Button>

            <Divider/>

            <Box>
              <NaverLogin/>
            </Box>

            <HStack spacing={4} justify="center" w="100%">
              <Button variant="outline" onClick={onFirstModalOpen}>
                아이디 찾기
              </Button>
              <Button variant="outline" onClick={onSecondModalOpen}>
                비밀번호 찾기
              </Button>
              <Button variant="outline" onClick={() => navigate("/member/signup")}>
                회원가입
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
