package com.backend.fileList.domain;

import lombok.Data;

@Data
public class FileList {
    private int fileListId;
    private int parentId;
    private String division;
    private String fileName;
}
