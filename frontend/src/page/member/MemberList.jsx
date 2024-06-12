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
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();

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
                onClick={() => navigate(`/member/${member.id}`)}
                cursor={"pointer"}
                _hover={{ bgColor: "blue.300" }}
                key={member.id}
              >
                <Td>{member.id}</Td>
                <Td>{member.email}</Td>
                <Td>{member.nickName}</Td>
                <Td>{member.role}</Td>
                <Td>{member.signupDateAndTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
