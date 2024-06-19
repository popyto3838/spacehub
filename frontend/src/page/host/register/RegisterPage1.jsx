import React, {useEffect, useState} from "react";
import {Box, FormControl, FormLabel, Heading, Input, Select, useToast} from "@chakra-ui/react";
import axios from "axios";

const RegisterPage1 = ({formData, setFormData}) => {
  const [typeLists, setTypeLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const handleTypeChange = (e) => {
    const selectedType = typeLists.find(type => type.name === e.target.value);
    setFormData({
      ...formData,
      page1Data: {
        ...formData.page1Data,
        typeId: selectedType ? selectedType.typeListId : null, // typeId 값 저장
      },
    });
  };
  const handleTitleChange = (e) => {
    setFormData({
      ...formData,
      page1Data: {
        ...(formData.page1Data || {}), // formData.page1Data가 존재하지 않을 경우 빈 객체로 초기화
        title: e.target.value,
      },
    });
  };
  const handleSubTitleChange = (e) => {
    setFormData({
      ...formData,
      page1Data: {
        ...(formData.page1Data || {}), // formData.page1Data가 존재하지 않을 경우 빈 객체로 초기화
        subTitle: e.target.value,
      },
    });
  };

  useEffect(() => {
    axios.get(`/api/space/type/list`)
      .then((res) => {
        setTypeLists(res.data);
        setLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error("Error fetching type lists:", error);
        setLoading(false); // 에러 발생 시에도 로딩 상태 해제
      });
  }, []);

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
          value={(formData.page1Data && formData.page1Data.type) || ''} // formData.page1Data가 존재할 때만 type 값을 사용
          onChange={handleTypeChange}
        >
          {typeLists.map((typeList) => (
            <option key={typeList.typeListId} value={typeList.name}>
              {typeList.name}
            </option>
          ))}
        </Select>
      </FormControl>
      {/* ... (나머지 입력 필드: title, subTitle, location) */}
      <FormControl mb={4}>
        <FormLabel htmlFor="space-title">공간 이름</FormLabel>
        <Input
          id="space-title"
          value={(formData.page1Data && formData.page1Data.title) || ''} // formData.page1Data가 존재할 때만 title 값을 사용
          onChange={handleTitleChange}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-subtitle">공간 한 줄 소개</FormLabel>
        <Input
          id="space-subtitle"
          value={(formData.page1Data && formData.page1Data.subTitle) || ''} // formData.page1Data가 존재할 때만 subTitle 값을 사용
          onChange={handleSubTitleChange}
        />
      </FormControl>
    </Box>
  );
};

export default RegisterPage1;