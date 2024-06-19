package com.backend.reservation.domain;

import com.backend.reservation.domain.status.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class Reservation {
    private Integer reservationId;
    private Integer spaceId;
    private Integer memberId;
    private String  startDate;
    private String  endDate;
    private String  startTime;
    private String  endTime;
    private ReservationStatus status;
    private Timestamp inputDt;
    private Timestamp updateDt;
}
