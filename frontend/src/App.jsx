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

function App() {
  return (
    <LoginProvider>
      <ChakraProvider>
        <RouterProvider router={router} />;
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
