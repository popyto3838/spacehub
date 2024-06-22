package com.backend.space.controller;

import com.backend.file.service.FileService;
import com.backend.member.service.MemberService;
import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;
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

        // memberId로 hostId 조회
        Integer hostId = memberService.findHostIdByMemberId(memberId);
        if (hostId == null) {
            return ResponseEntity.badRequest().body("Invalid memberId, hostId not found");
        }
        space.setMemberId(memberId); // memberId 설정
        space.setHostId(hostId); // hostId 설정

        // SPACE CREATE
        spaceService.insertSpace(space);

        // 이미지 파일 업로드
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                fileService.addFile("SPACE", space.getSpaceId(), file);
            }
        }

        return ResponseEntity.ok("Space created successfully");
    }

    @GetMapping("list")
    public ResponseEntity<List<Space>> selectAll() {
        List<Space> spaces = spaceService.selectAll();
//        List<File> files = fileService.selectAllOfSpaces();
//        for (Space space : spaces) {
//            for (File file : files) {
//                if (space.getSpaceId() == file.getParentId()) {
//                    space.setThumbnailPath(file.getFilePath());
//                    break;
//                }
//            }
//        }
        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/{spaceId}")
    public ResponseEntity view(@PathVariable Integer spaceId) {
        FindResponseSpaceJoinDTO space = spaceService.view(spaceId);
        if (space == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(space);
    }

}
