package com.backend.file.service;

import com.backend.file.domain.File;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    void addOrUpdateFile(String division, int parentId, MultipartFile file) throws IOException;

    List<File> selectAllOfSpaces();

    File getFileByDivisionAndParentId(String division, int parentId);

    void deleteFileByDivisionAndParentIdAndFileName(String division, int parentId, String fileName) throws IOException;

    void deleteFileById(int fileId) throws IOException;
}
