package com.backend.space.domain;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Space {

    private int spaceId; // SPACE(PK)
    private int hostId; // HOST(FK)
    private int spaceConfigurationId; // SPACE_CONFIGURATION(FK)
    private int typeListId; // TYPE_LIST(FK)

    private String title;
    private String subTitle;

    private String introduce;
    private String facilityInfo;
    private String notice;

    private String zonecode;
    private String detailAddress;
    private String extraAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;

    private int price;
    private int capacity;
    private int floor;
    private int parkingSpace;

    private LocalDateTime inputDt;
    private LocalDateTime updateDt;

}
