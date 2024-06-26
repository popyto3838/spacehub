package com.backend.member.domain.member;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class Member {
    private Integer memberId;
    private String email;
    private String password;
    private String oldPassword;
    private String nickname;
    private LocalDateTime inputDt;
    private String auth;
    private AuthName authName;
    private Withdrawn withdrawn;
    private String naverId;
    private String mobile;
    private String profileImage;
    private String src;

    public String getSignupDateAndTime() {
        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초");

        return inputDt.format(formatter);
    }

    private String link;

}
