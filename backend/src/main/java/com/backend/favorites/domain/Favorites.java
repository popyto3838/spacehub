package com.backend.favorites.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Favorites {
    private Integer favoritesId;
    private Integer memberId;
    private Integer spaceId;
    private Timestamp inputDt;
    private Timestamp updateDt;
}
