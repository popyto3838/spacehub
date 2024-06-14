package com.backend.member.service;

import com.backend.member.domain.member.Member;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

public interface MemberService {

     Member checkByEmail(String email);

     Member checkByNickName(String nickName);

     boolean validate(Member member);

     boolean validateChckEmail(String email);

    List<Member> list();

    Member getById(int memberId);

    boolean hasAccess(Member member, Authentication authentication);

     void remove(Integer memberId);

    Map<String, Object> getToken(Member member);

     boolean hasAccessModify(Member member, Authentication authentication);

    Map<String, Object> modify(Member member, Authentication authentication);

     void addMemberByEmail(Member member);






}
