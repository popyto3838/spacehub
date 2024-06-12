package com.backend.domain;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Space {

    private int id;
    private int hostId;

    private String title;
    private String subTitle;
    private BigDecimal price;
    private String type;
    private String location;
    private Integer capacity;
    private String intro;
    private String facilityInfo;
    private LocalDateTime inputDt;
    private LocalDateTime updateDt;

    private List<FileList> fileList;
}
