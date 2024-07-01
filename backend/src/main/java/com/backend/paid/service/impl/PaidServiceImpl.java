package com.backend.paid.service.impl;

import com.backend.paid.domain.Paid;
import com.backend.paid.domain.PaymentCancelRequestDTO;
import com.backend.paid.domain.PaymentStatus;
import com.backend.paid.mapper.PaidMapper;
import com.backend.paid.service.PaidService;
import com.backend.reservation.mapper.ReservationMapper;
import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.URL;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class PaidServiceImpl implements PaidService {
    private final PaidMapper paidMapper;
    private final ReservationMapper reservationMapper;

    @Override
    public List<Paid> selectAllByMemberId(Integer memberId) {
        return paidMapper.selectAllByMemberId(memberId);
    }

    @Override
    public Paid view(Integer paidId) {
        return paidMapper.selectByPaidId(paidId);
    }

    @Override
    public void insert(Paid paid) {
        paid.setStatus(PaymentStatus.COMP);
        paidMapper.insert(paid);
        reservationMapper.completePament(paid.getReservationId());
    }

    @Override
    public void update(Paid paid) {
        paidMapper.update(paid);
    }

    @Override
    public void delete(Integer paidId) {
        paidMapper.deleteByPaidId(paidId);
    }

    @Override
    public String getToken() throws IOException {
        HttpsURLConnection conn = null;

        URL url = new URL("https://api.iamport.kr/users/getToken");
        conn = (HttpsURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);

        JsonObject json = new JsonObject();

        json.addProperty("imp_key", "2033753680550847");
        json.addProperty("imp_secret", "z5qtw590cLPjg3EIGzRzixTBIl2QyxrIv6DO2HoPDKm4PtlJsuXtVzcHdKTzm1Yh68fXshvGMJ7DqnDL");

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
        bw.write(json.toString());
        bw.flush();
        bw.close();

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
        Gson gson = new Gson();

        String response = gson.fromJson(br.readLine(), Map.class).get("response").toString();
        String token = gson.fromJson(response, Map.class).get("access_token").toString();

        br.close();
        conn.disconnect();

        return token;
    }

    @Override
    public void cancelPayment(PaymentCancelRequestDTO paidCancelRequest) throws IOException {
        log.info("=====================1===========================");
        Paid paid = paidMapper.selectByPaidId(paidCancelRequest.getPaidId());
        if (paid.getStatus().equals(PaymentStatus.COMP)) {
            log.info("=========================2=======================");

            HttpsURLConnection conn = null;

            URL url = new URL("https://api.iamport.kr/payments/cancel");
            conn = (HttpsURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-type", "application/json");
            conn.setRequestProperty("Authorization", paidCancelRequest.getToken());
            conn.setDoOutput(true);

            JsonObject json = new JsonObject();
            json.addProperty("imp_uid", paidCancelRequest.getImpUid());
            json.addProperty("amount", paidCancelRequest.getAmount());
            json.addProperty("reason", "결제 금액 에러");

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            bw.write(json.toString());
            bw.flush();
            bw.close();
            String responseMessage = conn.getResponseMessage();
            log.info("==============responseMessage==========={}", responseMessage);
            conn.disconnect();
            paidCancelRequest.setStatus(PaymentStatus.REFUND);
            paidMapper.paymentRefund(paidCancelRequest);
        }
    }
}
