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
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static com.backend.reservation.domain.status.ReservationStatus.ACCEPT;
import static com.backend.reservation.domain.status.ReservationStatus.CANCEL;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
@Log4j2
@EnableScheduling
public class ReservationServiceImpl implements ReservationService {
    private final ReservationMapper reservationMapper;
    private final ConcurrentHashMap<Integer, ScheduledExecutorService> scheduledTasks = new ConcurrentHashMap<>();


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

        if (ACCEPT.equals(reservation.getStatus())) {
            scheduleStatusUpdate(reservation.getReservationId());
        }
    }

    private void scheduleStatusUpdate(Integer reservationId) {
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        executor.schedule(() -> {
            UpdateStatusRequestDTO updateRequest = new UpdateStatusRequestDTO();
            updateRequest.setReservationId(reservationId);
            updateRequest.setStatus(CANCEL);
            reservationMapper.updateStatus(updateRequest);

            // 작업 완료 후 executor 종료
            executor.shutdown();
            scheduledTasks.remove(reservationId);
        }, 10, TimeUnit.SECONDS);

        scheduledTasks.put(reservationId, executor);
    }

    @Scheduled(fixedRate = 60000) // 매 1분마다 실행
    public void cleanUpScheduledTasks() {
        scheduledTasks.forEach((reservationId, executor) -> {
            if (executor.isTerminated()) {
                scheduledTasks.remove(reservationId);
            }
        });
    }
}
