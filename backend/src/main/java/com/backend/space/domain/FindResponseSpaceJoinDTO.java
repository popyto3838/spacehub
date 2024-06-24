package com.backend.space.domain;

import com.backend.file.domain.File;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FindResponseSpaceJoinDTO {

    private Integer spaceId;

    // TYPE_LIST 테이블의 컬럼
    private Integer typeListId;
    private String typeName;
    private Boolean isActive;

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

    // FILE 테이블 컬럼
    private List<File> file;

}
