import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import RegisterPage1 from "./RegisterPage1.jsx";
import RegisterPage2 from "./RegisterPage2.jsx";
import RegisterPage3 from "./RegisterPage3.jsx";
import RegisterPage4 from "./RegisterPage4.jsx";
import RegisterPage5 from "./RegisterPage5.jsx";
import RegisterPage6 from "./RegisterPage6.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../../component/LoginProvider.jsx";

// Stepper steps definition
const steps = [
  { title: 'Step 1', description: '공간 소개' },
  { title: 'Step 2', description: '상세 정보' },
  { title: 'Step 3', description: '규칙 설정' },
  { title: 'Step 4', description: '숫자 설정' },
  { title: 'Step 5', description: '사진 등록' },
  { title: 'Step 6', description: '옵션 등록' },
];

const StepContent = ({ step, formData, setFormData, deletedFiles, setDeletedFiles, newFiles, setNewFiles }) => {
  switch (step) {
    case 0:
      return <RegisterPage1 formData={formData} setFormData={setFormData} />;
    case 1:
      return <RegisterPage2 formData={formData} setFormData={setFormData} />;
    case 2:
      return <RegisterPage3 formData={formData} setFormData={setFormData} />;
    case 3:
      return <RegisterPage4 formData={formData} setFormData={setFormData} />;
    case 4:
      return <RegisterPage5
        formData={formData}
        setFormData={setFormData}
        deletedFiles={deletedFiles}
        setDeletedFiles={setDeletedFiles}
        newFiles={newFiles}
        setNewFiles={setNewFiles}
      />;
    case 5:
      return <RegisterPage6 formData={formData} setFormData={setFormData} />;
    default:
      return null;
  }
};

const RegisterStepper = () => {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(!!spaceId); // isEdit 초기값 설정
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const initialFormData = {
    memberId: account.id,
    typeListId: 0,
    type: null,
    title: '',
    subTitle: '',
    zonecode: '',
    address: '',
    detailAddress: '',
    extraAddress: '',
    latitude: '',
    longitude: '',
    introduce: '',
    facility: '',
    notice: '',
    price: 0,
    capacity: 0,
    floor: 0,
    parkingSpace: 0,
    files: [], // 기존 파일 정보 저장 (수정 시 필요)
    options: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [deletedFiles, setDeletedFiles] = useState([]); // 삭제된 파일 목록
  const [newFiles, setNewFiles] = useState([]); // 새로운 파일 목록

  useEffect(() => {
    if (spaceId) {
      setIsEdit(true);
      setIsLoading(true); // 로딩 시작
      axios.get(`/api/space/${spaceId}`)
        .then((res) => {
          const spaceData = res.data.space;
          const spaceImgFiles = res.data.spaceImgFiles.map(file => ({ file: new File([], file.fileName), id: file.fileId }));
          setFormData({
            ...initialFormData, // 초기값을 덮어쓰지 않도록 initialFormData와 병합
            ...spaceData,
            files: spaceImgFiles,
            options: res.data.optionList.map(option => option.optionListId),
          });
          setIsLoading(false); // 로딩 완료
        })
        .catch((error) => {
          console.error("Error fetching space data:", error);
          toast({
            title: '공간 데이터를 불러오는 데 실패했습니다.',
            description: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false); // 로딩 완료
        });
    } else {
      setIsEdit(false);
      setFormData(initialFormData);
    }
  }, [spaceId, toast]);

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // space 데이터 추가 (파일 목록 제외)
    const { files, options, ...spaceData } = formData; // options를 분리
    formDataToSend.append('space', JSON.stringify(spaceData));

    // optionList 데이터 추가 (배열 형태로)
    formDataToSend.append('optionList', JSON.stringify(formData.options));

    // 기존 파일 추가
    formData.files.forEach(fileObj => {
      if (fileObj.file && !(fileObj.file instanceof File)) {
        const file = new File([fileObj.file], fileObj.file.name);
        formDataToSend.append('files', file);
      } else {
        formDataToSend.append('files', fileObj.file);
      }
    });

    // 새로운 파일 데이터 추가
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        formDataToSend.append('files', file);
      }
    }

    if (isEdit) {
      // 수정 요청
      formDataToSend.append('deletedFiles', JSON.stringify(deletedFiles));
      try {
        await axios.put(`/api/space/update/${spaceId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({
          title: '공간 수정이 완료되었습니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } catch (error) {
        console.error("Error submitting space data:", error);
        toast({
          title: '공간 수정에 실패했습니다.',
          description: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // 등록 요청
      try {
        await axios.post(`/api/space/insert`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({
          title: '공간 등록이 완료되었습니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } catch (error) {
        console.error("Error submitting space data:", error);
        toast({
          title: '공간 등록에 실패했습니다.',
          description: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const isNextDisabled = () => {
    // const requiredFields = ['type', 'title', 'subTitle', 'zonecode', 'address', 'detailAddress', 'extraAddress', 'latitude', 'longitude', 'introduce', 'facility', 'notice', 'price', 'capacity', 'floor', 'parkingSpace'];
    // return requiredFields.some(field => !formData[field]);
  };

  // 로딩 중일 때는 빈 화면 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box mt={4}>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Box mt={6}>
        <StepContent
          step={activeStep}
          formData={formData}
          setFormData={setFormData}
          deletedFiles={deletedFiles}
          setDeletedFiles={setDeletedFiles}
          newFiles={newFiles}
          setNewFiles={setNewFiles}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button onClick={handleBack} isDisabled={activeStep === 0}>
          Prev
        </Button>
        {activeStep === steps.length - 1 ? (
          <Tooltip label="필수 사항을 전부 입력했는지 확인해주세요." shouldWrapChildren isDisabled={!isNextDisabled()}>
            <Button onClick={handleSubmit} colorScheme="teal" isDisabled={isNextDisabled()}>
              Submit
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="필수 사항을 전부 입력했는지 확인해주세요." shouldWrapChildren isDisabled={!isNextDisabled()}>
            <Button onClick={handleNext} colorScheme="teal" isDisabled={isNextDisabled()}>
              Next
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default RegisterStepper;
