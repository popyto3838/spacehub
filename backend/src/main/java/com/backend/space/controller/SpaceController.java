package com.backend.space.controller;

import com.backend.file.service.FileService;
import com.backend.member.service.MemberService;
import com.backend.space.domain.Space;
import com.backend.space.domain.SpaceDTO;
import com.backend.space.service.SpaceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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
    public void add(@RequestPart("spaceDto") SpaceDTO spaceDto) throws IOException {

        Space space = spaceDto.getSpace();
        int memberId = spaceDto.getMemberId();
        List<Integer> optionList = spaceDto.getOptionList();
        List<MultipartFile> files = spaceDto.getFiles();

        // memberId로 hostId 조회
        Integer hostId = memberService.findHostIdByMemberId(memberId);
        space.setHostId(hostId); // hostId 설정
        // SPACE CREATE
        spaceService.insertSpace(space);

        // 이미지 파일 업로드
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                fileService.addFile(space.getSpaceId(), "SPACE", file);
            }
        }
    }
}
