package com.backend.space.controller;

import com.backend.space.service.impl.SpaceServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceServiceImpl service;

    @PostMapping("insert")
    public void add(@RequestBody Map<String, Object> map,
                    @RequestParam(value = "files[]" , required = false) MultipartFile[] files) {

        service.insert();
    }
}
