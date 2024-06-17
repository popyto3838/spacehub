import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react';
import RegisterPage1 from "./RegisterPage1.jsx";
import RegisterPage2 from "./RegisterPage2.jsx";
import RegisterPage3 from "./RegisterPage3.jsx";

// Stepper steps definition
const steps = [
  { title: 'Step 1', description: '공간 소개' },
  { title: 'Step 2', description: '상세 정보' },
  { title: 'Step 3', description: '규칙 설정' },
];

const StepContent = ({ step, formData, setFormData}) => {
  switch (step) {
    case 0:
      return <><RegisterPage1 formData={formData} setFormData={setFormData}/></>;
    case 1:
      return <><RegisterPage2/></>;
    case 2:
      return <><RegisterPage3/></>;
    default:
      return null;
  }
};

const RegisterStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    location: '',
    // 다른 폼 데이터 초기화
  })
  const { steps: chakraSteps } = useSteps({ initialStep: activeStep });

  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    const savedStep = localStorage.getItem('activeStep');

    // 로컬 스토리지에서 상태 복원
    if (savedStep) {
      setFormData(JSON.parse(savedFormData));
    }
    if (savedStep) {
      setActiveStep(parseInt(savedStep, 10));
    }
  }, []);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  // 스텝 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('activeStep', activeStep);
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Handle form submission here
      alert('Form submitted');
      // 폼 제출 후 로컬 스토리지 초기화
      localStorage.removeItem('formData');
      localStorage.removeItem('activeStep');
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

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
        <StepContent step={activeStep} />
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
