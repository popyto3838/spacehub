package com.backend.optionList.controller;

import com.backend.optionList.domain.OptionList;
import com.backend.optionList.service.OptionListService;
import com.backend.optionList.service.impl.OptionListServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/list")
    public List<OptionList> list() {
        return service.list();
    }

    @DeleteMapping("/{optionListId}")
    public ResponseEntity delete(@PathVariable int optionListId) {
        try {
            service.deleteSpaceOption(optionListId);
            return ResponseEntity.ok("옵션이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("옵션 삭제에 실패했습니다: " + e.getMessage());
        }
    }
}
