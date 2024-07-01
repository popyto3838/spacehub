package com.backend.typeList.controller;

import com.backend.dto.ItemListResponseDto;
import com.backend.file.service.FileService;
import com.backend.typeList.domain.TypeList;
import com.backend.typeList.service.TypeListService;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space/type")
public class TypeListController {

    private final TypeListService typeListService;
    private final FileService fileService;

    @PostMapping("/write")
    public ResponseEntity write(@RequestBody List<TypeList> typeLists) {
        try {
            typeListService.insertTypeList(typeLists); // 서비스에 옵션 목록 전달
            return ResponseEntity.ok("타입 저장 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("타입 저장 실패: " + e.getMessage());
        }
    }

    @PutMapping("/{typeListId}")
    public ResponseEntity<String> update(@PathVariable int typeListId,
                                         @RequestBody TypeList typeList) {
        try {
            typeList.setTypeListId(typeListId);
            typeListService.update(typeList);
            return ResponseEntity.ok("타입이 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("타입 업데이트 실패: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<ItemListResponseDto>> getTypeLists() {
        List<ItemListResponseDto> response = typeListService.selectAll();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{typeListId}")
    public ResponseEntity<String> delete(@PathVariable int typeListId) {
        try {
            typeListService.deleteSpaceType(typeListId);
            return ResponseEntity.ok("타입이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("타입 삭제에 실패했습니다: " + e.getMessage());
        }
    }
}
