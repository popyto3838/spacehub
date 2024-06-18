package com.backend.member.controller;


import com.backend.member.domain.member.Member;
import com.backend.member.service.MailService;
import com.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public Map<String, Object> e1(@RequestParam String mail) {


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
        System.out.println(authentication);
        System.out.println(member);
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


}
