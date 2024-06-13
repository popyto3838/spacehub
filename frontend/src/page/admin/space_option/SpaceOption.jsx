import {Box, Heading} from "@chakra-ui/react";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {SpaceOptionWrite} from "./SpaceOptionWrite.jsx";
import {SpaceOptionList} from "./SpaceOptionList.jsx";

export function SpaceOption() {
  const [activeView, setActiveView] = useState('list');
  const navigate = useNavigate();

  return <Box>
    <Heading>공간 옵션 CRUD 페이지</Heading>
    <Button
      onClick={() => setActiveView('list')}
    >
      공간 리스트
    </Button>
    <Button
      onClick={() => setActiveView('write')}
    >
      공간 옵션 등록
    </Button>

    {/* 조건부 렌더링 */}
    {activeView === 'list' && <SpaceOptionList/>}
    {activeView === 'write' && <SpaceOptionWrite setActiveView={setActiveView}/>}
  </Box>
}