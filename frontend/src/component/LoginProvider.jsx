import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [memberId, setMemberId] = useState("");
  const [expired, setExpired] = useState(0);
  const [authority, setAuthority] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    login(token);
  }, []);

  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  function isLoggedOut() {
    return Date.now() > expired * 1000;
  }


  function hasAccess(param) {
    return id == param;
  }

  function isAdmin() {
    return authority.includes("ADMIN");
  }

  function isHost() {
    return authority.includes("HOST");
  }

  function isUser() {
    return authority.includes("USER");
  }

  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setAuthority(payload.scope.split(" "));
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("com.naver.nid.oauth.state_token");
    setExpired(0);
    setId("");
    setNickname("");
    setAuthority([]);

  }

  function switchHost(){
    setAuthority(["HOST"])
  }

  function switchUser(){
    setAuthority(["USER"])

  }

  return (
    <LoginContext.Provider
      value={{
        id: id,
        nickname: nickname,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        isLoggedOut:isLoggedOut,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
        isHost: isHost,
        isUser: isUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

//아우
