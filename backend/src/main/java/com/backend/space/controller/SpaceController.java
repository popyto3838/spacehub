package com.backend.space.controller;

import com.backend.dto.SpaceWithThumbnailDTO;
import com.backend.file.service.FileService;
import com.backend.member.service.MemberService;
import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;
import com.backend.space.domain.SpaceConfig;
import com.backend.space.domain.SpaceDTO;
import com.backend.space.service.SpaceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceService spaceService;
    private final ObjectMapper objectMapper;
    private final FileService fileService;
    private final MemberService memberService;

    @PostMapping("insert")
    public ResponseEntity<String> add(@RequestPart("spaceDto") String spaceDtoStr,
                                      @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {
        SpaceDTO spaceDto = objectMapper.readValue(spaceDtoStr, SpaceDTO.class);
        Space space = spaceDto.getSpace();
        int memberId = spaceDto.getMemberId();

        space.setMemberId(memberId);

        // SPACE CREATE
        spaceService.insertSpace(space);

        // 옵션 리스트 저장
        List<Integer> optionList = spaceDto.getOptionList();
        if (optionList != null) {
            spaceService.insertSpaceConfig(space.getSpaceId(), optionList);
        }

        // 이미지 파일 업로드
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                fileService.addOrUpdateFile("SPACE", space.getSpaceId(), file);
            }
        }

        return ResponseEntity.ok("공간 등록이 성공적으로 처리되었습니다.");
    }

    @GetMapping("list")
    public ResponseEntity<List<SpaceWithThumbnailDTO>> getAllSpacesWithThumnails() {
        List<SpaceWithThumbnailDTO> spaces = spaceService.getAllSpacesWithThumnails();
        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/{spaceId}")
    public ResponseEntity view(@PathVariable Integer spaceId) {
        FindResponseSpaceJoinDTO spaceDto = spaceService.view(spaceId);
        spaceDto.setFile(fileService.getFileByDivisionAndParentId("SPACE", spaceId));

        if (spaceDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(spaceDto);
    }

}
