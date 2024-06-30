package com.backend.space.controller;

import com.backend.dto.FindResponseSpaceJoinDTO;
import com.backend.dto.SpaceDTO;
import com.backend.file.service.FileService;
import com.backend.member.service.MemberService;
import com.backend.space.domain.FindResponseSpaceMemberIdDto;
import com.backend.space.domain.Space;
import com.backend.space.service.SpaceService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/space")
public class SpaceController {

    private final SpaceService spaceService;
    private final ObjectMapper objectMapper;
    private final FileService fileService;
    private final MemberService memberService;

    @PostMapping("insert")
    public ResponseEntity<String> add(@RequestPart("space") String spaceStr,
                                      @RequestPart("optionList") String optionListStr,
                                      @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {
        Space space = objectMapper.readValue(spaceStr, Space.class);
        List<Integer> optionList = objectMapper.readValue(optionListStr, new TypeReference<List<Integer>>() {
        });
        // SPACE CREATE
        spaceService.insertSpace(space);

        // 옵션 리스트 저장
        if (optionList != null && !optionList.isEmpty()) {
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
    public ResponseEntity<List<FindResponseSpaceJoinDTO>> getAllSpacesWithThumbnails() {
        List<FindResponseSpaceJoinDTO> spaces = spaceService.getAllSpacesWithThumbnails();
        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/{spaceId}")
    public ResponseEntity<FindResponseSpaceJoinDTO> view(@PathVariable Integer spaceId) {
        FindResponseSpaceJoinDTO spaceDto = spaceService.view(spaceId);
        if (spaceDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(spaceDto);
    }

    @GetMapping("/hostSpaceList/{memberId}")
    public ResponseEntity<List<FindResponseSpaceMemberIdDto>> selectAllbyMemberId(@PathVariable Integer memberId) {

        List<FindResponseSpaceMemberIdDto> spaceHostIdDtos = spaceService.selectAllByMemberId(memberId);
        if (spaceHostIdDtos == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(spaceHostIdDtos);
    }

    @PutMapping("/update/{spaceId}")
    public void editSpace(@PathVariable Integer spaceId,
                          @RequestPart("space") String spaceStr,
                          @RequestPart("optionList") String optionListStr,
                          @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        // JSON 문자열을 객체로 변환
        Space space = objectMapper.readValue(spaceStr, Space.class);
        List<Integer> optionList = objectMapper.readValue(optionListStr, new TypeReference<List<Integer>>() {});

        // 서비스에 업데이트 요청
        spaceService.updateSpace(spaceId, space, optionList, files);
    }
}
