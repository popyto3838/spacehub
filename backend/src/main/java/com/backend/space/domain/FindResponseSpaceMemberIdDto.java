package com.backend.space.domain;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FindResponseSpaceMemberIdDto {

    private int spaceId; // SPACE(PK)
    private int memberId;
    private int hostId; // HOST(FK)
    private int typeListId; // TYPE_LIST(FK)

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

    private int price;
    private int capacity;
    private int floor;
    private int parkingSpace;

    private LocalDateTime inputDt;
    private LocalDateTime updateDt;


}
