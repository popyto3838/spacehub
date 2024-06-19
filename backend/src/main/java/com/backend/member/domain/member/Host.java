package com.backend.member.domain.member;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Host {
    private Integer hostId;
    private Integer memberId;
    private String accountNumber;
    private String bankName;
    private LocalDateTime inputDt;
    private LocalDateTime outputDt;

}
