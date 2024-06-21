import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import {Home} from "./page/Home.jsx";
import {BoardWrite} from "./page/board/BoardWrite.jsx";
import {MainPage} from "./page/MainPage.jsx";
import {BoardList} from "./page/board/BoardList.jsx";
import {BoardView} from "./page/board/BoardView.jsx";
import {BoardEdit} from "./page/board/BoardEdit.jsx";
import RegisterStepper from "./page/host/register/RegisterStepper.jsx";
import {SpaceOption} from "./page/admin/space_config/SpaceOption.jsx";
import {MemberSignup} from "./page/member/MemberSignup.jsx";
import NaverLogin from "./page/member/NaverLogin.jsx";
import {MemberList} from "./page/member/MemberList.jsx";
import {MemberInfo} from "./page/member/MemberInfo.jsx";
import {MemberLogin} from "./page/member/MemberLogin.jsx";
import {MemberEdit} from "./page/member/MemberEdit.jsx";
import {NaverLoginHandler} from "./page/member/NaverLoginHandler.jsx";
import {LoginProvider} from "./component/LoginProvider.jsx";
import {SpaceType} from "./page/admin/space_config/SpaceType.jsx";
import Payment from "./page/paid/Payment.jsx";
import {MemberHost} from "./page/host/MemberHost.jsx";
import {HostSignup} from "./page/member/HostSignup.jsx";
import {MemberMy} from "./page/member/MemberMy.jsx";

import axios from "axios";
import SpaceView from "./page/admin/space_config/SpaceView.jsx";
import {MemberHostInfo} from "./page/member/MemberHostInfo.jsx";


// axios interceptor 설정
axios.interceptors.request.use((config) => {
  // 토큰을 얻어서
  const token = localStorage.getItem("token");
  // 토큰이 있으면
  if (token) {
    // header에 authorization을 넣고
    config.headers.Authorization = `Bearer ${token}`;
  }
  // config를 리턴
  return config;
});
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      children: [
        {index: true, element: <MainPage/>},
        {path: "board/write", element: <BoardWrite/>},
        {path: "board/list", element: <BoardList/>},
        {path: "board/:boardId", element: <BoardView/>},
        {path: "board/:boardId/edit", element: <BoardEdit/>},
        {path: "space/register", element: <RegisterStepper/>},
        {path: "space/option", element: <SpaceOption/>},
        {path: "space/:spaceId", element: <SpaceView/>},
        {path: "space/type", element: <SpaceType/>},
        {path: "member/signup", element: <MemberSignup/>},
        {path: "member/naver", element: <NaverLogin/>},
        {path: "member/list", element: <MemberList/>},
        {path: "member/:memberId", element: <MemberInfo/>},
        {path: "member/login", element: <MemberLogin/>},
        {path: "member/edit/:memberId", element: <MemberEdit/>},
        {path: "auth/naverlogin", element: <NaverLoginHandler/>},
        {path: "paid/payment/:reservationId", element: <Payment/>},
        {path: "member/naverlogin", element: <NaverLoginHandler/>},
        {path: "member/host", element: <MemberHost/>},
        {path: "host/signup", element: <HostSignup/>},
        {path: "member/info/:accountId", element: <MemberMy/>},
        {path: "member/hostinfo/:accountId", element: <MemberHostInfo/>},
      ],
    },
  ]);
  return (
    <>
      <LoginProvider>
        <ChakraProvider>
          <RouterProvider router={router}/>
        </ChakraProvider>
      </LoginProvider>
    </>
  );
}


export default App;
