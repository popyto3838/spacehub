package com.backend.file.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class File {
    private int fileId;
    private int parentId;
    private String division;
    private String fileName;
    private Timestamp inputDt;
    private Timestamp updateDt;
    private String src; // 파일 경로

}
