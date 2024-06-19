package com.backend.space.controller;

import com.backend.space.domain.Space;
import com.backend.space.service.SpaceService;
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

    @PostMapping("insert")
    public void add(@RequestPart("space") Space space,
                    @RequestPart("optionList") String optionListJson,
                    @RequestPart(value = "files", required = false) List<MultipartFile> files) {

//        spaceService.insertSpace(space);
        System.out.println("space = " + space);
        System.out.println("optionListJson = " + optionListJson);
        System.out.println("files = " + files);

    }
}