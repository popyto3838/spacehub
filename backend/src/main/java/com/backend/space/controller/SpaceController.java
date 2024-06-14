package com.backend.space.controller;

import com.backend.space.service.impl.SpaceServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceServiceImpl service;

    @PostMapping("register")
    public void add(@RequestBody Map<String, Object> map) {

        service.add();
    }
}
