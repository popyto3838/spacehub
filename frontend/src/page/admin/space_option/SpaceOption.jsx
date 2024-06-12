import {Box, Heading, useTheme} from "@chakra-ui/react";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export function SpaceOption() {

  const navigate = useNavigate();

  return <Box>
    <Heading>공간 옵션 CRUD 페이지</Heading>
    <Button
      onClick={()=> navigate(`list`)}
    >
      공간 리스트
    </Button>
    <Button
      onClick={()=>navigate(`write`)}
    >
      공간 옵션 등록
    </Button>
  </Box>
}