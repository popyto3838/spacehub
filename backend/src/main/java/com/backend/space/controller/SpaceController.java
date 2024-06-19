package com.backend.space.controller;

import com.backend.file.domain.File;
import com.backend.file.service.FileService;
import com.backend.file.service.impl.FileServiceImpl;
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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceService spaceService;
    private final ObjectMapper objectMapper;
    private final FileServiceImpl fileService;

    @PostMapping("insert")
    public void add(@RequestPart("space") String spaceJson,
                    @RequestPart("optionList") String optionListJson,
                    @RequestPart(value = "files", required = false) List<MultipartFile> files) throws JsonProcessingException {

        // JSON 문자열을 객체로 변환
        Space space = objectMapper.readValue(spaceJson, Space.class);
        // SPACE CREATE
        spaceService.insertSpace(space);

        // JSON 배열 형태 -> List 형태 
        List<Integer> optionList = objectMapper.readValue(optionListJson, List.class);

        // 파일 업로드: 기능 구현 중
//        List<File> fileList = files.stream()
//                .map(file -> {
//                    String storedFilePath = fileService.addFile(file); // 파일 저장 로직 호출 (구현 필요)
//                    return new File(space.getSpaceId(), "SPACE", file.getOriginalFilename(), file.getSize(), storedFilePath);
//                })
//                .collect(Collectors.toList());
//        // FileList 저장
//        fileService.insertFileLists(fileDtos); // FileService의 insertFileLists 메서드 호출


    }
}