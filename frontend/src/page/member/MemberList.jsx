import {
  Box, Container,
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
    <Container maxW="container.xl" py={10}>
      <Box overflowX="auto">
        <Box fontSize="xl" fontWeight="bold" mb={4}>
          회원목록
        </Box>
        <Table colorScheme="purple" size="md">
          <Thead>
            <Tr>
              <Th>memberId</Th>
              <Th>이메일</Th>
              <Th>닉네임</Th>
              <Th>권한</Th>
              <Th>가입일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberList.map((member) => (
              <Tr
                key={member.memberId}
                onClick={() => navigate(`/member/${member.memberId}`)}
                cursor="pointer"
                _hover={{ bgColor: "teal.100" }}
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
    </Container>
  );
}
