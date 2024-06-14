import {Box, Flex} from "@chakra-ui/react";
import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";
import '/public/css/Home.css';
import Content from "../common/Content.jsx";

export function Home() {
  return (
    <Flex>
      <Box flex="1">
        <Header></Header>
        <Box>
          <Content></Content>
          <Footer/>
        </Box>
      </Box>
    </Flex>
  );
}
