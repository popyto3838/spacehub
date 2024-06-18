import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Heading, Text, useToast } from "@chakra-ui/react";
import axios from "axios";

const RegisterPage6 = ({ formData, setFormData }) => {
  const [optionLists, setOptionLists] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    axios.get('/api/space/option/list') // 활성화된 옵션 리스트 API 호출
      .then(res => {
        setOptionLists(res.data.filter(option => option.active));
      })
      .catch(error => {
        toast({
          title: '옵션 목록을 불러오는 데 실패했습니다.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  // 옵션 클릭 시 선택/해제 상태 변경
  const handleOptionClick = (clickedOption) => {
    setSelectedOptions(prevOptions => {
      const isSelected = prevOptions.some(option => option.id === clickedOption.optionListId);
      if (isSelected) {
        return prevOptions.filter(option => option.id !== clickedOption.optionListId);
      } else {
        return [...prevOptions, { id: clickedOption.optionListId, name: clickedOption.name }];
      }
    });
  };

  // selectedOptions 상태가 변경될 때 formData 업데이트
  useEffect(() => {
    setFormData({
      ...formData,
      page6Data: {
        selectedOptions: selectedOptions, // 선택된 옵션 저장
      },
    });

    // 선택된 옵션들의 ID와 이름을 로그에 출력
    console.log("Selected Options:", selectedOptions);
  }, [selectedOptions, setFormData]);

  return (
    <Box>
      <Heading>기본 제공 옵션</Heading>
      <Text color="gray" mb={8}>
        제공 가능한 항목을 클릭하여 사용자에게 어필해보세요 😎
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
        {optionLists.map(option => (
          <Button
            key={option.optionListId}
            colorScheme={selectedOptions.some(opt => opt.id === option.optionListId) ? 'teal' : 'gray'}
            onClick={() => handleOptionClick(option)}
          >
            {option.name}
          </Button>
        ))}
      </Grid>
    </Box>
  );
};

export default RegisterPage6;
