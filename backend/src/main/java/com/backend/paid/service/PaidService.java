package com.backend.paid.service;

import com.backend.paid.domain.Paid;
import com.backend.paid.domain.PaymentCancelRequestDTO;

import java.io.IOException;
import java.util.List;

public interface PaidService {
    List<Paid> selectAllByMemberId(Integer memberId);

    Paid view(Integer PaidId);

    void insert(Paid paid);

    void update(Paid paid);

    void delete(Integer paidId);

    String getToken() throws IOException;

    void cancelPayment(PaymentCancelRequestDTO paidCancelRequest) throws IOException;

}
