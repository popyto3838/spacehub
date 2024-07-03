package com.backend.commentRe.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class CommentRe {

    private Integer commentReId;
    private Integer memberId;
    private Integer targetId;
    private Integer commentId;
    private String content;
    private Timestamp inputDt;
    private Timestamp updateDt;
    private String targetName;
    private String nickname;
}
