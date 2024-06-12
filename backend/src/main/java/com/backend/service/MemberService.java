package com.backend.service;

import com.backend.domain.member.Member;
import com.backend.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {
    final MemberMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;


    public void add(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        member.setEmail(member.getEmail().trim());
        member.setNickName(member.getNickName().trim());

        mapper.add(member);
    }

    public Member checkByEmail(String email) {
        return mapper.checkByEmail(email);
    }

    public Member checkByNickName(String nickName) {
        return mapper.checkBynickName(nickName);
    }

    public boolean validate(Member member) {
        if (member.getEmail() == null || member.getEmail().isBlank()) {
            return false;
        }
        if (member.getNickName() == null || member.getNickName().isBlank()) {
            return false;
        }
        if (member.getPassword() == null || member.getPassword().isBlank()) {
            return false;
        }


        return true;
    }

    public boolean validateChckEmail(String email) {
        String emailpattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

        if (!email.trim().matches(emailpattern)) {
            return false;
        }
        return true;
    }

    public List<Member> list() {
        return mapper.list();
    }

    public Member getById(int id) {
        return mapper.selectById(id);
    }

    public boolean hasAccess(Member member, Authentication authentication) {
        if (!member.getId().toString().equals(authentication.getName())) {
            return false;
        }

        Member dbMember = mapper.selectById(member.getId());

        if (dbMember == null) {
            return false;

        }
        return passwordEncoder.matches(member.getPassword(), dbMember.getPassword());

    }

    public void remove(Integer id) {

        mapper.deleteById(id);
    }

    public Map<String, Object> getToken(Member member) {

        Map<String, Object> result = null;

        Member db = mapper.selectByEmail(member.getEmail());

        if (db != null) {
            if (passwordEncoder.matches(member.getPassword(), db.getPassword())) {
                result = new HashMap<>();

                String token = "";
                Instant now = Instant.now();

                String authority = mapper.selectAuthorityByMemberId(db.getId());

                System.out.println(authority);
                System.out.println(authority);

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(db.getId().toString())
                        .claim("scope", authority)
                        .claim("nickName", db.getNickName())
                        .build();


                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }


        }
        return result;

    }

    public boolean hasAccessModify(Member member, Authentication authentication) {
        if (!authentication.getName().equals(member.getId().toString())) {
            return false;
        }

        Member dbMember = mapper.selectById(member.getId());
        if (dbMember == null) {
            return false;
        }

        if (!passwordEncoder.matches(member.getOldPassword(), dbMember.getPassword())) {
            return false;
        }

        return true;
    }

    public Map<String, Object> modify(Member member, Authentication authentication) {
        if (member.getPassword() != null && member.getPassword().length() > 0) {

            member.setPassword(passwordEncoder.encode(member.getPassword()));
        } else {
            Member dbMember = mapper.selectById(member.getId());
            member.setPassword(dbMember.getPassword());
        }
        mapper.update(member);

        String token = "";

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);
        jwtClaimsSetBuilder.claim("nickName", member.getNickName());

        JwtClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();
        token = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
        return Map.of("token", token);
    }


//    public void add2(Member member) {
//        Member OldMember = member.checkByNickName(member.getNickName());
//
//        if (OldMember != null) {
//            String signUpMemberNickname = member.getNickName();
//
//            if (signUpMemberNickname.equals(OldMember.getNickName()){
//                member.setNickName(signUpMemberNickname + "+");
//            }
//        }
//
//        mapper.add(member);
//    }
}
