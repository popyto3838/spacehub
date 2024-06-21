package com.backend.fileList.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileList {

    private Integer fileListId;
    private Integer parentId;
    private String division;
    private String fileName;
    private Timestamp inputDt;
    private Timestamp updateDt;
    private String src; // 파일 경로


}
