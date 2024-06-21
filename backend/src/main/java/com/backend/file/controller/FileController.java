package com.backend.file.controller;

import com.backend.file.domain.File;
import com.backend.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class FileController {

    private final FileService fileService;

    @GetMapping("/space/list")
    public List<File> selectAllOfSpaces() {
        return fileService.selectAllOfSpaces();
    }
}
