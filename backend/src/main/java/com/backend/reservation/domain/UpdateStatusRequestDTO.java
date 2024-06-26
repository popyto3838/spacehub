package com.backend.reservation.domain;

import com.backend.reservation.domain.status.ReservationStatus;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class UpdateStatusRequestDTO {
    private Integer reservationId;
    private ReservationStatus status;
}
