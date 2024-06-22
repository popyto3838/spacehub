package com.backend.file.service;

import com.backend.file.domain.File;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    void addFile(String division, int parentId, MultipartFile file) throws IOException;

    List<File> selectAllOfSpaces();

    File getFileByParentIdAndDivision(int parentId, String division);

}
