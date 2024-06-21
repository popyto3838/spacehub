package com.backend.reservation.controller;

import com.backend.reservation.domain.Reservation;
import com.backend.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Update;
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

    @GetMapping("/list")
    public List<Reservation> list() {
        return reservationService.list();
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

}
