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
import RegisterPage4 from "./RegisterPage4.jsx";
import RegisterPage5 from "./RegisterPage5.jsx";

// Stepper steps definition
const steps = [
  {title: 'Step 1', description: '공간 소개'},
  {title: 'Step 2', description: '상세 정보'},
  {title: 'Step 3', description: '규칙 설정'},
  {title: 'Step 4', description: '숫자 설정'},
  {title: 'Step 5', description: '사진 등록'},
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
    default:
      return null;
  }
};

const RegisterStepper = () => {
  const [activeStep, setActiveStep] = useState(() => {
    const storedStep = sessionStorage.getItem('activeStep');
    return storedStep ? parseInt(storedStep) : 0;
  });

  const [formData, setFormData] = useState(() => {
    const storedData = sessionStorage.getItem('formData');
    return storedData
      ? JSON.parse(storedData)
      : {
        page1Data: {
          type: '',
          title: '',
          subTitle: '',
        },
        page2Data: {
          location: '',
        },
        page3Data: {
          introduce: '',
          facility: '',
          notice: '',
        },
        page4Data: {
          price: '',
          capacity: '',
          floor: '',
          parkingSpace: '',
        },
      };
  });

  const {steps: chakraSteps} = useSteps({initialStep: activeStep});

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      sessionStorage.setItem('activeStep', (activeStep + 1).toString());
    } else {
      // Form submission 완료 후 sessionStorage 초기화
      sessionStorage.removeItem('formData');
      sessionStorage.removeItem('activeStep');
      alert('Form submitted');
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