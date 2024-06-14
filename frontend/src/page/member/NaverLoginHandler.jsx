import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";


export const NaverLoginHandler = () => {
  // useHistory 훅을 사용해 history 객체를 가져옵니다. 이 객체를 사용하여 라우터 내에서 리다이렉션을 수행할 수 있습니다.
  const navigate = useNavigate();

  useEffect(() => {
    const processNaverLogin = async () => {
      // URL의 해시 부분에서 query parameter들을 추출합니다. 이 값들은 access_token, state, token_type, expires_in과 같은 인증 관련 정보를 포함합니다.
      const queryParams = window.location.hash.substring(1).split("&");
      const params = {};
      // console.log(window.location); //Location {ancestorOrigins: DOMStringList, href: 'http://localhost:3000/auth/naverLogin#access_token…57-eb93287b5f70&token_type=bearer&expires_in=3600', origin: 'http://localhost:3000', protocol: 'http:', host: 'localhost:3000', …}
      // console.log(window.location.hash); //#access_token=AAAAOJ2B7*************&state=4b53e1ff-4b37-44f4-b857-eb93287b5f70&token_type=bearer&expires_in=3600
      // console.log(queryParams); //['access_token=AAAAOJ2B7*************', 'state=4b53e1ff-4b37-44f4-b857-eb93287b5f70', 'token_type=bearer', 'expires_in=3600']

      queryParams.forEach((param) => {
        const [key, value] = param.split("=");
        params[key] = value;
      });

      try {
        const response = await axios.post(
          "http://localhost:5173/api/member/naverlogin",
          params,
        );

        // console.log("서버에서 naverLogin 응답 옴!");
        // console.log(response);

        if (response.data.status === "success") {
          localStorage.setItem("token", response.data.token);
          navigate("/");
        } else {
          alert("로그인 실패: " + response.data.message);
        }
      } catch (error) {
        console.error("Error processing Naver login:", error);
      }
    };

    processNaverLogin();
  }, []);

  return <div>Processing Naver Login...</div>;
};
