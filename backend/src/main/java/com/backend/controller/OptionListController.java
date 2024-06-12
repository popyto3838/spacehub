package com.backend.controller;

import com.backend.domain.OptionList;
import com.backend.service.OptionListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space/option")
public class OptionListController {

    private final OptionListService service;

    @PostMapping("/write")
    public ResponseEntity write(@RequestBody List<OptionList> optionLists) {
        try {
            service.insertOptionList(optionLists); // 서비스에 옵션 목록 전달
            return ResponseEntity.ok("옵션 저장 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("옵션 저장 실패: " + e.getMessage());
        }
    }
}
