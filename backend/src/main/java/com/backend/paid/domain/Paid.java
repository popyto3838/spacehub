package com.backend.paid.domain;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Paid {
    private Integer paidId;
    private Integer spaceId;
    private Integer reservationId;
    private Integer memberId;
    private Integer totalPrice;
    private Timestamp updateDt;
    private Timestamp inputDt;

}
