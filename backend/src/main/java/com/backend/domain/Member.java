package com.backend.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Member {
    private int memberId;
    private String email;
    private String password;
    private String nickname;
    private String mobile;
    private String profileImage;
    private String auth;
    private String provider;
    private String providerId;
    private LocalDateTime inputDt;
    private LocalDateTime updateDt;
}
