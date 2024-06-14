import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { BoardList } from "./page/board/BoardList.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { NaverLogin } from "./page/member/NaverLogin.jsx";

import { MemberList } from "./page/member/MemberList.jsx";
import { MemberInfo } from "./page/member/MemberInfo.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { NaverLoginHandler } from "./page/member/NaverLoginHandler.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <BoardList />,
      },
      { path: "member/signup", element: <MemberSignup /> },
      { path: "member/naver", element: <NaverLogin /> },
      { path: "member/list", element: <MemberList /> },
      { path: "member/:memberId", element: <MemberInfo /> },
      { path: "member/login", element: <MemberLogin /> },
      { path: "member/edit/:memberId", element: <MemberEdit /> },
      { path: "/auth/naverlogin", element: <NaverLoginHandler /> },
    ],
  },
]);

import {ChakraProvider} from "@chakra-ui/react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./page/Home.jsx";
import RegisterStepper from "./page/host/register/RegisterStepper.jsx";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@mui/material";
import {Reserve} from "./page/Reserve.jsx";
import {SpaceOption} from "./page/admin/space_config/SpaceOption.jsx";
import {SpaceOptionWrite} from "./page/admin/space_config/SpaceOptionWrite.jsx";
import {SpaceOptionList} from "./page/admin/space_config/SpaceOptionList.jsx";

// MUI 테마 설정
const theme = createTheme();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      children: [
        {
          path: "reserve",
          element: <Reserve/>,
        },
        {},
      ],
    },
    {path: "space/register", element: <RegisterStepper/>},
    {path: "space/option", element: <SpaceOption/>},
    // {path: "space/option/write", element: <SpaceOptionWrite/>},
    // {path: "space/option/list", element: <SpaceOptionList/>}
  ]);

  return (
    <LoginProvider>
      <ChakraProvider>
        <RouterProvider router={router} />;
      </ChakraProvider>
    </LoginProvider>
  );
    <>
      <ThemeProvider theme={theme}>
        <ChakraProvider>
          <RouterProvider router={router}/>
        </ChakraProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
