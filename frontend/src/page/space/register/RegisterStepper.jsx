import React, {useContext, useEffect, useState} from 'react';
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
  StepTitle, Tooltip,
  useSteps,
  useToast,
} from '@chakra-ui/react';
import RegisterPage1 from "./RegisterPage1.jsx";
import RegisterPage2 from "./RegisterPage2.jsx";
import RegisterPage3 from "./RegisterPage3.jsx";
import RegisterPage4 from "./RegisterPage4.jsx";
import RegisterPage5 from "./RegisterPage5.jsx";
import RegisterPage6 from "./RegisterPage6.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {LoginContext} from "../../../component/LoginProvider.jsx";

// Stepper steps definition
const steps = [
  {title: 'Step 1', description: '공간 소개'},
  {title: 'Step 2', description: '상세 정보'},
  {title: 'Step 3', description: '규칙 설정'},
  {title: 'Step 4', description: '숫자 설정'},
  {title: 'Step 5', description: '사진 등록'},
  {title: 'Step 6', description: '옵션 등록'},
];

const StepContent = ({step, formData, setFormData}) => {
  switch (step) {
    case 0:
      return <RegisterPage1 formData={formData} setFormData={setFormData}/>;
    case 1:
      return <RegisterPage2 formData={formData} setFormData={setFormData}/>;
    case 2:
      return <RegisterPage3 formData={formData} setFormData={setFormData}/>;
    case 3:
      return <RegisterPage4 formData={formData} setFormData={setFormData}/>;
    case 4:
      return <RegisterPage5 formData={formData} setFormData={setFormData}/>;
    case 5:
      return <RegisterPage6 formData={formData} setFormData={setFormData}/>;
    default:
      return null;
  }
};

const RegisterStepper = () => {
  const account = useContext(LoginContext); // LoginContext에서 memberId를 가져옵니다.

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [activeStep, setActiveStep] = useState(() => {
    const storedStep = sessionStorage.getItem('activeStep');
    return storedStep ? parseInt(storedStep) : 0;
  });

  const [formData, setFormData] = useState(() => {
    const storedData = sessionStorage.getItem('formData');
    return storedData ? JSON.parse(storedData) : {
      // page별 데이터 구분 없이 저장
      id: account.id,
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
      files: [],
      options: [],
    };
  });

  const {steps: chakraSteps} = useSteps({initialStep: activeStep});

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    sessionStorage.setItem('activeStep', (activeStep - 1).toString());
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    sessionStorage.setItem('activeStep', (activeStep + 1).toString());
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // spaceDto 객체 생성
    const spaceDto = {
      memberId: account.id, // LoginContext에서 가져온 memberId 사용
      space: {
        typeListId: formData.typeListId,
        type: formData.type,
        title: formData.title,
        subTitle: formData.subTitle,
        zonecode: formData.zonecode,
        address: formData.address,
        detailAddress: formData.detailAddress,
        extraAddress: formData.extraAddress,
        latitude: formData.latitude,
        longitude: formData.longitude,
        introduce: formData.introduce,
        facility: formData.facility,
        notice: formData.notice,
        price: formData.price,
        capacity: formData.capacity,
        floor: formData.floor,
        parkingSpace: formData.parkingSpace,
      },
      optionList: formData.options,
    };

    formDataToSend.append('spaceDto', new Blob([JSON.stringify(spaceDto)], {type: 'application/json'}));

    // 파일 데이터 추가
    if (formData.files && formData.files.length > 0) {
      for (const file of formData.files) {
        formDataToSend.append('files', file);
      }
    } else {
      // 파일이 없을 때 처리
      formDataToSend.append('files', new Blob([], {type: "application/octet-stream"}));
    }

    // 5. API 요청 보내기
    try {
      const response = await axios.post('/api/space/insert', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 헤더에 토큰 추가
        }
      });

      // 6. 성공적으로 제출되었을 때 처리
      toast({
        title: '공간 등록이 완료되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      sessionStorage.removeItem('formData');
      sessionStorage.removeItem('activeStep');
      navigate('/');

    } catch (error) {
      // 7. 제출 실패 시 에러 처리
      console.error("Error submitting space data:", error);
      toast({
        title: '공간 등록에 실패했습니다.',
        description: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    sessionStorage.setItem('formData', JSON.stringify(formData));
    sessionStorage.setItem('activeStep', activeStep.toString());
  }, [formData, activeStep]);

  useEffect(() => {
    // 페이지 이동 시 세션 스토리지 초기화
    const handleUnload = () => {
      sessionStorage.removeItem('formData');
      sessionStorage.removeItem('activeStep');
    };

    // 페이지가 변경될 때마다 세션 스토리지 초기화
    if (location.pathname !== "/space/register") {
      handleUnload();
    }
    return () => {
      handleUnload();
    };
  }, [location]);

  function isNextDisabled() {
    const requiredFields = ['type'];
    // 개발완성시 requiredFields 에 아래 항목들도 추가
    // 'title', 'subTitle', 'zonecode', 'address', 'detailAddress', 'extraAddress', 'latitude', 'longitude', 'introduce', 'facility', 'notice', 'price', 'capacity', 'floor', 'parkingSpace'
    return requiredFields.some(field => !formData[field]);
  }

  return (
    <Box mt={4}>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon/>}
                incomplete={<StepNumber/>}
                active={<StepNumber/>}
              />
            </StepIndicator>
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator/>
          </Step>
        ))}
      </Stepper>

      <Box mt={6}>
        <StepContent step={activeStep} formData={formData} setFormData={setFormData}/>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          onClick={handleBack}
          isDisabled={activeStep === 0}
        >
          Prev
        </Button>
        {activeStep === steps.length - 1 ? ( // 마지막 단계인 경우 Submit 버튼 표시
          <Tooltip
            label="필수 사항을 전부 입력했는지 확인해주세요."
            shouldWrapChildren
            isDisabled={!isNextDisabled()}
          >
            <Button onClick={handleSubmit} colorScheme="teal" isDisabled={isNextDisabled()}>
              Submit
            </Button>
          </Tooltip>
        ) : (
          <Tooltip
            label="필수 사항을 전부 입력했는지 확인해주세요."
            shouldWrapChildren
            isDisabled={!isNextDisabled()}
          >
            <Button
              onClick={handleNext}
              colorScheme="teal"
              isDisabled={isNextDisabled()}
            >
              Next
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default RegisterStepper;