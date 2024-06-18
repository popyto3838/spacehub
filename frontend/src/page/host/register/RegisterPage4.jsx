import React, { useState } from "react";
import {
  Box, Flex,
  FormControl,
  FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack
} from "@chakra-ui/react";

const RegisterPage4 = ({ formData, setFormData }) => {
  const [priceInput, setPriceInput] = useState(formData.page4Data?.price || 0);
  const [capacityInput, setCapacityInput] = useState(formData.page4Data?.capacity || 0);
  const [floorInput, setFloorInput] = useState(formData.page4Data?.floor || 0);
  const [parkingSpaceInput, setParkingSpaceInput] = useState(formData.page4Data?.parkingSpace || 0);

  const handlePriceChange = (value) => setPriceInput(value);
  const handlePriceBlur = () => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}),
        price: priceInput,
      },
    });
  };

  const handleCapacityChange = (value) => setCapacityInput(value);
  const handleCapacityBlur = () => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}),
        capacity: capacityInput,
      },
    });
  };

  const handleFloorChange = (value) => setFloorInput(value);
  const handleFloorBlur = () => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}),
        floor: floorInput,
      },
    });
  };

  const handleParkingSpaceChange = (value) => setParkingSpaceInput(value);
  const handleParkingSpaceBlur = () => {
    setFormData({
      ...formData,
      page4Data: {
        ...(formData.page4Data || {}),
        parkingSpace: parkingSpaceInput,
      },
    });
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
            max={1000000}
            step={1000}
            onChange={handlePriceChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {priceInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={priceInput}
            onChange={(valueString) => handlePriceChange(Number(valueString))}
            onBlur={handlePriceBlur}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
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
            min={0}
            max={100}
            step={1}
            onChange={handleCapacityChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {capacityInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={capacityInput}
            onChange={(valueString) => handleCapacityChange(Number(valueString))}
            onBlur={handleCapacityBlur}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
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
            min={0}
            max={50}
            step={1}
            onChange={handleFloorChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {floorInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={floorInput}
            onChange={(valueString) => handleFloorChange(Number(valueString))}
            onBlur={handleFloorBlur}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
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
            max={50}
            step={1}
            onChange={handleParkingSpaceChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px">
              {parkingSpaceInput}
            </SliderThumb>
          </Slider>
          <NumberInput
            maxW="120px"
            ml="2rem"
            value={parkingSpaceInput}
            onChange={(valueString) => handleParkingSpaceChange(Number(valueString))}
            onBlur={handleParkingSpaceBlur}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </FormControl>
    </Box>
  );
};

export default RegisterPage4;
