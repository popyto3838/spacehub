package com.backend.file.controller;

import com.backend.file.domain.File;
import com.backend.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/upload/typeIcon")
    public ResponseEntity<String> uploadTypeIcon(
            @RequestParam("file") MultipartFile file,
            @RequestParam("parentId") int parentId,
            @RequestParam("division") String division) {
        try {
            fileService.addOrUpdateFile(division, parentId, file);
            return ResponseEntity.ok("File uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed.");
        }
    }
}
