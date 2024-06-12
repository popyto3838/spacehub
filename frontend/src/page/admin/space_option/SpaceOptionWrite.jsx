import {Box, FormControl, FormLabel, Input} from "@chakra-ui/react";

export function SpaceOptionWrite() {

  return <>
    <Box>공간 옵션 등록 페이지</Box>
    <Box>
      <FormControl >
        <FormLabel>공간 옵션명</FormLabel>
        <Input />
      </FormControl>
    </Box>
  </>;
}
