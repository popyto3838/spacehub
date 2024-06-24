package com.backend.file.service;

import com.backend.file.domain.File;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    void addFile(int parentId, String division, MultipartFile file) throws IOException;

    List<File> selectAllOfSpaces();
}
