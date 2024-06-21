package com.backend.member.service;

import com.backend.member.domain.member.Host;
import com.backend.member.domain.member.Member;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

public interface MemberService {

    Member checkByEmail(String email);

    Member checkByNickName(String nickname);

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

    Member findByEmail(String email);

    void insertMember(Member member);

   void addHostMemberByEmail(Member member);

    Integer selectbyEmail2(Member member);

    Map<String,Object> switchHost(Member member);

    Map<String,Object> switchUser(Member member);

    boolean validateAccount(Host host);

    void addAccountinfo(Host host);

    void certifiedPhoneNumber(String mobile, String verificationCode);

    void addhostInfo(Host host);

    Map<String, Object> checkHostInfo(Host host);

    Member emailByMobile(String mobile);

    void addPhone(Member member);

    Integer findHostIdByMemberId(int memberId);
}
