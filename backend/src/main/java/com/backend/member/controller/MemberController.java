package com.backend.member.controller;


import com.backend.board.domain.Board;
import com.backend.member.domain.member.Host;
import com.backend.member.domain.member.Member;
import com.backend.member.service.MailService;
import com.backend.member.service.MemberService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
@Log4j2
public class MemberController {
    final MailService mailService;
    final MemberService service;


    @Autowired
    private JwtEncoder jwtEncoder;


    @PostMapping("hostsignup")
    public ResponseEntity hostsignup(@RequestBody Member member) {

        if (service.validate(member)) {

            service.addHostMemberByEmail(member);

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

    @GetMapping(value = "check", params = "nickname")
    public ResponseEntity checkNickName(@RequestParam String nickname) {

        Member member = service.checkByNickName(nickname);
        System.out.println(member);
        if (member != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }


    @GetMapping(value = "e1")
    public Map<String, Object> e1(@RequestParam String mail) throws MessagingException {


        int number = mailService.sendMail(mail);

        long expirationTime = mailService.getExpirationTime();

        return Map.of("number", number, "expirationTime", expirationTime);

    }

    @GetMapping("list")
    public List<Member> list() {

        return service.list();
    }

    @GetMapping("/{memberId}")
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
        return ResponseEntity.ok(map);
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
    public ResponseEntity<Map<String, Object>> processNaverLogin(@RequestBody Map<String, String> params) {
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
        System.out.println("responseBody = " + responseBody);
        Map<String, Object> responseData = (Map<String, Object>) responseBody.get("response");

        System.out.println("responseData = " + responseData);

        String extractedEmail = (String) responseData.get("email");
        String extractedNickname = (String) responseData.get("nickname");
        String extractedNaverId = (String) responseData.get("id");
        String extractedMobile = (String) responseData.get("mobile");
        String extractedProfileImage = (String) responseData.get("profile_image");

        // 사용자 정보 추출 후 Member 객체 생성
        Member member = new Member();
        member.setEmail(extractedEmail);
        System.out.println("extractedEmail = " + extractedEmail);
        member.setPassword(""); // 비밀번호는 네이버 로그인의 경우 사용하지 않음
        member.setNickname(extractedNickname);
        member.setNaverId(extractedNaverId);
        member.setMobile(extractedMobile);
        member.setProfileImage(extractedProfileImage);
        member.setInputDt(LocalDateTime.now());
        member.setAuth("USER"); // 기본 권한 설정


        // 데이터베이스에 사용자 정보 저장
        if (service.findByEmail(member.getEmail()) == null) {
            System.out.println("member = " + member);
            service.insertMember(member);

            System.out.println("member.getMemberId() = " + member.getMemberId());
            member.setMemberId(service.selectbyEmail2(member));

        }

        member.setMemberId(service.selectbyEmail2(member));

        System.out.println("member.getMemberId()= " + member.getMemberId());

        // JWT 토큰 생성
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                .subject(member.getMemberId().toString())
                .claim("scope", member.getAuth())
                .claim("nickname", member.getNickname())
                .build();

        String jwtToken = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        // 클라이언트에 토큰 반환
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("token", jwtToken);

        return ResponseEntity.ok(result);

    }


    @PutMapping("host")
    public ResponseEntity host(@RequestBody Member member, Authentication authentication) {
        System.out.println("member = " + member);
        Map<String, Object> map = service.switchHost(member);

        return ResponseEntity.ok(map);
    }

    @PutMapping("user")
    public ResponseEntity user(@RequestBody Member member, Authentication authentication) {
        System.out.println("member = " + member);
        Map<String, Object> map= service.switchUser(member);
        return ResponseEntity.ok(map);
    }


    @PostMapping("account")
    public ResponseEntity account(@RequestBody Host host) {
        System.out.println("host = " + host);
        if (service.validateAccount(host)) {

            service.addAccountinfo(host);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("accountEdit")
    public ResponseEntity accountEdit(@RequestBody Host host) {
        System.out.println("host = " + host);
        if (service.validateAccount(host)) {

            service.EditAccountinfo(host);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping(value = "p1")
    public Map<String, Object> p1(@RequestParam String mobile) {
        long expirationTime;
        Random rnd = new Random();
        StringBuilder buffer = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            buffer.append(rnd.nextInt(10));
        }
        expirationTime = System.currentTimeMillis() + 5 * 60 * 1000;

        String verificationCode = buffer.toString();

        service.certifiedPhoneNumber(mobile, verificationCode);

        Map<String, Object> response = new HashMap<>();
        response.put("verificationCode", verificationCode);
        response.put("expirationTime", expirationTime);

        return response;
    }


    @PostMapping("hostInfo")
    public ResponseEntity hostInfo(@RequestBody Host host) {
        service.addhostInfo(host);

        return ResponseEntity.ok().build();
    }

    @PostMapping("hostInfoEdit")
    public ResponseEntity hostInfoEdit(@RequestBody Host host) {
        System.out.println("host = " + host);
        service.EdithostInfo(host);

        return ResponseEntity.ok().build();
    }

    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {

        if (service.validate(member)) {

            service.addMemberByEmail(member);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("nullcheck")
    public ResponseEntity nullcheck(@RequestBody Host host) {
        System.out.println("host = " + host);
        System.out.println("host = " + host);
        Map<String, Object> map = service.checkHostInfo(host);
        return ResponseEntity.ok(map);
    }

    @GetMapping("findemail")
    public ResponseEntity<String> findemail(@RequestParam("mobile") String mobile) {
        Member member = service.emailByMobile(mobile);

        String email = member.getEmail();

        return ResponseEntity.ok(email);
    }

    @GetMapping("findPassword")
    public ResponseEntity<String> findPassword(@RequestParam("mobile") String mobile) {
        Member member = service.MemberIdByMobile(mobile);

        String memberId = String.valueOf(member.getMemberId());

        return ResponseEntity.ok(memberId);
    }

    @PutMapping("modifyPassword")
    public ResponseEntity modifyPassword(@RequestBody Member member) {
        System.out.println("member = " + member);

        service.modifyPassword(member);
        return ResponseEntity.ok().build();

    }

    @PostMapping("profile")
    public void modifyProfile(Member member, @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        System.out.println("member.getMemberId() = " + member.getMemberId());
        System.out.println("member = " + member);
        System.out.println("files = " + files);

        service.modifyProfile(member, files);

    }


    @GetMapping("gethost")
    public ResponseEntity getHost(@RequestParam("memberId") String memberId) {

        Host host = service.findHostByMemberId(memberId);

        return ResponseEntity.ok(host);
    }

}
