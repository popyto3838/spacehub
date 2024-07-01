package com.backend.space.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Space {

    private int spaceId; // SPACE(PK)
    private int memberId;
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

    private String thumbnailPath; // frontend 썸네일 출력용 경로

}
