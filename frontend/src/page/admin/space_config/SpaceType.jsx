import {Box, Button, Heading} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {SpaceTypeList} from "./SpaceTypeList.jsx";
import {SpaceTypeWrite} from "./SpaceTypeWrite.jsx";

export function SpaceType() {
  const [activeView, setActiveView] = useState('list');
  const navigate = useNavigate();

  return <Box>
    <Heading>공간 유형 CRUD 페이지</Heading>
    <Button
      onClick={() => setActiveView('list')}
    >
      공간 유형 리스트
    </Button>
    <Button
      onClick={() => setActiveView('write')}
    >
      공간 유형 등록
    </Button>

    {/* 조건부 렌더링 */}
    {activeView === 'list' && <SpaceTypeList/>}
    {activeView === 'write' && <SpaceTypeWrite setActiveView={setActiveView}/>}
  </Box>
}