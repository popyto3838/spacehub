import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {LoginContext} from "../../component/LoginProvider.jsx";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);

  console.log(memberList);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/member/list").then((res) => setMemberList(res.data));
  }, []);

  if (memberList.length === 0) {
    return <Spinner />;
  }


  return (
    <Box overflowX="auto">
      <Box>회원목록</Box>
      <Box>
        <Table colorScheme="teal" size="md">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>이메일</Th>
              <Th>닉네임</Th>
              <Th>권한</Th>
              <Th>가입일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberList.map((member) => (
              <Tr
                onClick={() => navigate(`/member/${member.memberId}`)}
                cursor={"pointer"}
                _hover={{ bgColor: "blue.300" }}
                key={member.memberId}
              >
                <Td>{member.memberId}</Td>
                <Td>{member.email}</Td>
                <Td>{member.nickname}</Td>
                <Td>{member.authName}</Td>
                <Td>{member.signupDateAndTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
