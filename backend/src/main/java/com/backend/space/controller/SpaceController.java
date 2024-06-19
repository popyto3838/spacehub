package com.backend.space.controller;

import com.backend.space.domain.Space;
import com.backend.space.service.impl.SpaceServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceServiceImpl service;

    @PostMapping("insert")
    public void add(@RequestPart("space") Space space,
                    @RequestPart(value = "files", required = false) List<MultipartFile> files,
                    @RequestParam("selectedOptions") List<Integer> selectedOptions) {
        System.out.println("space = " + space);
        System.out.println("files = " + files);
        System.out.println("selectedOptions = " + selectedOptions);
//        service.insert();
    }
}