package com.backend.space.controller;

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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceService spaceService;
    private final ObjectMapper objectMapper;

    @PostMapping("insert")
    public void add(@RequestPart("space") String spaceJson,
                    @RequestPart("optionList") String optionListJson,
                    @RequestPart(value = "files", required = false) List<MultipartFile> files) throws JsonProcessingException {

        // JSON 문자열을 객체로 변환
        Space space = objectMapper.readValue(spaceJson, Space.class);
        List<Integer> optionList = objectMapper.readValue(optionListJson, List.class);

//        // 파일 데이터 처리
//            if (files != null) {
//                for (MultipartFile file : files) {
//                    if (!file.isEmpty()) {
//                        String fileName = spaceService.storeFile(file);
//                        space.addFile(new SpaceFile(fileName, file.getContentType(), file.getSize()));
//                    }
//                }
//            }
        System.out.println("space = " + space);
        System.out.println("optionList = " + optionList);
//        spaceService.insertSpace(space);
    }
}