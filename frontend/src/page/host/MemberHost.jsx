import {Box, Button, Center, useToast} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {LoginContext} from "../../component/LoginProvider.jsx";
import axios from "axios";

export function MemberHost() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();

  function SwitchHost() {
    axios.post("/api/member/nullcheck", {
      memberId: account.id
    })
      .then(res => {
        const data = res.data;
        const { key1, key2, key3 } = data;
        console.log(key1, key2, key3);

        if (key1 === null || key2 === null || key3 === null) {
          navigate(`/member/hostinfo/:accountId`);
        } else {
          axios.put("/api/member/host",{
            memberId: account.id,
          })
            .then((res) => {

              account.login(res.data.token);
              navigate("/space/register");
            })
        }
      })

  }

  function SwitchUser() {
    axios
      .put("/api/member/user", { memberId: account.id })
      .then((res) => {
        toast({
          status: "success",
          description:"유저로 전환되었습니다.",
          position :"top"
        })

        account.login(res.data.token);
        navigate("/")
      })

  }

  return (
<>
    <Center border={"1px dashed black"} borderRadius={"50px"}>
      <Box>zz</Box>
      <Box>zz</Box>
    </Center>
    <Box>
      {account.isLoggedOut() &&<Center>
        <Button
          onClick={() => navigate(`/host/signup`)}
          colorScheme={"purple"} >호스트 회원가입 하러 가기</Button>
      </Center>}
      {account.isUser() ? (<Center>
        <Button
          onClick={SwitchHost}
          colorScheme={"purple"} >호스트로 전환하기</Button>
      </Center>) :(
      <Center>
        <Button
          onClick={SwitchUser}
          colorScheme={"pink"} >유저로 전환하기</Button>
      </Center>)}
      <Box>
      <Center>여러분의 공간을 등록해보세요</Center>
      </Box>
      <Box>
        <Center>호스트센터를 이용하시려면 별도의 호스트 회원가입이 필요합니다</Center>
      </Box>
    </Box>
</>
  );
}
