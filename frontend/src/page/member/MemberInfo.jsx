import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { memberId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${memberId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMember(res.data).catch((err) => {
          if (err.response.status === 404) {
            toast({
              status: "warning",
              description: "존재하지 않는 회원입니다",
              position: "top",
            });
            navigate("/");
          } else if (err.response.status === 403) {
            toast({
              status: "error",
              description: "권한이 없습니다.",
              position: "top",
            });
            navigate(-1);
          }
        });
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleClickRemove() {
    setIsLoading(true);

    axios
      .delete(`/api/member/${memberId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { memberId, password },
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원 탈퇴하였습니다.",
          position: "top",
        });
        account.logout();
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
        onClose();
      });
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
      <Box fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
        회원정보
      </Box>
      <VStack spacing={4} align="stretch">
        <Box>
          <Box>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input isReadOnly value={member.email} />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>별명</FormLabel>
              <Input isReadOnly value={member.nickname} />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>가입일시</FormLabel>
              <Input
                isReadOnly
                value={member.inputDt}
                type={"datetime-local"}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>권한</FormLabel>
              <Input
                isReadOnly
                value={member.authName}
              />
            </FormControl>
          </Box>
          <Box>
            <Button
              onClick={() => navigate(`/member/edit/${member.memberId}`)}
              colorScheme={"purple"}
            >
              수정
            </Button>
            <Button colorScheme={"red"} onClick={onOpen}>
              탈퇴
            </Button>
          </Box>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>탈퇴 확인</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>암호</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
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
    </Box>
  );
}
