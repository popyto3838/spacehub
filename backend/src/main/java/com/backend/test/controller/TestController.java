package com.backend.test.controller;

import com.backend.test.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController("/test")
public class TestController {
    private final TestRepository testRepository;
}
