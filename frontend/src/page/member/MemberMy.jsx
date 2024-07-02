import {
  Box,
  Button,
  FormControl,
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
  useDisclosure, FormHelperText, Spinner,
} from "@chakra-ui/react";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {useNavigate, useParams} from "react-router-dom";
import TimerComponent from "./TimerComponent.jsx";

export function MemberMy() {
  const [accountNumber, setAccountNumber] = useState();
  const [bankName, setBankName] = useState();
  const [mobile, setMobile] = useState();
  const [files, setFiles] = useState([]);
  const [businessName, setBusinessName] = useState();
  const [businessNumber, setBusinessNumber] = useState();
  const [repName, setRepName] = useState();
  const [imageVersion, setImageVersion] = useState(0);
  const [oldNickName, setOldNickName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState();


  const [member, setMember] = useState({});
  const [host, setHost] = useState({});
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const {isOpen: isFirstModalOpen, onOpen: onFirstModalOpen, onClose: onFirstModalClose} = useDisclosure();
  const {isOpen: isSecondModalOpen, onOpen: onSecondModalOpen, onClose: onSecondModalClose} = useDisclosure();
  const {isOpen: isThirdModalOpen, onOpen: onThirdModalOpen, onClose: onThirdModalClose} = useDisclosure();

  const account = useContext(LoginContext);
  const { memberId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchMemberData = () => {
    // 두 개의 API 호출을 병렬로 수행
    if (account.id) {
      const fetchMember = axios.get(`/api/member/${account.id}`);
      const fetchHost = axios.get("/api/member/gethost", {
        params: { memberId: account.id },
      });

      Promise.all([fetchMember, fetchHost])
        .then(([memberRes, hostRes]) => {
          const member1 = memberRes.data;
          setMember({ ...member1, password: "" });
          setOldNickName(member1.nickname);
          const host1 = hostRes.data;
          setHost(host1);
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
  };

  useEffect(() => {
    console.log("==========member.profileImage==========", member.profileImage);
    fetchMemberData();
  }, [account.id, navigate, toast]);

  function handleAccount() {
    axios
      .post("/api/member/accountEdit", {
        memberId: account.id,
        accountNumber: accountNumber,
        bankName: bankName,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "계좌수정이 완료되었습니다.",
          position: "top",
        });

        window.location.reload();

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
      });
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

      axios.post("/api/member/phone", {
        memberId: account.id,
        mobile: mobile,

      });

      window.location.reload();

    } else {
      alert("인증에 실패했습니다");
    }
  };

  function handleProfile() {
    axios
      .postForm("/api/member/profile", {
        memberId: account.id,
        files: files,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "프로필이 수정되었습니다",
          position: "top",
        });
        setImageVersion((prev) => prev + 1);
        fetchMemberData();
        onFirstModalClose();

        window.location.reload();
      });
  }

  function submitHostInfo() {
    axios
      .post("/api/member/hostInfoEdit", {
        businessName: businessName,
        businessNumber: businessNumber,
        repName: repName,
        memberId: account.id,
      })
      .then((e) => {
        toast({
          status: "success",
          description: "수정완료",
          position: "top",
        });
        fetchMemberData();

        window.location.reload();
      });
  }

  function handleClickSave() {
    axios
      .put(
        "/api/member/modify",
        { ...member, oldPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        toast({
          status: "success",
          description: "회원 정보가 수정되었습니다.",
          position: "top",
        });
        account.login(res.data.token);
        navigate(`member/info/${accountId}`);
      })
      .catch(() => {
      })
      .finally(() => {
        onSecondModalClose();
        setOldPassword("");
      });
  }


  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${member.nickname}`)
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

  function handleClickRemove() {
    setIsLoading(true);

    axios
      .delete(`/api/member/${account.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { memberId :account.id
               , password : oldPassword },
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원 탈퇴하였습니다.",
          position: "top",
        });
        setTimeout(() => {
          account.logout();
        }, 1000);
        navigate("/");
      })
      .catch((err) => {
        toast({
          status: "warning",
          description: "회원 탈퇴 중 문제가 발생하였습니다.",
          position: "top",
        });

      })
      .finally(() => {
        setIsLoading(false);
        setPassword("");
        onThirdModalClose();

      });
  }

  if (member === null) {
    return <Spinner />;
  }

  let isDisableNickNameCheckButton = false;

  if (member.nickname === oldNickName) {
    isDisableNickNameCheckButton = true;
  }


  if (isCheckedNickName) {
    isDisableNickNameCheckButton = true;
  }

  let isDisableSaveButton = false;

  if (member.password !== passwordCheck) {
    isDisableSaveButton = true;
  }


  if (!isCheckedNickName) {
    isDisableSaveButton = true;
  }

  return (
    <Box maxWidth="800px" margin="auto" padding={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        프로필 관리
      </Text>

      <HStack alignItems="flex-start" spacing={10}>
        <VStack>
          <img
            key={imageVersion} // 캐시 무효화를 위해 key에 imageVersion 사용
            src={`${member.profileImage}?t=${imageVersion}`}
            alt="User Profile Image"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%", // 원형 모양으로 보이게 하기 위한 스타일
              objectFit: "cover", // 이미지가 잘리지 않고 채워지도록 함
            }}
          />
          <Button onClick={onFirstModalOpen} size="sm">
            프로필 사진 수정
          </Button>
        </VStack>

        <VStack align="stretch" spacing={5} flex={1}>
          {account.isHost() && (
            <Box bg="purple.700" color="white" p={3} borderRadius="md">
              <FormControl>
                <FormLabel>사업자명</FormLabel>
                <Input
                  placeholder={host.businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                  }}
                />
                <FormLabel>사업자번호</FormLabel>
                <Input
                  placeholder={host.businessNumber}
                  onChange={(e) => {
                    setBusinessNumber(e.target.value);
                  }}
                />
                <FormLabel>대표자명</FormLabel>
                <Input
                  placeholder={host.repName}
                  onChange={(e) => {
                    setRepName(e.target.value);
                  }}
                />
                <Button onClick={submitHostInfo} size="sm">
                  수정하기
                </Button>
              </FormControl>
            </Box>
          )}
          {account.isHost() && (
            <Box bg="purple.700" color="white" p={3} borderRadius="md">
              <Text>은행명</Text>
              <Input
                placeholder={host.bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                }}
              />
              <Text>내 계좌번호</Text>
              <Input
                placeholder={host.accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                }}
              />
              <Button
                onClick={handleAccount}
                size="sm"
                colorScheme="whiteAlpha"
              >
                수정하기
              </Button>
            </Box>
          )}

          <Box
            bg={account.isHost() ? "purple.700" : "pink.600"}
            color="white"
            p={3}
            borderRadius="md"
          >
            <FormControl>
              <FormLabel>연락처</FormLabel>
              <Input
                placeholder={member.mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
              <Button onClick={sendNumber} size="sm">
                인증하기
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
                      <Button onClick={confirmNumber}>핸드폰 인증</Button>
                    </InputRightElement>
                  </InputGroup>
                  {expirationTime && (
                    <TimerComponent expirationTime={expirationTime} />
                  )}
                </Box>
              )}
            </FormControl>
          </Box>


          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input value={member.email} isReadOnly />
          </FormControl>

          <Box>
            <FormControl>
              <FormLabel>암호</FormLabel>
              <Input
                onChange={(e) =>
                  setMember({ ...member, password: e.target.value })
                }
                placeholder={"암호를 변경하려면 입력하세요"}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>암호 확인</FormLabel>
              <Input onChange={(e) => setPasswordCheck(e.target.value)}
                     placeholder={"위와 동일한 암호를 입력해주세요"}
              />
              {member.password === passwordCheck || (
                <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl>별명</FormControl>
            <InputGroup>
              <Input
                onChange={(e) => {
                  const newNickName = e.target.value.trim();
                  setMember({ ...member, nickname: newNickName });
                  setIsCheckedNickName(newNickName === oldNickName);
                }}
                value={member.nickname}
              />
              <InputRightElement w={"75px"} mr={1}>
                <Button
                  isDisabled={isDisableNickNameCheckButton}
                  size={"sm"}
                  onClick={handleCheckNickName}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box>
            <Button
              isDisabled={isDisableSaveButton}
              onClick={onSecondModalOpen}
              colorScheme={"blue"}
            >
              저장
            </Button>
          </Box>

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

          <Text fontSize="sm" color="gray.500">
            1개의 SNS연동만 가능하며, 연동된 소셜계정은 해제가 불가합니다.
          </Text>

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
          <Button onClick={onThirdModalOpen}>
            탈퇴하기
          </Button>
          <Modal isOpen={isFirstModalOpen} onClose={onFirstModalClose}>
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
                <Button onClick={onFirstModalClose}>취소</Button>
                <Button colorScheme="blue" mr={3} onClick={handleProfile}>
                  저장
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isSecondModalOpen} onClose={onSecondModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>기존 암호 확인</ModalHeader>
              <ModalBody>
                <FormControl>
                  <FormLabel>기존 암호</FormLabel>
                  <Input onChange={(e) => setOldPassword(e.target.value)} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onSecondModalClose}>취소</Button>
                <Button colorScheme="blue" onClick={handleClickSave}>
                  확인
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isThirdModalOpen} onClose={onThirdModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>탈퇴 확인</ModalHeader>
              <ModalBody>
                <FormControl>
                  <FormLabel>암호</FormLabel>
                  <Input
                    value={password}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onThirdModalClose}>취소</Button>
                <Button
                  isLoading={isLoading}
                  colorScheme={"red"}
                  onClick={handleClickRemove}
                >
                  확인
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </VStack>
      </HStack>
    </Box>
  );
}
