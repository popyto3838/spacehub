import React, {useEffect, useState} from "react";
import {Box, FormControl, FormLabel, Heading, Input, Select, useToast} from "@chakra-ui/react";
import axios from "axios";

const RegisterPage1 = ({formData, setFormData}) => {
  const [typeLists, setTypeLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const handleTypeChange = (e) => {
    const selectedType = typeLists.find(type => type.name === e.target.value);
    if (selectedType) { // selectedType가 존재할 때만 업데이트
      setFormData({
        ...formData,
        typeListId: selectedType ? selectedType.itemId : 0, // typeId 값 업데이트
        type: selectedType ? selectedType.name : '', // type 값 업데이트
      });
    }
  };
  const handleTitleChange = (e) => setFormData({...formData, title: e.target.value});
  const handleSubTitleChange = (e) => setFormData({...formData, subTitle: e.target.value});

  useEffect(() => {
    axios.get(`/api/space/type/list`)
      .then((res) => {
        setTypeLists(res.data);
        setLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error("Error fetching type lists:", error);
        setLoading(false); // 에러 발생 시에도 로딩 상태 해제
        toast({
          title: '공간 유형 데이터를 불러오는 데 실패했습니다.',
          description: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  useEffect(() => {
    // formData가 업데이트될 때 typeListId를 확인하고 맞는 타입을 설정
    if (typeLists.length > 0 && formData.typeListId) {
      const selectedType = typeLists.find(type => type.itemId === formData.typeListId);
      if (selectedType) {
        setFormData(prevFormData => ({
          ...prevFormData,
          type: selectedType.name,
        }));
      }
    }
  }, [typeLists, formData.typeListId]);

  if (loading) {
    return <div>Loading...</div>; // 데이터 로딩 중일 때 로딩 표시
  }

  return (
    <Box>
      <Heading>공간 정보</Heading>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-type">공간 유형</FormLabel>
        <Select
          id="space-type"
          value={formData.type || ''}
          onChange={handleTypeChange}
          placeholder="공간 유형을 선택하세요."
        >
          {typeLists.map((typeList) => (
            <option key={typeList.itemId} value={typeList.name}>
              {typeList.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-title">공간 이름</FormLabel>
        <Input
          id="space-title"
          value={(formData && formData.title) || ''}
          onChange={handleTitleChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-subtitle">공간 한 줄 소개</FormLabel>
        <Input
          id="space-subtitle"
          value={(formData && formData.subTitle) || ''}
          onChange={handleSubTitleChange}
        />
      </FormControl>
    </Box>
  );
};

export default RegisterPage1;