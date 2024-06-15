package com.backend.member.controller;


import com.backend.member.domain.member.Member;

import com.backend.member.service.MailService;
import com.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")

public class MemberController {
    final MailService mailService;
    final MemberService service;


    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {
        System.out.println("member 1= " + member);
        if (service.validate(member)) {
            System.out.println("member2 = " + member);
            service.addMemberByEmail(member);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value = "check", params = "email")
    public ResponseEntity checkEmail(@RequestParam String email) {

        Member member = service.checkByEmail(email);

        if (member == null && service.validateChckEmail(email)) {

            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();

    }

    @GetMapping(value = "check", params = "nickName")
    public ResponseEntity checkNickName(@RequestParam String nickName) {

        Member member = service.checkByNickName(nickName);
        System.out.println(member);
        if (member != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }


    @GetMapping(value = "e1")
    public Map<String,Object> e1(@RequestParam String mail) {


        int number = mailService.sendMail(mail);

        long expirationTime = mailService.getExpirationTime();
        return Map.of("number", number, "expirationTime", expirationTime);

    }

    @GetMapping("list")
    public List<Member> list() {

        return service.list();
    }

    @GetMapping("{memberId}")
    public ResponseEntity get(@PathVariable Integer memberId) {
        Member member = service.getById(memberId);
        if (member == null) {
            return ResponseEntity.notFound().build();
        } else {

            return ResponseEntity.ok(member);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity delete(@RequestBody Member member, Authentication authentication) {

        if (service.hasAccess(member, authentication)) {
            service.remove(member.getMemberId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping("token")
    public ResponseEntity token(@RequestBody Member member) {

        Map<String, Object> map = service.getToken(member);

        if (map == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return  ResponseEntity.ok(map);
    }


    @PutMapping("modify")
    public ResponseEntity modify(@RequestBody Member member,
                                 Authentication authentication) {
        System.out.println(member);
        System.out.println(authentication);
        if (service.hasAccessModify(member, authentication)) {
            Map<String, Object> result = service.modify(member, authentication);
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("naverlogin")
    public String processNaverLogin(@RequestBody Map<String, String> params) {
        String accessToken = params.get("access_token");

        System.out.println("params = " + params);

        // 네이버 API를 사용하여 사용자 정보 가져오기
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>("", headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(userInfoUrl, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        Map<String, Object> responseData = (Map<String, Object>) responseBody.get("response");

        String extractedEmail = (String) responseData.get("email");
        String extractedNickname = (String) responseData.get("nickname");
        String extractedNaverId = (String) responseData.get("id");

        // 사용자 정보 추출 후 Member 객체 생성
        Member member = new Member();
        member.setEmail(extractedEmail);
        member.setPassword(""); // 비밀번호는 네이버 로그인의 경우 사용하지 않음
        member.setNickname(extractedNickname);
        member.setNaverId(extractedNaverId);
        member.setInputDt(LocalDateTime.now());
        member.setAuth("USER"); // 기본 권한 설정



        // 데이터베이스에 사용자 정보 저장

        if(service.findByEmail(member.getEmail())==null){

            service.insertMember(member);

            return "success";
        }

        return "success";

    }


}
