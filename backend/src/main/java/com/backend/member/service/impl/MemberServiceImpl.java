package com.backend.member.service.impl;


import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;
import org.json.simple.JSONObject;

import com.backend.member.domain.member.Host;
import com.backend.member.domain.member.Member;
import com.backend.member.mapper.MemberMapper;
import com.backend.member.service.MemberService;
import com.backend.board.mapper.BoardMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

    final MemberMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final BoardMapper boardMapper;


    @Override
    public Member checkByEmail(String email) {
        return mapper.checkByEmail(email);
    }

    @Override
    public Member checkByNickName(String nickname) {
        return mapper.checkBynickName(nickname);
    }

    @Override
    public boolean validate(Member member) {

        System.out.println(member.getEmail());
        if (member.getEmail() == null || member.getEmail().isBlank()) {
            return false;
        }
        if (member.getNickname() == null || member.getNickname().isBlank()) {
            return false;
        }
        if (member.getPassword() == null || member.getPassword().isBlank()) {
            return false;
        }


        return true;
    }

    @Override
    public boolean validateChckEmail(String email) {
        String emailpattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

        if (!email.trim().matches(emailpattern)) {
            return false;
        }
        return true;
    }

    @Override
    public List<Member> list() {
        return mapper.list();
    }

    @Override
    public Member getById(int memberId) {
        return mapper.selectById(memberId);
    }

    @Override
    public boolean hasAccess(Member member, Authentication authentication) {

        if (!member.getMemberId().toString().equals(authentication.getName())) {
            return false;
        }

        Member dbMember = mapper.selectById(member.getMemberId());
        System.out.println("dbMember = " + dbMember);

        if (dbMember == null) {
            return false;

        }

        return passwordEncoder.matches(member.getPassword(), dbMember.getPassword());

    }

    @Override
    public void remove(Integer memberId) {

        // 회원탈퇴시 좋아요 테이블 먼저 삭제
        boardMapper.deleteLikeByMemberId(memberId);

        mapper.deleteById(memberId);
    }

    @Override
    public Map<String, Object> getToken(Member member) {
        Map<String, Object> result = null;

        Member db = mapper.selectByEmail(member.getEmail());

        if (db != null) {
            System.out.println("db = " + db.getWithdrawn());
            if (!db.getWithdrawn().toString().equals("Y")) {
                if (passwordEncoder.matches(member.getPassword(), db.getPassword())) {

                    result = new HashMap<>();
                    String token = "";
                    Instant now = Instant.now();

                    List<String> authority = mapper.selectAuthorityByMemberId(db.getMemberId());

                    String authorityString = authority.stream()
                            .collect(Collectors.joining(" "));

                    System.out.println(authorityString);

                    // https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/jwt/login/src/main/java/example/web/TokenController.java
                    JwtClaimsSet claims = JwtClaimsSet.builder()
                            .issuer("self")
                            .issuedAt(now)
                            .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                            .subject(db.getMemberId().toString())
                            .claim("scope", authorityString) // 권한
                            .claim("nickname", db.getNickname())
                            .claim("email", db.getEmail())
//                            .claim("mobile", db.getMobile())
                            .build();

                    token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                    result.put("token", token);

                }
            }
        }

        return result;
    }


    @Override
    public boolean hasAccessModify(Member member, Authentication authentication) {
        if (!authentication.getName().equals(member.getMemberId().toString())) {
            return false;
        }

        Member dbMember = mapper.selectById(member.getMemberId());
        if (dbMember == null) {
            return false;
        }

        if (!passwordEncoder.matches(member.getOldPassword(), dbMember.getPassword())) {
            return false;
        }

        return true;
    }

    @Override
    public Map<String, Object> modify(Member member, Authentication authentication) {
        if (member.getPassword() != null && member.getPassword().length() > 0) {

            member.setPassword(passwordEncoder.encode(member.getPassword()));
        } else {
            Member dbMember = mapper.selectById(member.getMemberId());
            member.setPassword(dbMember.getPassword());
        }
        mapper.update(member);

        String token = "";

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);
        jwtClaimsSetBuilder.claim("nickname", member.getNickname());

        JwtClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();
        token = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
        return Map.of("token", token);
    }

    @Override
    public void addMemberByEmail(Member member) {

        member.setPassword(passwordEncoder.encode(member.getPassword()));
        member.setEmail(member.getEmail().trim());
        member.setNickname(member.getNickname().trim());
        member.setMobile(member.getMobile().trim());

        mapper.insert(member);


    }

    @Override
    public void addHostMemberByEmail(Member member) {

        member.setPassword(passwordEncoder.encode(member.getPassword()));
        member.setEmail(member.getEmail().trim());
        member.setNickname(member.getNickname().trim());

        mapper.inserthost(member);


    }


    @Override
    public Member findByEmail(String email) {
        return mapper.findByEmail(email);
    }

    @Override
    public void insertMember(Member member) {
        mapper.insertMember(member);
    }

    @Override
    public Integer selectbyEmail2(Member member) {
        return mapper.selectByEmail2(member);
    }

    @Override
    public Map<String, Object> switchHost(Member member) {

        mapper.switchHost(member);

        Map<String, Object> result = new HashMap<>();

        String token = "";
        Instant now = Instant.now();

        List<String> authority = mapper.selectAuthorityByMemberId(member.getMemberId());

        String authorityString = authority.stream()
                .collect(Collectors.joining(" "));

        System.out.println(authorityString);

        // https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/jwt/login/src/main/java/example/web/TokenController.java
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                .subject(member.getMemberId().toString())
                .claim("scope", authorityString) // 권한
                .claim("nickname", mapper.getNickNameByMemberId(member))
                .claim("email", mapper.getEmailBbyMemberId(member))
                .claim("mobile", mapper.getMobileByMemberId(member))
                .build();

        token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        result.put("token", token);

        return result;
    }

    ;

    @Override
    public Map<String, Object> switchUser(Member member) {
        mapper.switchUser(member);

        Map<String, Object> result = new HashMap<>();

        String token = "";
        Instant now = Instant.now();

        List<String> authority = mapper.selectAuthorityByMemberId(member.getMemberId());

        String authorityString = authority.stream()
                .collect(Collectors.joining(" "));

        System.out.println(authorityString);

        // https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/jwt/login/src/main/java/example/web/TokenController.java
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                .subject(member.getMemberId().toString())
                .claim("scope", authorityString) // 권한
                .claim("nickname", mapper.getNickNameByMemberId(member))
                .claim("email", mapper.getEmailBbyMemberId(member))
                .claim("mobile", mapper.getMobileByMemberId(member))
                .build();

        token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        result.put("token", token);

        return result;
    }

    ;

    @Override
    public boolean validateAccount(Host host) {
        if (host.getBankName() == null || host.getBankName().isBlank()) {
            return false;
        }
        if (host.getAccountNumber() == null || host.getAccountNumber().isBlank()) {
            return false;
        }
        return true;

    }

    @Override
    public void addAccountinfo(Host host) {

        mapper.insertAccount(host);
    }

    @Override
    public void certifiedPhoneNumber(String mobile, String verificationCode) {
        String api_key = "NCSTIPYRXIFUD7GF";
        String api_secret = "HKLXCD3ZJMT8KJ5UV38WBEOLTQ7U01YA";

        Message coolsms = new Message(api_key, api_secret);
        HashMap<String, String> params = new HashMap<String, String>();
        params.put("to", mobile); // 수신전화번호
        params.put("from", "010-6679-1273"); // 발신전화번호. 테스트시에는 발신,수신 둘다 본인 번호로 하면 됨
        params.put("type", "SMS");
        params.put("text", "[BitMovie] 문자 본인인증 서비스 : 인증번호는 " + "[" + verificationCode + "]" + " 입니다.");
        params.put("SpaceHub", "test app 1.2"); // application name and version

        try {
            JSONObject obj = (JSONObject) coolsms.send(params);
            System.out.println(obj.toString());
        } catch (CoolsmsException e) {
            System.out.println(e.getMessage());
            System.out.println(e.getCode());
        }


    }

    ;


    @Override
    public void addhostInfo(Host host) {
        mapper.addHostInfo(host);
    }

    ;

    @Override
    public Map<String, Object> checkHostInfo(Host host) {
        Map<String, Object> result = new HashMap<>();

        result.put("key1", mapper.checkHostRep(host));
        result.put("key2", mapper.checkHostBusinessNumber(host));
        result.put("key3", mapper.checkHostBusinessName(host));

        return result;
    }

    ;

    @Override
    public Member emailByMobile(String mobile) {
        return mapper.emailByMobile(mobile);
    }

    @Override
    public Member MemberIdByMobile(String mobile) {
        return mapper.memberIdByMobile(mobile);
    }

    ;

    @Override
    public Integer findHostIdByMemberId(int memberId) {
        return mapper.findHostIdByMemberId(memberId);
    }

    @Override
    public void modifyPassword(Member member) {
        if (member.getPassword() != null && member.getPassword().length() > 0) {

            member.setPassword(passwordEncoder.encode(member.getPassword()));
        } else {
            Member dbMember = mapper.selectById(member.getMemberId());
            member.setPassword(dbMember.getPassword());
        }
        mapper.modifyPassword(member);
    }

    ;

    @Override
    public void modifyProfile(Member member, MultipartFile[] files) throws IOException {

        if (files != null) {
            for (MultipartFile file : files) {
                String memberId = String.valueOf(member.getMemberId());
                String fileName = file.getOriginalFilename();
                String profileImage = "/public/img/profile/" + memberId + "/" + fileName;
                // db에 파일 저장
                mapper.insertFileList(member.getMemberId(), profileImage, fileName);

                //실제 파일 저장
                String dir = STR."/Users/leedongyoung/중앙정보/prj3/frontend/public/img/profile/\{member.getMemberId()}"; // 부모 디렉토리(폴더)
                File dirFile = new File(dir);
                if (!dirFile.exists()) {
                    dirFile.mkdirs();
                }
                //파일경로

                String path = STR."/Users/leedongyoung/중앙정보/prj3/frontend/public/img/profile/\{member.getMemberId()}/\{file.getOriginalFilename()}";
                //저장 위치 명시
                member.setProfileImage(profileImage);

                File destination = new File(path);
                //transferTo : 인풋스트림, 아웃풋스트림을 꺼내서 하드디스크에 저장
                file.transferTo(destination);

            }

        }

    }

    @Override
    public Host findHostByMemberId(String memberId) {
        return mapper.findHostByMemberId(memberId);
    }

    ;
}
