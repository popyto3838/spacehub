package com.backend.space.domain;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FindResponseSpaceJoinDTO {

    private Integer spaceId;
    private Integer hostId;
    private Integer typeListId;
    private String title;
    private String subTitle;
    private String zonecode;
    private String address;
    private String detailAddress;
    private String extraAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String introduce;
    private String facility;
    private String notice;
    private Integer price;
    private Integer capacity;
    private Integer floor;
    private Integer parkingSpace;
    private LocalDateTime inputDt;
    private LocalDateTime updateDt;

    // HOST 테이블의 컬럼
    private Integer memberId;
    private String accountNumber;

    // TYPE_LIST 테이블의 컬럼
    private String typeName;
    private Boolean isActive;


}
