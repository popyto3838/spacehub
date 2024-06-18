import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import {Home} from "./page/Home.jsx";
import {BoardWrite} from "./page/board/BoardWrite.jsx";
import {MainPage} from "./page/MainPage.jsx";
import {BoardList} from "./page/board/BoardList.jsx";
import {BoardView} from "./page/board/BoardView.jsx";
import {BoardEdit} from "./page/board/BoardEdit.jsx";
import RegisterStepper from "./page/host/register/RegisterStepper.jsx";
import {Reserve} from "./page/Reserve.jsx";
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
import {MemberHost} from "./page/host/MemberHost.jsx";
import {HostSignup} from "./page/member/HostSignup.jsx";
import {MemberMy} from "./page/member/MemberMy.jsx";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      children: [
        {
          path: "reserve",
          element: <Reserve/>
        },
        {index: true, element: <MainPage/>},
        {path: "board/write", element: <BoardWrite/>},
        {path: "board/list", element: <BoardList/>},
        {path: "board/:boardId", element: <BoardView/>},
        {path: "board/:boardId/edit", element: <BoardEdit/>},
        {path: "space/register", element: <RegisterStepper/>},
        {path: "space/option", element: <SpaceOption/>},
        {path: "space/type", element: <SpaceType/>},
        {path: "member/signup", element: <MemberSignup/>},
        {path: "member/naver", element: <NaverLogin/>},
        {path: "member/list", element: <MemberList/>},
        {path: "member/:memberId", element: <MemberInfo/>},
        {path: "member/login", element: <MemberLogin/>},
        {path: "member/edit/:memberId", element: <MemberEdit/>},
        {path: "member/naverlogin", element: <NaverLoginHandler/>},
        {path: "member/host", element: <MemberHost/>},
         {path: "host/signup", element: <HostSignup/>},
        {path: "member/info/:accountId", element: <MemberMy/>},

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
