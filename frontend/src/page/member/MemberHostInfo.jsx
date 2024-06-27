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
  InputGroup, InputRightElement, useToast, Divider,
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
        navigate("/space/register")
      })




  }

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">

      <Text fontSize="xl" fontWeight="bold" mb={2}>
        계좌 정보를 입력해 주세요.
      </Text>
      <Divider borderColor="purple.500" />
      <Box  p={3} borderRadius="md">
        <Text>은행명</Text>

        <Input

          onChange={(e) => {
            setBankName(e.target.value);
            setIsCheckedMobile(false);
          }}
        />
        <Text>내 계좌번호</Text>
        <InputGroup>
        <Input
          placeholder="계좌번호를 입력하세요"
               onChange={(e) => {
                 setAccountNumber(e.target.value);
               }}
        />
        <InputRightElement w={"75px"} mr={1}>
        <Button
          onClick={handleAccount}
          size="sm" colorScheme={"blue"}>등록하기</Button>
        </InputRightElement>
      </InputGroup>
      </Box>
      <Box  p={3} borderRadius="md">

      <FormControl mb={4}>
        <FormLabel>사업자명(개인/법인)</FormLabel>
        <Input  onChange={(e) => setBusinessName(e.target.value)} />
      </FormControl>

        <FormControl isRequired>
          <FormLabel>사업자 등록번호</FormLabel>
          <Flex>
            <Input maxW="100px" mr={2}
                   value={part1}
                   onChange={(e) => setPart1(e.target.value)}
            />
            <Text alignSelf="center">-</Text>
            <Input maxW="100px" mx={2}
                   value={part2}
                   onChange={(e) => setPart2(e.target.value)}
            />
            <Text alignSelf="center">-</Text>
            <Input maxW="100px" ml={2}
                   value={part3}
                   onChange={(e) => setPart3(e.target.value)}
            />
          </Flex>
          <Flex mt={2}>
            <Icon as={InfoIcon} color="blue.500" mr={2} />
            <Text fontSize="sm" color="gray.500">정확한 정보를 입력했는지 다시 한번 확인해주세요.</Text>
          </Flex>
          <Flex mt={2}>
            <Icon as={InfoIcon} color="blue.500" mr={2} />
            <Text fontSize="sm" color="gray.500">
              추후, 사업자 정보가 수정된다면 반드시 온라인 상담을 통해 변경 내용을 알려주셔야 합니다.
            </Text>
          </Flex>
        </FormControl>

        <FormControl mt={5} mb={4}>
          <FormLabel>대표자명</FormLabel>
          <Input  onChange={(e) => setRepName(e.target.value)} />
        </FormControl >

        <Flex justifyContent="flex-end" >
          <Button colorScheme="purple" type="submit"
          onClick={submitHostInfo}
          >
            제출
          </Button>
        </Flex>

      </Box>
    </Box>


  );
};