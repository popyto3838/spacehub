package com.backend.domain;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Space {

    private int spaceId;
    private int hostId;
    private String title;
    private String subTitle;
    private String type;
    private String location;
    private String intro;
    private String facilityInfo;
    private int price;
    private int capacity;
    private int floor;
    private int parkingSpaces;
    private LocalDateTime inputDt;
    private LocalDateTime updateDt;
}
