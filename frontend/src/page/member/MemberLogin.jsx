import {
  Box,
  Button, Divider, Flex, flexbox,
  FormControl,
  FormLabel, HStack,
  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Text, useDisclosure,
  useToast, VStack,
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import NaverLogin from "./NaverLogin.jsx";
import QRCode from "qrcode.react";

export function MemberLogin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [qrUuid, setQrUuid] = useState('');
  const [time, setTime] = useState(300);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const { isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose } = useDisclosure();
  const { isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure();

  function handleLogin() {
    axios
      .post("/api/member/token", { email, password })
      .then((res) => {
        account.login(res.data.token);
        console.log(res.data.token);

        toast({
          status: "success",
          description: "로그인 되었습니다.",
          position: "top",
        });
        navigate("/");
      })
      .catch((err) => {
        account.logout();

        toast({
          status: "warning",
          description: "이메일과 패스워드를 확인해주세요.",
          position: "top",
        });
      });
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(String(Math.floor(time / 60)).padStart(2, '0'));
      setSeconds(String(time % 60).padStart(2, '0'));
      setTime(time - 1);

      if (time < 1) {
        refreshQr();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const requestIpAddress = '${requestIpAddress}';
    const serverPort = '${serverPort}';


    setTime(300);

    return () => {

    };
  }, []);

  const refreshQr = () => {
    // QR 코드 및 타이머 새로고침 로직 구현
    setTime(300);
  };

  const handleResetClick = () => {
    refreshQr();
  };

  const handleInfoAnotherClick = () => {
    closeSocket();
    // 일반 로그인 페이지로 이동
    window.location.href = '/SYJ_Mall/login.action';
  };


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
            <Input onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>
        </Box>
        <Box mt={4}>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
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
            <HStack as="button" spacing={2} p={2} borderWidth={1} borderRadius="md" _hover={{ bg: "skyblue" }}>
              <Text
                onClick={onFirstModalOpen}
              >아이디 찾기</Text>
            </HStack>

            <HStack as="button" spacing={2} p={2} borderWidth={1} borderRadius="md" _hover={{ bg: "skyblue" }}>
              <Text>비밀번호 찾기</Text>
            </HStack>

            <HStack as="button" spacing={2} p={2} borderWidth={1} borderRadius="md" _hover={{ bg: "skyblue" }}>
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
                <Input   placeholder="01012345678" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>인증하기</FormLabel>
                <Input placeholder='Last name' />
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
            <ModalHeader>두 번째 모달</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              두 번째 모달의 내용입니다.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onSecondModalClose}>
                닫기
              </Button>
            </ModalFooter>
          </ModalContent>
         </Modal>
        </VStack>
      </Box>
      </Box>
      <Box>

     {/* <div className="qr-box">*/}

     {/*   <div display={flexbox} className="qr-code">*/}
     {/*     <QRCode value={qrUuid} size={150}/>*/}
     {/*   </div>*/}

     {/*   <div className="desc">*/}
     {/*     <div className="title">*/}
     {/*       남는 시간:*/}
     {/*       <span id="timeCheck" className="time">*/}
     {/*               {`${minutes} : ${seconds}`}*/}
     {/*             </span>*/}
     {/*     </div>*/}
     {/*     <div id="resetBtn" className="ico-reset" onClick={handleResetClick}></div>*/}
     {/*   </div>*/}

     {/*</div>*/}
      </Box>
      </Flex>
</Box>


)
  ;
}
