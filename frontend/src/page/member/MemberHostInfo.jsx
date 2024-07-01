import React, {useContext, useEffect, useState} from 'react';
import {

  Box,
  Input,
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Checkbox,
  InputGroup, InputRightElement, useToast, Divider, VStack, Heading,
} from '@chakra-ui/react';
import {Icon, InfoIcon} from '@chakra-ui/icons';
import TimerComponent from "./TimerComponent.jsx";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export function MemberHostInfo(){

  const [accountNumber, setAccountNumber] = useState();
  const [bankName, setBankName] = useState()

  const [repName, setRepName] = useState('');
  const [businessName, setBusinessName] = useState()


  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [choice, setChoice] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const [part1, setPart1] = useState('');
  const [part2, setPart2] = useState('');
  const [part3, setPart3] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [isDisabled, setIsDisabled] = useState(true)

  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();


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
        setIsDisabled(false)
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



  useEffect(() => {
    setBusinessNumber(`${part1}-${part2}-${part3}`);
  }, [part1, part2, part3]);




  function submitHostInfo() {
    axios.post("/api/member/hostInfo" , {
      businessName : businessName,
      businessNumber : businessNumber,
      repName : repName,
      memberId : account.id,
      accountNumber: accountNumber,
      bankName: bankName,
    })
      .then(e=>{
        toast({
          status: "success",
          description : "호스트정보등록완료",
          position: "top"
        })

        return axios.put("/api/member/host",{
          memberId: account.id,
        })
      })
      .then((res)=>{
        account.login(res.data.token);
        console.log(res.data.token);
        navigate("/host/dashboard")
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
              fontSize="22px"
              textAlign="center"
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              fontWeight="extrabold"
              color="black"
            >
              호스트 추가정보 입력
            </Heading>

            <Divider borderColor="purple.500" />

            <FormControl>
              <FormLabel>은행명</FormLabel>
              <Input
                bg="white"
                onChange={(e) => {
                  setBankName(e.target.value);
                  setIsCheckedMobile(false);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>내 계좌번호</FormLabel>
              <InputGroup>
                <Input
                  bg="white"
                  placeholder="계좌번호를 입력하세요"
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="purple"
                    onClick={handleAccount}
                  >
                    등록하기
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>사업자명(개인/법인)</FormLabel>
              <Input bg="white" onChange={(e) => setBusinessName(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>사업자 등록번호</FormLabel>
              <Flex>
                <Input bg="white" maxW="100px" mr={2} value={part1} onChange={(e) => setPart1(e.target.value)} />
                <Text alignSelf="center">-</Text>
                <Input bg="white" maxW="100px" mx={2} value={part2} onChange={(e) => setPart2(e.target.value)} />
                <Text alignSelf="center">-</Text>
                <Input bg="white" maxW="100px" ml={2} value={part3} onChange={(e) => setPart3(e.target.value)} />
              </Flex>
              <Flex mt={2}>
                <Icon as={InfoIcon} color="blue.500" mr={2} />
                <Text fontSize="sm" color="gray.600">정확한 정보를 입력했는지 다시 한번 확인해주세요.</Text>
              </Flex>
              <Flex mt={2}>
                <Icon as={InfoIcon} color="blue.500" mr={2} />
                <Text fontSize="sm" color="gray.600">
                  추후, 사업자 정보가 수정된다면 반드시 온라인 상담을 통해 변경 내용을 알려주셔야 합니다.
                </Text>
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel>대표자명</FormLabel>
              <Input bg="white" onChange={(e) => setRepName(e.target.value)} />
            </FormControl>

            <Button
              colorScheme="purple"
              size="lg"
              isFullWidth
              onClick={submitHostInfo}
              isDisabled={isDisabled}
              bgGradient="linear(to-r, #667eea, #764ba2)"
              _hover={{
                bgGradient: "linear(to-r, #764ba2, #667eea)",
              }}
            >
              제출
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};