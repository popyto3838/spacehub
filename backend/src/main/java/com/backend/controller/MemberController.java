package com.backend.controller;

import com.backend.domain.member.Member;
import com.backend.service.MailService;
import com.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
@Log4j2
public class MemberController {
    final MailService mailService;
    final MemberService service;

    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {
        if (service.validate(member)) {
            System.out.println(member);
            service.add(member);

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
    public String e1(@RequestParam String mail) {


        int number = mailService.sendMail(mail);

        String num = "" + number;

        return num;

    }

    @GetMapping("list")
    public List<Member> list() {
        return service.list();
    }

    @GetMapping("{id}")
    public ResponseEntity get(@PathVariable Integer id) {
        Member member = service.getById(id);
        if (member == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(member);
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity delete(@RequestBody Member member, Authentication authentication) {
        System.out.println(authentication);
        if (service.hasAccess(member, authentication)) {
            service.remove(member.getId());
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
