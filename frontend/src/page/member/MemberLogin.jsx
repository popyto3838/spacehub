import {
  Box,
  Button, Flex, flexbox,
  FormControl,
  FormLabel,
  Input,
  useToast,
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
      <Flex>

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
        <Box mt={6} w={255}>
          <Button w="255px" onClick={handleLogin} colorScheme={"blue"}>
            로그인
          </Button>
        </Box>
        <Box w="255px" h="80px" mt={22}>
          <NaverLogin/>
        </Box>
      </Box>
      </Box>
     {/* <Box>*/}

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
     {/* </Box>*/}
      </Flex>
</Box>


)
  ;
}
