package com.backend.space.controller;

import com.backend.fileList.service.FileListService;
import com.backend.space.domain.Space;
import com.backend.space.service.SpaceService;
import com.fasterxml.jackson.core.JsonProcessingException;
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
    private final FileListService fileListService;

    @PostMapping("insert")
    public void add(@RequestPart("space") String spaceJson,
                    @RequestPart("optionList") String optionListJson,
                    @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {

        // JSON 문자열을 객체로 변환
        Space space = objectMapper.readValue(spaceJson, Space.class);
        // SPACE CREATE
        spaceService.insertSpace(space);

        // JSON 배열 형태 -> List 형태 
        List<Integer> optionList = objectMapper.readValue(optionListJson, List.class);

        // 이미지 파일 업로드
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                fileListService.addFile(space.getSpaceId(), "SPACE", file);
            }
        }
    }
}
