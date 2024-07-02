import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Home } from "./page/Home.jsx";
import { BoardWrite } from "./page/board/BoardWrite.jsx";
import { MainPage } from "./page/MainPage.jsx";
import { BoardList } from "./page/board/BoardList.jsx";
import { BoardView } from "./page/board/BoardView.jsx";
import { BoardEdit } from "./page/board/BoardEdit.jsx";
import RegisterStepper from "./page/space/register/RegisterStepper.jsx";
import { SpaceOption } from "./page/admin/space_config/SpaceOption.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import NaverLogin from "./page/member/NaverLogin.jsx";
import { MemberList } from "./page/member/MemberList.jsx";
import { MemberInfo } from "./page/member/MemberInfo.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { NaverLoginHandler } from "./page/member/NaverLoginHandler.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import { SpaceType } from "./page/admin/space_config/SpaceType.jsx";
import { HostCenter } from "./page/host/HostCenter.jsx";
import { HostSignup } from "./page/member/HostSignup.jsx";
import { MemberMy } from "./page/member/MemberMy.jsx";
import SpaceView from "./page/space/SpaceView.jsx";
import AdminDashboard from "./page/admin/AdminDashboard.jsx";
import { MemberHostInfo } from "./page/member/MemberHostInfo.jsx";
import { MemberHostPage } from "./page/member/MemberHostPage.jsx";
import MyReservationList from "./page/member/MyReservationList.jsx";
import HostReservationList from "./page/member/HostReservationList.jsx";
import MyFavoritesList from "./page/member/MyFavoritesList.jsx";
import MyPaymentList from "./page/paid/MyPaymentList.jsx";
import HostCenterSpaceList from "./page/host/HostCenterSpaceList.jsx";
import "../public/css/ReactQuill.css";
import { HostCenterReviewAndQna } from "./page/host/HostCenterReviewAndQna.jsx";

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

const theme = extendTheme({
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: {
      body: {
        lineHeight: "1.8",
      },
    },
  },
});

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        { index: true, element: <MainPage /> },
        { path: "board/write", element: <BoardWrite /> },
        { path: "board/list", element: <BoardList /> },
        { path: "board/:boardId", element: <BoardView /> },
        { path: "board/:boardId/edit", element: <BoardEdit /> },
        { path: "space/register", element: <RegisterStepper /> },
        { path: "space/edit/:spaceId", element: <RegisterStepper /> },
        { path: "space/option", element: <SpaceOption /> },
        { path: "space/:spaceId", element: <SpaceView /> },
        { path: "space/type", element: <SpaceType /> },
        { path: "member/signup", element: <MemberSignup /> },
        { path: "member/naver", element: <NaverLogin /> },
        { path: "member/list", element: <MemberList /> },
        { path: "member/:memberId", element: <MemberInfo /> },
        { path: "member/login", element: <MemberLogin /> },
        { path: "member/edit/:memberId", element: <MemberEdit /> },
        { path: "auth/naverlogin", element: <NaverLoginHandler /> },
        { path: "paid/myPaymentList", element: <MyPaymentList /> },
        { path: "member/naverlogin", element: <NaverLoginHandler /> },
        { path: "host/dashboard", element: <HostCenter /> },
        { path: "host/signup", element: <HostSignup /> },
        { path: "member/info/:accountId", element: <MemberMy /> },
        { path: "dashboard/admin", element: <AdminDashboard /> },
        { path: "member/hostinfo/:accountId", element: <MemberHostInfo /> },
        { path: "member/hostpage", element: <MemberHostPage /> },
        {
          path: "member/myReservationList/:memberId",
          element: <MyReservationList />,
        },
        {
          path: "member/hostReservationList/:spaceId",
          element: <HostReservationList />,
        },
        {
          path: "member/MyFavoritesList",
          element: <MyFavoritesList />,
        },
        { path: "host/spaceList", element: <HostCenterSpaceList /> },
        {
          path: "member/reviews/:division",
          element: <HostCenterReviewAndQna />,
        },
      ],
    },
  ]);
  return (
    <>
      <LoginProvider>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </LoginProvider>
    </>
  );
}

export default App;
