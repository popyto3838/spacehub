package com.backend.space.controller;

import com.backend.file.domain.File;
import com.backend.file.service.FileService;
import com.backend.file.service.impl.FileServiceImpl;
import com.backend.reservation.domain.Reservation;
import com.backend.space.domain.FindResponseSpaceJoinDTO;
import com.backend.space.domain.Space;
import com.backend.space.service.SpaceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
