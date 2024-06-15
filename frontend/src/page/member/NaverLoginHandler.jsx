import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import {useToast} from "@chakra-ui/react";


export const NaverLoginHandler = () => {
  // useHistory 훅을 사용해 history 객체를 가져옵니다. 이 객체를 사용하여 라우터 내에서 리다이렉션을 수행할 수 있습니다.
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    console.log("hello")
    const processNaverLogin = async () => {
      // URL의 해시 부분에서 query parameter들을 추출합니다. 이 값들은 access_token, state, token_type, expires_in과 같은 인증 관련 정보를 포함합니다.
      const queryParams = window.location.hash.substring(1).split("&");
      console.log(queryParams);
      const params = {};
       console.log(window.location); //Location {ancestorOrigins: DOMStringList, href: 'http://localhost:3000/auth/naverLogin#access_token…57-eb93287b5f70&token_type=bearer&expires_in=3600', origin: 'http://localhost:3000', protocol: 'http:', host: 'localhost:3000', …}
      // console.log(window.location.hash); //#access_token=AAAAOJ2B7*************&state=4b53e1ff-4b37-44f4-b857-eb93287b5f70&token_type=bearer&expires_in=3600
      // console.log(queryParams); //['access_token=AAAAOJ2B7*************', 'state=4b53e1ff-4b37-44f4-b857-eb93287b5f70', 'token_type=bearer', 'expires_in=3600']

      queryParams.forEach((param) => {
        const [key, value] = param.split("=");
        params[key] = value;
      });
      console.log(params)

      try {
        const response = await axios.post(
          "/api/member/naverlogin",
          params,
        );

        // console.log("서버에서 naverLogin 응답 옴!");
        // console.log(response);

        if (response.data.status === "failure") {
          if (response.data.errorCode == "502") {
            alert("Spacehub 계정으로 로그인 하세요");
          }
        }
        window.location.href = "/";
      } catch (error) {
        console.error("서버에서 naverlogin 에러 옴!");
        console.error(error);
      }
    };

    processNaverLogin();
    toast({
      status: "success",
      description:"네이버로 로그인되었습니다.",
      position:"top"
    })
  }, []);

  return <div>Processing Naver Login...</div>;
};
