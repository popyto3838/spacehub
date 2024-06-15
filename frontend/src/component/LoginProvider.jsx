import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
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

  function hasAccess(param) {
    return id == param;
  }

  function isAdmin() {
  }

  function isSupplier() {
  }

  function isBuyer() {
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
    setAuthority([]);
  }

  return (
    <LoginContext.Provider
      value={{
        id: id,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
        isSupplier: isSupplier,
        isBuyer: isBuyer,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

//아우
