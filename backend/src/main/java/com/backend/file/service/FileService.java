package com.backend.file.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    void addFile(int parentId, String division, MultipartFile file) throws IOException;
}
