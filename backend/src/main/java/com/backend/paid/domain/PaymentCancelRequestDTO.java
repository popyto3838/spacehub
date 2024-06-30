package com.backend.paid.domain;

import lombok.Data;

@Data
public class PaymentCancelRequestDTO {
    private Integer paidId;
    private String token;
    private String impUid;
    private Integer amount;
    private PaymentStatus status;

}
