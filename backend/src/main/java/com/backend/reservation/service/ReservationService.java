package com.backend.reservation.service;

import com.backend.reservation.domain.FindResponseReservationListDTO;
import com.backend.reservation.domain.Reservation;

import java.util.List;

public interface ReservationService {
    Reservation view(Integer reservationId);

    List<FindResponseReservationListDTO> list(Integer memberId);

    int insert(Reservation reservation);

    void update(Reservation reservation);

    void delete(Integer reservationId);

}
