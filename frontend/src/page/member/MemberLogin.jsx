import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import NaverLogin from "./NaverLogin.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

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
      <Box textAlign="center" fontSize="xl" fontWeight="bold">
        로그인
      </Box>
      <Box>
        <Box mt={4}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </Box>
        <Box mt={4}>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box mt={6}>
          <Button onClick={handleLogin} colorScheme={"blue"}>
            로그인
          </Button>
        </Box>
        <Box w="50px" h="100px">
        <NaverLogin />
        </Box>
      </Box>
    </Box>
  );
}
