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
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TimerComponent from "./TimerComponent.jsx";
import NaverLogin from "./NaverLogin.jsx";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [mobile, setMobile] = useState()

  const [authName, setAuthName] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);
  const [capsLockWarning, setCapsLockWarning] = useState(false);
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
      w="450px"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Box as="h2" size="lg" textAlign="center" mb={6}>
        {" "}
        회원가입{" "}
      </Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                placeholder="ex)hello@naver.com"
                type={"email"}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsCheckedEmail(false);
                  setIsValidEmail(!e.target.validity.typeMismatch);
                }}
              />
              <InputRightElement w="75px" mr={1}>
                <Button
                  isDisabled={!isValidEmail || email.trim().length == 0}
                  onClick={handleCheckEmail}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {isCheckedEmail || (
              <FormHelperText>이메일 중복확인을 해주세요.</FormHelperText>
            )}
            {isValidEmail || (
              <FormHelperText>
                올바른 이메일 형식으로 작성해주세요.
              </FormHelperText>
            )}
            <Button colorScheme={"purple"} type="button" onClick={sendNumber}>
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
                  <Button onClick={confirmNumber}>이메일 인증</Button>
                </InputRightElement>
              </InputGroup>
                {expirationTime && <TimerComponent expirationTime={expirationTime} />}
              </Box>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>연락처</FormLabel>
            <Input
                onChange={(e) => {
                  setMobile(e.target.value);
                  setIsCheckedMobile(false);
                }}
              />
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

        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호</FormLabel>
            <Input
              type="password" onKeyUp={handleCapsLockWarning}
              onChange={(e) => setPassword(e.target.value)} />
            {capsLockWarning && <Text color="purple.500">Caps Lock이 켜져 있습니다.</Text>}
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호확인</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPasswordCheck(e.target.value)} />
            {password === passwordCheck || (
              <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>별명</FormLabel>
            <InputGroup>
              <Input
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsCheckedNickName(false);
                }}
              />
              <InputRightElement w={"75px"} mr={1}>
                <Button
                  isDisabled={nickname.trim().length == 0}
                  onClick={handleCheckNickName}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {isCheckedNickName || (
              <FormHelperText>별명 중복확인을 해주세요.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <Button
            mt={13}
            isDisabled={isDisabled}
            colorScheme="teal"
            width="full"
            onClick={handleSignup}
          >
            가입
          </Button>
        </Box>
        <Box w="266px" h="111px" mt={22}>
          <NaverLogin />
        </Box>
      </Box>
    </Box>
  );
}
