package com.backend.comment.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Comment {
    private Integer commentId;
    private Integer memberId;
    private Integer parentId;
    private String division;
    private String content;
    private Timestamp inputDt;
    private Timestamp updateDt;

    private Integer boardId; // board의 boardId를 받음
    private Integer categoryId; // board의 categoryId를 받음
    private String nickname; // nickname을 받음
}
