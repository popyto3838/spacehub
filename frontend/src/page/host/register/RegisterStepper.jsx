import React, {useEffect, useState} from 'react';
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
      page1Data: {
        type: '', title: '', subTitle: ''
      },
      page2Data: {
        location: '', zonecode: '', address: '', detailAddress: '', extraAddress: '', latitude: '', longitude: ''
      },
      page3Data: {
        introduce: '', facility: '', notice: ''
      },
      page4Data: {
        price: '', capacity: '', floor: '', parkingSpace: ''
      },
      page5Data: {
        files: []
      },
      page6Data: {
        options: []
      },
    };
  });

  const {steps: chakraSteps} = useSteps({initialStep: activeStep});

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      sessionStorage.setItem('activeStep', (activeStep + 1).toString());
    } else {
      axios.post(`api/space/insert`, formData)
        .then(() => {
          // Form submission 완료 후 sessionStorage 초기화
          sessionStorage.removeItem('formData');
          sessionStorage.removeItem('activeStep');
          toast({
            title: "공간 등록을 완료하였습니다.",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          navigate(`/`)
        })
        .catch((err)=>{
          toast({
            title: "공간 등록에 실패했습니다.",
            description: error.response?.data?.message || "알 수 없는 오류가 발생했습니다.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        })
        .finally()
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    sessionStorage.setItem('activeStep', (activeStep - 1).toString());
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
        <Button
          onClick={handleNext}
          colorScheme="teal"
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterStepper;