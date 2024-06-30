package com.backend.optionList.controller;

import com.backend.dto.ItemListResponseDto;
import com.backend.optionList.domain.OptionList;
import com.backend.optionList.service.OptionListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space/option")
public class OptionListController {

    private final OptionListService optionListService;

    @PostMapping("/write")
    public ResponseEntity<String> write(@RequestBody List<OptionList> optionLists) {
        try {
            optionListService.insertOptionList(optionLists); // 서비스에 옵션 목록 전달
            return ResponseEntity.ok("옵션 저장 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("옵션 저장 실패: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<ItemListResponseDto>> getOptionLists() {
        List<ItemListResponseDto> response = optionListService.selectAll();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{optionListId}")
    public ResponseEntity<String> delete(@PathVariable int optionListId) {
        try {
            optionListService.deleteSpaceOption(optionListId);
            return ResponseEntity.ok("옵션이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("옵션 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/{optionListId}")
    public ResponseEntity<String> update(@PathVariable int optionListId,
                                         @RequestBody OptionList optionList) {
        try {
            optionList.setOptionListId(optionListId);
            optionListService.update(optionList);
            return ResponseEntity.ok("옵션이 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("옵션 업데이트 실패: " + e.getMessage());
        }
    }
}
