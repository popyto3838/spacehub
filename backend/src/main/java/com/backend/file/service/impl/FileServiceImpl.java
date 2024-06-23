package com.backend.file.service.impl;

import com.backend.dto.ItemListResponseDto;
import com.backend.file.domain.File;
import com.backend.file.mapper.FileMapper;
import com.backend.file.service.FileService;
import com.backend.optionList.mapper.OptionListMapper;
import com.backend.typeList.mapper.TypeListMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;
    private final TypeListMapper typeListMapper;
    private final OptionListMapper optionListMapper;

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
    public List<File> getFileByDivisionAndParentId(String division, int parentId) {
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

    @Override
    public void deleteFileById(int fileId) throws IOException {
        File file = fileMapper.selectFileById(fileId);
        if (file != null) {
            // 파일 경로 생성
            Path filePath = Paths.get(baseDir + file.getFileName());
            // 파일이 존재하면 삭제
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            // DB에서 파일 정보 삭제
            fileMapper.deleteFileById(fileId);
        }
    }

    @Override
    public List<ItemListResponseDto> getTypeLists() {
        return typeListMapper.selectAll().stream().map(typeList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(typeList.getTypeListId());
            dto.setName(typeList.getName());
            dto.setActive(typeList.isActive());

            List<File> iconFiles = fileMapper.selectFileByDivisionAndParentId("TYPE", typeList.getTypeListId());
            dto.setIconFile(iconFiles.get(0)); // 여러 개의 파일 중 첫 번째 파일을 설정

            return dto;
        }).collect(Collectors.toList());    }

    @Override
    public List<ItemListResponseDto> getOptionLists() {
        return optionListMapper.selectAll().stream().map(optionList -> {
            ItemListResponseDto dto = new ItemListResponseDto();
            dto.setItemId(optionList.getOptionListId());
            dto.setName(optionList.getName());
            dto.setActive(optionList.isActive());

            List<File> iconFiles = fileMapper.selectFileByDivisionAndParentId("OPTION", optionList.getOptionListId());
            dto.setIconFile(iconFiles.get(0)); // 여러 개의 파일 중 첫 번째 파일을 설정

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<File> selectAllOfTypes() {
        return fileMapper.selectAllOfTypes();
    }
}
