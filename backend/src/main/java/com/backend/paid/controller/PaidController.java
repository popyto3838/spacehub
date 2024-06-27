package com.backend.paid.controller;

import com.backend.paid.domain.Paid;
import com.backend.paid.service.PaidService;
import com.backend.reservation.domain.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;

@RestController
@RequestMapping("/api/paid")
@RequiredArgsConstructor
@Log4j2
public class PaidController {
    private final PaidService paidService;

    @GetMapping("/list/{memberId}")
    public List<Paid> list(@PathVariable Integer memberId) {
        return paidService.selectAllByMemberId(memberId);
    }

    @GetMapping("/{paidId}")
    public ResponseEntity view(@PathVariable Integer paidId) {
        Paid Paid = paidService.view(paidId);
        if (Paid == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(Paid);
    }

    @PostMapping("/write")
    public void write(@RequestBody Paid Paid) {
        log.info("공간결제 시작");
        paidService.insert(Paid);
    }

    @PutMapping("/update")
    public void update(Paid Paid) {
        paidService.update(Paid);
    }

    @DeleteMapping("/delete/{paidId}")
    public void delete(@PathVariable Integer paidId) {
        paidService.delete(paidId);
    }
}
