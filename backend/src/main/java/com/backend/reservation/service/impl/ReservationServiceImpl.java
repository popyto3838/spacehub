package com.backend.reservation.service.impl;

import com.backend.reservation.domain.FindResponseHostReservationList;
import com.backend.reservation.domain.FindResponseReservationListDTO;
import com.backend.reservation.domain.Reservation;
import com.backend.reservation.domain.UpdateStatusRequestDTO;
import com.backend.reservation.domain.status.ReservationStatus;
import com.backend.reservation.mapper.ReservationMapper;
import com.backend.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
public class ReservationServiceImpl implements ReservationService {
    private final ReservationMapper reservationMapper;


    @Override
    public void delete(Integer reservationId) {
        reservationMapper.deleteByReservationId(reservationId);
    }

    @Override
    public void update(Reservation reservation) {
        reservationMapper.update(reservation);
    }

    @Override
    public int insert(Reservation reservation) {
        reservation.setStatus(ReservationStatus.APPLY);
        reservationMapper.insert(reservation);
        return reservation.getReservationId();
    }

    @Override
    public List<Reservation> selectAll() {
        return reservationMapper.selectAll();
    }

    @Override
    public List<FindResponseReservationListDTO> list(Integer memberId) {
        return reservationMapper.selectAllByMemberId(memberId);
    }

    @Override
    public List<FindResponseHostReservationList> selectAllbyHostId(Integer spaceId) {
        return reservationMapper.selectAllBySpaceId(spaceId);
    }

    @Override
    public Reservation view(Integer reservationId) {
        return reservationMapper.selectByReservationId(reservationId);
    }

    @Override
    public void updateStatus(UpdateStatusRequestDTO reservation) {
        reservationMapper.updateStatus(reservation);
    }
}
