package com.backend.fileList.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileListService {

    void addFile(int parentId, String division, MultipartFile file) throws IOException;
}
