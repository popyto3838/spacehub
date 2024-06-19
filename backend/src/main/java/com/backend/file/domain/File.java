package com.backend.file.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class File {

    private int fileId;
    private int relatedId; // 관련 엔티티 ID (공간, 게시판, 공지사항 등)
    private String entityType; // 엔티티 유형 (예: SPACE, BOARD, NOTICE 등)
    private String fileName;
    private int fileSize;
    private String filePath; // 파일 경로 (aws s3에 사용)
    private LocalDateTime uploadTime;

    public File(int spaceId, String space, String originalFilename, long size, String storedFilePath) {

    }
}
