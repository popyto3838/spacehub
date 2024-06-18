package com.backend.fileList.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class FileList {

    private Integer fileListId;
    private Integer parentId;
    private String division;
    private String fileName;
    private Timestamp inputDt;
    private Timestamp updateDt;

}
