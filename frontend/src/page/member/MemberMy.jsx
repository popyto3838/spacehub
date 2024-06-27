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
  InputGroup,
  InputRightElement,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormHelperText,
  ModalFooter, Modal, useDisclosure
} from "@chakra-ui/react";

import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";
import TimerComponent from "./TimerComponent.jsx";

export function MemberMy() {
  const [accountNumber, setAccountNumber] = useState();
  const [bankName, setBankName] = useState()
  const [mobile, setMobile] = useState()
  const [files, setFiles] = useState([]);
  const [businessName, setBusinessName] = useState();
  const [businessNumber, setBusinessNumber] = useState();
  const [repName, setRepName] = useState();

  const [member, setMember] = useState({});
  const [host, setHost] = useState({});
  const [oldNickName, setOldNickName] = useState('');
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const{isOpen, onOpen, onClose}=useDisclosure()

  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();


  const imageUrl = ""


  const fetchMemberData = () => {
    // 두 개의 API 호출을 병렬로 수행
    if(account.id) {
      const fetchMember = axios.get(`/api/member/${account.id}`);
      const fetchHost = axios.get('/api/member/gethost', {params: {memberId: account.id}});

      Promise.all([fetchMember, fetchHost])
        .then(([memberRes, hostRes]) => {
          const member1 = memberRes.data;
          setMember({...member1, password: ""});
          setOldNickName(member1.nickname);

          const host1 = hostRes.data;
          setHost(host1);

        console.log(member1.src);
        console.log(member1);
        console.log(host1);
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


  }



  useEffect(() => {
    fetchMemberData();
  }, [account.id, navigate, toast]);



  function handleAccount() {
    axios.post("/api/member/accountEdit",{
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



  function handleProfile() {
    axios
    .postForm('/api/member/profile',{
      memberId : account.id,
      files: files,
    })
    .then((res) => {
      toast({
        status: "success",
        description :"프로필이 수정되었습니다",
        position: "top",
      })
      onClose();
    })


  }

  function submitHostInfo() {

    axios.post("/api/member/hostInfoEdit" , {
      businessName : businessName,
      businessNumber : businessNumber,
      repName : repName,
      memberId : account.id,

    })
      .then(e=>{
        toast({
          status: "success",
          description : "수정완료",
          position: "top"
        })
        fetchMemberData();
      })

  }




  return (
    <Box maxWidth="800px" margin="auto" padding={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>프로필 관리</Text>

      <HStack alignItems="flex-start" spacing={10}>
        <VStack >
          <img

            src={`${member.profileImage}`}
            alt="User Profile Image"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%', // 원형 모양으로 보이게 하기 위한 스타일
              objectFit: 'cover', // 이미지가 잘리지 않고 채워지도록 함
            }}
          />
          <Button
            onClick={onOpen}
            size="sm">프로필 사진 수정</Button>
        </VStack>

        <VStack align="stretch" spacing={5} flex={1}>
          {account.isHost()&&<Box bg="purple.700" color="white" p={3} borderRadius="md">
            <FormControl>
              <FormLabel>사업자명</FormLabel>
              <Input placeholder={host.businessName}
                     onChange={(e) => {
                       setBusinessName(e.target.value);
                     }}
              />
              <FormLabel>사업자번호</FormLabel>
              <Input placeholder={host.businessNumber}
                     onChange={(e) => {
                       setBusinessNumber(e.target.value);
                     }}
              />
              <FormLabel>대표자명</FormLabel>
              <Input placeholder={host.repName}
                     onChange={(e) => {
                       setRepName(e.target.value);
                     }}
              />
              <Button onClick={submitHostInfo} size="sm" >수정하기</Button>
            </FormControl>
          </Box>}
          {account.isHost()&&<Box bg="purple.700" color="white" p={3} borderRadius="md">
            <Text>은행명</Text>
            <Input
              placeholder={host.bankName}
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
              size="sm" colorScheme="whiteAlpha">수정하기</Button>
          </Box>}

          <Box bg={account.isHost() ?"purple.700" : "pink.600"}
               color="white"
               p={3} borderRadius="md">
            <FormControl>
              <FormLabel>연락처</FormLabel>
              <Input placeholder={member.mobile}
                     onChange={(e) => {
                       setMobile(e.target.value);
                       setIsCheckedMobile(false);
                     }}
              />
              <Button onClick={sendNumber} size="sm" >인증하기</Button>
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>프로필사진 등록</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>파일을 선택해주세요</FormLabel>
                  <Input
                    type={"file"}
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>취소</Button>
                <Button colorScheme="blue" mr={3} onClick={handleProfile}>
                  저장
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </HStack>

    </Box>
  );
}
