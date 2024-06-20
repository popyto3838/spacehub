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
  StepTitle,
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

    // JWT 토큰에서 memberId 추출
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const memberId = Number(decodedToken.sub); // 숫자로 변환

    // 1. space 데이터 추가
    formDataToSend.append('space', JSON.stringify({
      memberId: memberId,
      typeId: formData.typeId,
      type: formData.type,
      title: formData.title,
      subTitle: formData.subTitle,
      zonecode: formData.zonecode,
      address: formData.address,
      detailAddress: formData.detailAddress,
      extraAddress: formData.extraAddress,
      latitude: formData.latitude,
      longitude: formData.longitude,
      introduce:formData.introduce,
      facility: formData.facility,
      notice: formData.notice,
      price: formData.price,
      capacity: formData.capacity,
      floor: formData.floor,
      parkingSpace: formData.parkingSpace,
    }));

    // 2. optionList 데이터 추가 (배열 형태로)
    formDataToSend.append('optionList', JSON.stringify(formData.options)); // 배열을 JSON 문자열로 변환하여 추가

    // 3. 파일 데이터 추가
    if (formData.files && formData.files.length > 0) { // 파일이 존재하는 경우에만 추가
      for (const file of formData.files) {
        formDataToSend.append('files', file); // files[] 대신 files를 사용
      }
    }

    // 4. API 요청 보내기
    try {
      const response = await axios.post('/api/space/insert', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
        }
      });

      // 5. 성공적으로 제출되었을 때 처리
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
      // 6. 제출 실패 시 에러 처리
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
    return () => {
      handleUnload();
    };
  }, [location]);

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
          <Button onClick={handleSubmit} colorScheme="teal">
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext} colorScheme="teal">
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default RegisterStepper;