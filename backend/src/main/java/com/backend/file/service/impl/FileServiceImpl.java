package com.backend.file.service.impl;

import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.file.service.FileService;
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
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;

    private final String baseDir = "/Users/santa/Desktop/study/BackEnd/project/prj3/backend/src/main/resources/images/";

    @Override
    public void addFile(int parentId, String division, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String fileName = file.getOriginalFilename();
        Path dirPath = Paths.get(baseDir + division + "/" + parentId + "/");
        Files.createDirectories(dirPath);  // 디렉토리가 없으면 생성
        Path filePath = dirPath.resolve(fileName);  // 전체 파일 경로 생성

        Files.write(filePath, file.getBytes());

        File fileList = new File();
        fileList.setParentId(parentId);
        fileList.setDivision(division);
        fileList.setFileName(fileName);

        fileMapper.insertFile(fileList);
    }
}
