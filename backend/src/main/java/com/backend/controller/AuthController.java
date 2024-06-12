package com.backend.controller;

import com.backend.domain.member.ErrorCode;
import com.backend.domain.member.Member;
import com.backend.domain.member.RestResult;
import com.backend.domain.member.RestStatus;
import com.backend.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    final MemberService memberService;


    @PostMapping("naverlogin")
    public Object naverlogin(@RequestBody Map<String, String> params, HttpSession session) {

        //    log.info("params >>> " + params.toString());  //{access_token=AAAAOK3YZUQo0huTlz-hhCJuoC8c2oqBXuNgug8SJ9b9hKMAVsrDbQFrZ1ZEsW2pGT6hw3ouHoNIF2x1BYfjUcqtDWQ, state=4b53e1ff-4b37-44f4-b857-eb93287b5f70, token_type=bearer, expires_in=3600}
        //    log.info(params.get("access_token"));

        String token = params.get("access_token"); // 네이버 로그인 접근 토큰
        String header = "Bearer " + token; // Bearer 다음에 공백 추가
        String apiURL = "https://openapi.naver.com/v1/nid/me";

        try {
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", header);

            int responseCode = con.getResponseCode();
            BufferedReader br;

            if (responseCode == 200) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));

            } else {  // 에러 발생
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String inputLine;
            StringBuffer response = new StringBuffer();

            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();
            //      log.info(response.toString()); //{"resultcode":"00","message":"success","response":{"id":"eXA1mCGXExwuGQZo9uYmxlKnXI9LLqV5E_2lSaoakeE","nickname":"bit","profile_image":"https:\/\/ssl.pstatic.net\/static\/pwe\/address\/img_profile.png","gender":"F","email":"bit@naver.com","mobile":"010-0000-0000","mobile_e164":"+821000000000","birthday":"01-19"}}

            String responseBody = response.toString();
            JSONObject jsonObject = new JSONObject(responseBody);
            JSONObject responseJson = jsonObject.getJSONObject("response");

            String nickname = responseJson.getString("nickname");
            String email = responseJson.getString("email");
            String password = UUID.randomUUID().toString();
            String link = email.contains("@naver.com") ? "naver" : "other";

            Member oldMember = memberService.checkByEmail(email);
            //      log.info("oldMember >>> " + oldMember);
            if (oldMember == null) {
                Member member = new Member();
                member.setNickName(nickname);
                member.setEmail(email);
                member.setPassword(password);
                member.setLink(link);

                memberService.add(member);
            }

            Member user = memberService.checkByEmail(email);

            if (user != null && !user.getLink().equals("naver")) {
                //       log.info("SpaceHub 회원이 네이버 계정으로 접속 시도함!");

                return new RestResult()
                        .setErrorCode(ErrorCode.rest.DUPLICATE_DATA)
                        .setStatus(String.valueOf(RestStatus.FAILURE));
            }

            session.setAttribute("loginUser", user);
            //      log.info("세선에 user 정보 입력 >>> " + user);

            return new RestResult()
                    .setStatus(String.valueOf(RestStatus.SUCCESS));

        } catch (Exception e) {
            //  log.error("네이버 로그인 중 에러 발생! : " + e);

            return new RestResult()
                    .setStatus(String.valueOf(RestStatus.FAILURE));
        }
    }

}
