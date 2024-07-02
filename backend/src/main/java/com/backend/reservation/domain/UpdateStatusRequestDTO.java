package com.backend.reservation.domain;

import com.backend.reservation.domain.status.ReservationStatus;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequestDTO {
    private Integer reservationId;
    private ReservationStatus status;
}
