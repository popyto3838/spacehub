package com.backend.reservation.controller;

import com.backend.reservation.domain.FindResponseHostReservationList;
import com.backend.reservation.domain.FindResponseReservationListDTO;
import com.backend.reservation.domain.Reservation;
import com.backend.reservation.domain.UpdateStatusRequestDTO;
import com.backend.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@Log4j2
public class ReservationController {
    private final ReservationService reservationService;


    @GetMapping("/listAll")
    public ResponseEntity<List<Reservation>> listAll() {
        List<Reservation> list = reservationService.selectAll();
        if (list == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/list/{memberId}")
    public ResponseEntity<List<FindResponseReservationListDTO>> listByMemberId(@PathVariable Integer memberId) {
        List<FindResponseReservationListDTO> list = reservationService.list(memberId);
        if (list == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/hostReservationList/{spaceId}")
    public ResponseEntity<List<FindResponseHostReservationList>> selectAllbyHostId(@PathVariable Integer spaceId) {
        List<FindResponseHostReservationList> list = reservationService.selectAllbyHostId(spaceId);
        if (list == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity view(@PathVariable Integer reservationId) {
        Reservation reservation = reservationService.view(reservationId);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(reservation);
    }

    @PostMapping("/write")
    public ResponseEntity<Map<String, Object>> write(@RequestBody Reservation reservation) {
        reservationService.insert(reservation);
        Map<String, Object> response = new HashMap<>();
        log.info("reservation.getReservationId={}", reservation.getReservationId());
        response.put("reservationId", reservation.getReservationId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public void update(Reservation reservation) {
        reservationService.update(reservation);
    }

    @DeleteMapping("/delete/{reservationId}")
    public void delete(@PathVariable Integer reservationId) {
        reservationService.delete(reservationId);
    }

    @PutMapping("/updateStatus")
    public void updateStatus(@RequestBody UpdateStatusRequestDTO reservation) {
        reservationService.updateStatus(reservation);
    }

}
