import {Box, ChakraProvider, Flex} from "@chakra-ui/react";
import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";
import '/public/css/Home.css';
import {Outlet} from "react-router-dom";
import {useState} from "react";
import {LoginProvider} from "../component/LoginProvider.jsx";

export function Home() {

    return (
        <Flex>
            <Box flex="1">
               <Header />
                <Box>
                    <div className="content">
                        <Outlet/>
                    </div>
                </Box>
                <Footer/>
            </Box>
        </Flex>
    );
}
