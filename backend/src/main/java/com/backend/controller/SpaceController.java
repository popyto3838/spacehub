package com.backend.controller;

import com.backend.domain.Space;
import com.backend.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/space")
public class SpaceController {

    private final SpaceService service;

    @PostMapping("register")
    public void add(Space space) {
        service.add();
    }
}
