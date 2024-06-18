package com.backend.paid.service;

import com.backend.paid.domain.Paid;
import com.backend.reservation.domain.Reservation;

import java.util.List;

public interface PaidService {
    List<Paid> list();

    Paid view(Integer PaidId);

    void insert(Paid paid);

    void update(Paid paid);

    void delete(Integer paidId);
}
