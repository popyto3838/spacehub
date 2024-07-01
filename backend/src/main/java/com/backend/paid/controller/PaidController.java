package com.backend.paid.controller;

import com.backend.paid.domain.Paid;
import com.backend.paid.domain.PaymentCancelRequestDTO;
import com.backend.paid.service.PaidService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @PostMapping("/getToken")
    public String getToken() throws IOException {
        return paidService.getToken();
    }

    @PostMapping("/cancelPayment")
    public void cancelPayment(@RequestBody PaymentCancelRequestDTO paidCancelRequest) throws IOException {
        paidService.cancelPayment(paidCancelRequest);
    }

}
