package com.backend.fileList.service.impl;

import com.backend.fileList.domain.FileList;
import com.backend.fileList.mapper.FileListMapper;
import com.backend.fileList.service.FileListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class FileListServiceImpl implements FileListService {

    private final FileListMapper fileListMapper;

    private final String uploadDir = "uploads/";

    @Override
    public void addFile(int parentId, String division, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        FileList fileList = new FileList();
        fileList.setParentId(parentId);
        fileList.setDivision(division);
        fileList.setFileName(fileName);

        fileListMapper.insertFile(fileList);
    }
}
