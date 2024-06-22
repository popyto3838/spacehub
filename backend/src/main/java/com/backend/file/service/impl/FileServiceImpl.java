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
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;

    private final String baseDir = "/Users/santa/Desktop/study/BackEnd/project/prj3/frontend/public/img/";

    @Override
    public void addOrUpdateFile(String division, int parentId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String fileName = file.getOriginalFilename();
        String fullPath = "/img/" + division + "/" + parentId + "/" + fileName;
        Path dirPath = Paths.get(baseDir + division + "/" + parentId + "/");
        Files.createDirectories(dirPath);
        Path filePath = dirPath.resolve(fileName);

        // 기존 파일이 있으면 덮어쓰기
        Files.write(filePath, file.getBytes());

        // 파일 정보 DB에 저장
        File existingFile = fileMapper.findFileByFullPath(fullPath);
        if (existingFile != null) {
            // 기존 파일 정보 업데이트
            existingFile.setFileName(fullPath);
            fileMapper.updateFile(existingFile);
        } else {
            // 새로운 파일 정보 저장
            File fileRecord = new File();
            fileRecord.setParentId(parentId);
            fileRecord.setDivision(division);
            fileRecord.setFileName(fullPath);
            fileMapper.insertFile(fileRecord);
        }
    }

    @Override
    public List<File> selectAllOfSpaces() {
        List<File> files = fileMapper.selectAllOfSpaces();
        for (File file : files) {
            String filePath = "/img/" + file.getDivision() + "/" + file.getParentId() + "/" + file.getFileName();
            file.setFileName(filePath);
        }
        return files;
    }

    @Override
    public File getFileByDivisionAndParentId(String division, int parentId) {
        return fileMapper.selectFileByDivisionAndParentId(division, parentId);
    }

    @Override
    public void deleteFileByDivisionAndParentIdAndFileName(String division, int parentId, String fileName) throws IOException {
        String fullPath = "/img/" + division + "/" + parentId + "/" + fileName;
        Path filePath = Paths.get(baseDir + division + "/" + parentId + "/" + fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        fileMapper.deleteFileByFullPath(fullPath);
    }
}
