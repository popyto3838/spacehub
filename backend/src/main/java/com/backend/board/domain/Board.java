package com.backend.board.domain;

import lombok.Data;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

@Data
public class Board {
    private Integer boardId;
    private Integer memberId;
    private Integer categoryId;
    private String title;
    private String content;
    private Timestamp inputDt;
    private Timestamp updateDt;
    private Integer views;


    private static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy년 MM월 dd일 HH시 mm분 ss초");

    public String getInputDateAndTime() {
        return formatter.format(inputDt);
    }

    public String getUpdateDateAndTime() {
        return formatter.format(updateDt);
    }

}
