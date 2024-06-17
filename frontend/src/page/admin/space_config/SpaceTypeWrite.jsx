import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  IconButton,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";

export function SpaceTypeWrite({setActiveView}) {
  const [typeNames, setTypeNames] = useState([""]);
  const navigate = useNavigate();

  const handleAddType = () => {
    setTypeNames([...typeNames, ""]);
  };

  const handleTypeChange = (index, value) => {
    const newTypeNames = [...typeNames];
    newTypeNames[index] = value;
    setTypeNames(newTypeNames);
  };

  const handleDeleteType = (index) => {
    // filter()메소드는 JS의 내장 메소드
    // 배열의 각 요소에 대해 주어진 조건함수를 실행하고, 조건을 만족하는 요소들만 모아서 새로운 배열을 반환
    // 이 함수는 filter() 메서드에 전달되어 각 요소에 대해 실행
    // _: 현재 처리 중인 요소의 값입니다. 이 경우에는 사용하지 않으므로 _로 표시
    // i: 현재 처리 중인 요소의 인덱스입니다.
    // i !== index: 현재 요소의 인덱스가 삭제하려는 인덱스와 다르면 true를 반환하여 해당 요소를 새로운 배열에 포함시키고, 같으면 false를 반환하여 제외
    const newTypeNames = typeNames.filter((_, i) => i !== index);
    setTypeNames(newTypeNames);
  };

  function handleClickSubmit() {
    // 빈 문자열("")인 옵션들을 제외하고 유효한 옵션만 필터링
    const filteredTypeNames = typeNames.filter((name) => name.trim() !== "");
    // optionNames 배열을 OptionList 객체 배열로 변환
    // 각 옵션명을 name 프로퍼티로 갖는 객체 생성
    const typeLists = filteredTypeNames.map((name) => ({name}));
    axios
      .post("/api/space/type/write", typeLists)
      .then(() => {
        // 성공 시 activeView 상태값 'list'로 바꾸기
        setActiveView('list');
      })
      .catch(() => {
        // 에러 시 처리
      });
  }

  return (
    <Center>
      <Box w={500}>
        <Box mb={10}>
          <Heading>옵션 등록</Heading>
        </Box>
        <Box>
          {typeNames.map((typeName, index) => (
            <Box mb={7} key={index}>
              <FormControl>
                <FormLabel>옵션명 {index + 1}</FormLabel>
                <Input
                  value={typeName}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                />
                <IconButton
                  aria-label="옵션 삭제"
                  icon={<DeleteIcon/>}
                  onClick={() => handleDeleteType(index)}
                  ml={2}
                />
              </FormControl>
            </Box>
          ))}
          <Button
            leftIcon={<AddIcon/>}
            colorScheme="teal"
            onClick={handleAddType}
          >
            옵션 추가
          </Button>
          <Box mt={10}>
            <Button colorScheme={"gray"} onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button colorScheme={"blue"} onClick={handleClickSubmit} ml={2}>
              등록
            </Button>
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
