package com.backend.comment.domain;

import com.backend.file.domain.File;
import lombok.Data;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

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
    private Integer spaceId; // space의 spaceId를 받음

    private List<File> commentFilesLists;

    private static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy년 MM월 dd일 HH시 mm분 ss초");

    public String getInputDt() {
        // 하루 전의 TIMESTAMP
        Timestamp beforeOneDay = new Timestamp(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
        if (inputDt.before(beforeOneDay)) {
            //inputDt가 하루 전보다 전이면 날짜를 출력해서 리턴해줌
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            return formatter.format(inputDt);
        } else {
            SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
            return formatter.format(inputDt);
        }

    }

    public String getUpdateDt() {
        // 하루 전의 TIMESTAMP
        Timestamp beforeOneDay = new Timestamp(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
        if (updateDt.before(beforeOneDay)) {
            //inputDt가 하루 전보다 전이면 날짜를 출력해서 리턴해줌
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            return formatter.format(updateDt);
        } else {
            SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
            return formatter.format(updateDt);
        }
    }

}
