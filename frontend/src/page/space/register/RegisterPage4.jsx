import React, {useState} from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

const RegisterPage4 = ({formData, setFormData}) => {
  const [priceInput, setPriceInput] = useState(formData?.price || 0);
  const [capacityInput, setCapacityInput] = useState(formData?.capacity || 0);
  const [floorInput, setFloorInput] = useState(formData?.floor || 0);
  const [parkingSpaceInput, setParkingSpaceInput] = useState(formData?.parkingSpace || 0);

  const handlePriceChange = (valueString) => {
    const value = Number(valueString);
    setPriceInput(value);
    setFormData({...formData, price: value});
  };

  const handleCapacityChange = (valueString) => {
    const value = Number(valueString);
    setCapacityInput(value);
    setFormData({...formData, capacity: value});
  };

  const handleFloorChange = (valueString) => {
    const value = Number(valueString);
    setFloorInput(value);
    setFormData({...formData, floor: value});
  };

  const handleParkingSpaceChange = (valueString) => {
    const value = Number(valueString);
    setParkingSpaceInput(value);
    setFormData({...formData, parkingSpace: value});
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-price">시간 당 가격</FormLabel>
        <Flex>
          <Slider
            flex="1"
            value={priceInput}
            min={0}
            max={300000}
            step={1000}
            onChange={handlePriceChange}
            onFocus={(e) => e.target.select()}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack/>
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {priceInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={priceInput}
            onChange={handlePriceChange}
          >
            <NumberInputField/>
            <NumberInputStepper>
              <NumberIncrementStepper/>
              <NumberDecrementStepper/>
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-capacity">수용 인원</FormLabel>
        <Flex>
          <Slider
            flex="1"
            value={capacityInput}
            min={1}
            max={30}
            step={1}
            onChange={handleCapacityChange}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack/>
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {capacityInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={capacityInput}
            onChange={handleCapacityChange}
          >
            <NumberInputField/>
            <NumberInputStepper>
              <NumberIncrementStepper/>
              <NumberDecrementStepper/>
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-floor">층 수</FormLabel>
        <Flex>
          <Slider
            flex="1"
            value={floorInput}
            min={-10}
            max={30}
            step={1}
            onChange={handleFloorChange}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack/>
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {floorInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={floorInput}
            onChange={handleFloorChange}
          >
            <NumberInputField/>
            <NumberInputStepper>
              <NumberIncrementStepper/>
              <NumberDecrementStepper/>
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-parkingSpace">주차가능 차량 수</FormLabel>
        <Flex>
          <Slider
            flex="1"
            value={parkingSpaceInput}
            min={0}
            max={5}
            step={1}
            onChange={handleParkingSpaceChange}
            focusThumbOnChange={false}
          >
            <SliderTrack>
              <SliderFilledTrack/>
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {parkingSpaceInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={parkingSpaceInput}
            onChange={handleParkingSpaceChange}
          >
            <NumberInputField/>
            <NumberInputStepper>
              <NumberIncrementStepper/>
              <NumberDecrementStepper/>
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </FormControl>
    </Box>
  );
};

export default RegisterPage4;