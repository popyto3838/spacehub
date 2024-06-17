package com.backend.board.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Category {
    private Integer categoryId;
    private String categoryName;
    private Timestamp insertDt;
    private Timestamp updateDt;
}
