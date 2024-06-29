import {
  Box,
  Text,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast, VStack, Heading, Divider, InputLeftElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TimerComponent from "./TimerComponent.jsx";
import NaverLogin from "./NaverLogin.jsx";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiSmartphone } from "react-icons/fi";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [mobile, setMobile] = useState()

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);
  const [capsLockWarning, setCapsLockWarning] = useState(false);


  const MotionBox = motion(Box);
  const toast = useToast();
  const navigate = useNavigate();



  const handleCapsLockWarning = (e) => {
    const isCapsLockOn = e.getModifierState("CapsLock");
    setCapsLockWarning(isCapsLockOn);
  };

  function handleSignup() {
    setIsLoading(true);
    axios
      .post("/api/member/signup",
        {
          email: email,
          password: password,
          nickname: nickname,
          mobile : mobile
        }
      )
      .then((res) => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다",
          position: "top",
        });
        navigate("/member/login");
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
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다",
          position: "top",
        });
      })
      .catch((err) => {
        toast({
          status: "success",
          description: "사용할 수 있는 이메일입니다",
          position: "top",
        });
        setIsCheckedEmail(true);
      });
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${nickname}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다",
          position: "top",
        });
      })
      .catch((err) => {
        toast({
          status: "success",
          description: "사용할 수 있는 닉네임입니다",
          position: " top",
        });
        setIsCheckedNickName(true);
      });
  }

  let isDisabled = false;

  if (!password === passwordCheck) {
    isDisabled = true;
  }
  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      nickname.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  if (!isCheckedEmail) {
    isDisabled = true;
  }

  if (!isCheckedNickName) {
    isDisabled = true;
  }

  if (!isValidEmail) {
    isDisabled = true;
  }

  const sendNumber = () => {
    console.log("email", email);

    axios
      .get(`/api/member/e1?mail=${email}`)
      .then((response) => {
        alert("인증번호 발송");
        setVerificationCode(response.data.number);
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
    } else {
      alert("인증에 실패했습니다");
    }
  };

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


    } else {
      alert("인증에 실패했습니다");
    }
  };









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

              >
                Create Your Account
              </Heading>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMail color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    bg="white"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsCheckedEmail(false);
                      setIsValidEmail(!e.target.validity.typeMismatch);
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      colorScheme="purple"
                      isDisabled={!isValidEmail || email.trim().length === 0}
                      onClick={handleCheckEmail}
                    >
                      Check
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {!isCheckedEmail && (
                  <FormHelperText color="red.500">Please check email availability.</FormHelperText>
                )}
              </FormControl>

              <Button
                leftIcon={<FiMail />}
                colorScheme="purple"
                onClick={sendNumber}
                isFullWidth
              >
                Get Verification Code
              </Button>

              {isCodeSent && (
                <Box

                >
                  <VStack spacing={4}>
                    <InputGroup>
                      <Input
                        placeholder="Enter verification code"
                        onChange={(e) => setInputCode(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={confirmNumber}>
                          Verify
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {expirationTime && <TimerComponent expirationTime={expirationTime} />}
                  </VStack>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiSmartphone color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="01012345678"
                    bg="white"
                    onChange={(e) => {
                      setMobile(e.target.value);
                      setIsCheckedMobile(false);
                    }}
                  />
                </InputGroup>
              </FormControl>

              <Button
                leftIcon={<FiSmartphone />}
                colorScheme="purple"
                onClick={sendNumberMobile}
                isFullWidth
              >
                Get SMS Code
              </Button>

              {isCodeSent && (
                <Box

                >
                  <VStack spacing={4}>
                    <InputGroup>
                      <Input
                        placeholder="Enter SMS code"
                        onChange={(e) => setInputCode(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={confirmNumberMobile}>
                          Verify
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {expirationTime && <TimerComponent expirationTime={expirationTime} />}
                  </VStack>
                </Box>
              )}

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiLock color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    bg="white"
                    onKeyUp={handleCapsLockWarning}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
                {capsLockWarning && (
                  <FormHelperText color="red.500">Caps Lock is ON</FormHelperText>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiLock color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    bg="white"
                    onChange={(e) => setPasswordCheck(e.target.value)}
                  />
                </InputGroup>
                {password !== passwordCheck && (
                  <FormHelperText color="red.500">Passwords do not match</FormHelperText>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Nickname</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiUser color="gray.300" />
                  </InputLeftElement>
                  <Input
                    bg="white"
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setIsCheckedNickName(false);
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      colorScheme="purple"
                      isDisabled={nickname.trim().length === 0}
                      onClick={handleCheckNickName}
                    >
                      Check
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {!isCheckedNickName && (
                  <FormHelperText color="red.500">Please check nickname availability</FormHelperText>
                )}
              </FormControl>

              <Button
                colorScheme="purple"
                size="lg"
                isFullWidth
                isDisabled={isDisabled}
                onClick={handleSignup}
                mt={4}
                bgGradient="linear(to-r, #667eea, #764ba2)"
                _hover={{
                  bgGradient: "linear(to-r, #764ba2, #667eea)",
                }}
              >
                Sign Up
              </Button>

              <Divider />

              <Box>
                <NaverLogin />
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
    );
  }
