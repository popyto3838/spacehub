package com.backend.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileList {

    private Long id;
    private Long parentId;
    private Integer division;
    private String fileName;
    private LocalDateTime inputDt;
    private LocalDateTime updateDt;

}
