import React, {useEffect, useState} from "react";
import {Box, FormControl, FormLabel, Heading, Input, Select} from "@chakra-ui/react";
import axios from "axios";

const RegisterPage1 = ({formData, setFormData}) => {
  const [typeLists, setTypeLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);

  const handleTypeChange = (e) => setFormData({...formData, type: e.target.value});
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
        <Select id="space-type" onChange={handleTypeChange} >
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
        <Input id="space-title" onChange={handleTitleChange} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-subtitle">공간 한 줄 소개</FormLabel>
        <Input id="space-subtitle" onChange={handleSubTitleChange}/>
      </FormControl>
    </Box>
  );
};

export default RegisterPage1;
