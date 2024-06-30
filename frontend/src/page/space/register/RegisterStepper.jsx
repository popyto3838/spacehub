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
  const [isEdit, setIsEdit] = useState(!!spaceId);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    files: [],
    options: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (spaceId) {
      setIsEdit(true);
      setIsLoading(true);
      axios.get(`/api/space/${spaceId}`)
        .then((res) => {
          const spaceData = res.data.space;
          const spaceImgFiles = res.data.spaceImgFiles.map(file => ({
            id: file.fileId,
            name: file.fileName,
            url: file.fileUrl || file.fileName // Ensure the URL is used
          }));
          setFormData({
            ...initialFormData,
            ...spaceData,
            files: spaceImgFiles,
            options: res.data.optionList.map(option => option.optionListId),
          });
          setIsLoading(false);
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
          setIsLoading(false);
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

    const { files, options, ...spaceData } = formData;
    formDataToSend.append('space', JSON.stringify(spaceData));

    formDataToSend.append('optionList', JSON.stringify(options));

    files.forEach(fileObj => {
      if (!deletedFiles.includes(fileObj.id)) {
        if (fileObj.file) {
          formDataToSend.append('files', fileObj.file);
        }
      }
    });

    newFiles.forEach(file => {
      formDataToSend.append('files', file);
    });

    if (isEdit) {
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
    // 필요한 유효성 검사 로직 구현
    return false;
  };

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
