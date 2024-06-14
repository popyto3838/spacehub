import React, { useState } from "react";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import axios from "axios";
import RegisterPage1 from "./RegisterPage1";
import RegisterPage2 from "./RegisterPage2";
import RegisterPage3 from "./RegisterPage3";

const steps = ["Step 1", "Step 2", "Step 3"];

const StepContent = ({ step, formData, setFormData }) => {
  switch (step) {
    case 0:
      return <RegisterPage1 formData={formData} setFormData={setFormData} />;
    case 1:
      return <RegisterPage2 formData={formData} setFormData={setFormData} />;
    case 2:
      return <RegisterPage3 formData={formData} setFormData={setFormData} />;
    default:
      return null;
  }
};

const RegisterStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    page1Data: "",
    page2Data: "",
    page3Data: "",
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleFinish();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    console.log("Finish button clicked, handle final registration here.");
    console.log("Form Data:", formData);

    // formData 객체를 구조화하여 새로운 객체 생성
    const structuredFormData = {
      spaceInfo: {
        spaceTitle: formData.nickname, // spaceTitle 에 nickname 데이터 할당
        // 다른 spaceInfo 필드 추가
      },
      spaceOptions: {
        // spaceOptions 필드 추가
      },
      // 다른 필드 추가
    };
    axios
      .post("/api/space/register", structuredFormData)
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {steps.map((label, index) => (
          <Box key={index} role="tabpanel" hidden={activeStep !== index} p={3}>
            {activeStep === index && (
              <StepContent
                step={index}
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterStepper;
